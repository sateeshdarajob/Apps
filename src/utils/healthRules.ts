import type {
  Capacity,
  Decision,
  Dependency,
  Incident,
  Program,
  RagStatus,
  Release,
  Risk,
} from '@/types';
import { isCriticalBlocker, isOpenRisk, scheduleVarianceDays, isPendingDecision } from './overview';
import { isCriticalDependency, isOverdueDependency } from './dependencies';
import { isCriticalRisk } from './risks';
import { computeOverallReadiness, isActiveRelease } from './releases';
import {
  exceedsSla,
  isOpenIncident,
  isP0,
  isP1,
} from './incidents';
import { deriveCapacityMetrics } from './resources';
import { isBlockingDecision, isOverdueDecision } from './decisions';

export type HealthFinding = {
  ruleId: string;
  rag: 'amber' | 'red';
  reason: string;
  recommendedAction: string;
  weight: number;
};

export type ProgramHealthAssessment = {
  programId: string;
  programName: string;
  healthScore: number;
  rag: RagStatus;
  primaryReason: string;
  primaryDrivers: string[];
  recommendedAction: string;
  findings: HealthFinding[];
};

type HealthInput = {
  program: Program;
  dependencies: Dependency[];
  risks: Risk[];
  releases: Release[];
  incidents: Incident[];
  decisions: Decision[];
  capacities: Capacity[];
  asOf?: Date;
};

/**
 * Deterministic Program Health Rules Engine.
 * Does not use an LLM — pure business rules with weighted score deductions.
 */
export function evaluateProgramHealth(input: HealthInput): ProgramHealthAssessment {
  const {
    program,
    dependencies,
    risks,
    releases,
    incidents,
    decisions,
    capacities,
    asOf = new Date(),
  } = input;

  const programDeps = dependencies.filter((item) => item.programId === program.id);
  const programRisks = risks.filter((item) => item.programId === program.id);
  const programReleases = releases.filter((item) => item.programId === program.id);
  const programIncidents = incidents.filter((item) => item.programId === program.id);
  const programDecisions = decisions.filter((item) => item.programId === program.id);
  const programCapacity = capacities.filter((item) => item.programId === program.id);

  const findings: HealthFinding[] = [];
  const variance = scheduleVarianceDays(program, asOf);

  // Rule 1–2: schedule variance (negative = behind)
  if (variance < -14) {
    findings.push({
      ruleId: 'schedule-variance-red',
      rag: 'red',
      reason: `Schedule variance ${Math.abs(variance)} days behind plan`,
      recommendedAction: 'Rebaseline milestones and escalate schedule recovery plan.',
      weight: 18,
    });
  } else if (variance < -7) {
    findings.push({
      ruleId: 'schedule-variance-amber',
      rag: 'amber',
      reason: `Schedule variance ${Math.abs(variance)} days behind plan`,
      recommendedAction: 'Protect critical path and add weekly schedule checkpoints.',
      weight: 10,
    });
  }

  // Rule 3: critical dependency overdue
  const overdueCriticalDeps = programDeps.filter(
    (dep) => isCriticalDependency(dep) && isOverdueDependency(dep, asOf),
  );
  if (overdueCriticalDeps.length > 0) {
    const worst = [...overdueCriticalDeps].sort((a, b) => b.ageInDays - a.ageInDays)[0];
    findings.push({
      ruleId: 'critical-dependency-overdue',
      rag: 'red',
      reason: `Critical dependency overdue by ${Math.abs(
        Math.min(
          ...overdueCriticalDeps.map((dep) =>
            Math.round((new Date(dep.dueDate).getTime() - asOf.getTime()) / 86_400_000),
          ),
        ),
      )} days (${worst.description.slice(0, 60)})`,
      recommendedAction: `Escalate dependency owner (${worst.escalationOwner.name}) and unblock ${worst.blockingTeam.name}.`,
      weight: 20,
    });
  }

  // Rule 4: critical risk exists
  if (programRisks.some(isCriticalRisk)) {
    const critical = programRisks.filter(isCriticalRisk)[0];
    findings.push({
      ruleId: 'critical-risk',
      rag: 'red',
      reason: `Critical risk exists: ${critical.title}`,
      recommendedAction: critical.mitigation
        ? `Drive mitigation: ${critical.mitigation}`
        : 'Assign mitigation owner and escalate to executive sponsor.',
      weight: 18,
    });
  }

  // Rule 5: capacity demand exceeds capacity by >15%
  if (programCapacity.length > 0) {
    const totals = programCapacity.reduce(
      (acc, row) => {
        acc.capacity += row.totalCapacity;
        acc.demand += row.demand;
        return acc;
      },
      { capacity: 0, demand: 0 },
    );
    const gapPct =
      totals.capacity > 0
        ? Math.round((Math.max(totals.demand - totals.capacity, 0) / totals.capacity) * 100)
        : 0;
    if (gapPct > 15) {
      findings.push({
        ruleId: 'capacity-gap',
        rag: 'red',
        reason: `Capacity gap ${gapPct}% (demand exceeds capacity)`,
        recommendedAction: 'Reallocate capacity or defer lower-priority scope this quarter.',
        weight: 16,
      });
    }
  }

  // Rules 6–7: release readiness
  for (const release of programReleases.filter(isActiveRelease)) {
    const readiness = computeOverallReadiness(release);
    if (readiness < 70) {
      findings.push({
        ruleId: 'release-readiness-red',
        rag: 'red',
        reason: `Release ${release.version} readiness ${readiness}%`,
        recommendedAction: 'Hold go/no-go and close security/QA/performance gaps before commit.',
        weight: 16,
      });
    } else if (readiness < 85) {
      findings.push({
        ruleId: 'release-readiness-amber',
        rag: 'amber',
        reason: `Release ${release.version} readiness ${readiness}%`,
        recommendedAction: 'Focus remaining readiness workstreams and keep daily readiness stand-up.',
        weight: 10,
      });
    }
  }

  // Rule 8: critical blocker age > 7 days
  const agedBlockers = programDeps.filter(
    (dep) => isCriticalBlocker(dep) && dep.ageInDays > 7,
  );
  if (agedBlockers.length > 0) {
    const blocker = agedBlockers[0];
    findings.push({
      ruleId: 'critical-blocker-age',
      rag: 'red',
      reason: `Critical blocker age ${blocker.ageInDays} days`,
      recommendedAction: `Escalate blocker with ${blocker.escalationOwner.name} within 24 hours.`,
      weight: 15,
    });
  }

  // Rule 9: open P0 incident
  if (programIncidents.some((incident) => isP0(incident) && isOpenIncident(incident))) {
    findings.push({
      ruleId: 'open-p0',
      rag: 'red',
      reason: 'P0 incident is open',
      recommendedAction: 'Activate incident command and provide executive status updates until mitigated.',
      weight: 22,
    });
  }

  // Rule 10: P1 exceeds SLA
  const p1Sla = programIncidents.filter((incident) => isP1(incident) && exceedsSla(incident));
  if (p1Sla.length > 0) {
    const openP1 = p1Sla.some(isOpenIncident);
    findings.push({
      ruleId: 'p1-sla',
      rag: openP1 ? 'red' : 'amber',
      reason: `P1 incident exceeds SLA (${p1Sla.length})`,
      recommendedAction: openP1
        ? 'Restore service and open postmortem clock immediately.'
        : 'Complete overdue P1 postmortem and corrective actions.',
      weight: openP1 ? 14 : 8,
    });
  }

  // Rule 11: overdue decision blocking milestone
  const blockingOverdue = programDecisions.filter(
    (decision) =>
      isPendingDecision(decision) &&
      isBlockingDecision(decision) &&
      isOverdueDecision(decision, asOf),
  );
  if (blockingOverdue.length > 0) {
    findings.push({
      ruleId: 'overdue-blocking-decision',
      rag: 'red',
      reason: `Overdue decision blocking milestone: ${blockingOverdue[0].title}`,
      recommendedAction: `Drive executive decision with ${blockingOverdue[0].owner.name} this week.`,
      weight: 16,
    });
  }

  // Deduplicate by rule family preference (keep strongest)
  const deduped = dedupeFindings(findings);
  const deduction = deduped.reduce((sum, item) => sum + item.weight, 0);
  const healthScore = Math.max(0, Math.min(100, 100 - deduction));

  const rag: RagStatus = deduped.some((item) => item.rag === 'red')
    ? 'red'
    : deduped.some((item) => item.rag === 'amber')
      ? 'amber'
      : healthScore >= 85
        ? 'green'
        : 'amber';

  const primaryDrivers = deduped
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((item) => item.reason);

  const top = deduped.sort((a, b) => b.weight - a.weight)[0];

  return {
    programId: program.id,
    programName: program.name,
    healthScore,
    rag,
    primaryReason: top?.reason ?? 'No rule violations — program within control thresholds.',
    primaryDrivers:
      primaryDrivers.length > 0
        ? primaryDrivers
        : ['Delivery, risk, and capacity signals within thresholds'],
    recommendedAction:
      top?.recommendedAction ?? 'Continue standard TPM cadence and monitor weekly health.',
    findings: deduped,
  };
}

function dedupeFindings(findings: HealthFinding[]): HealthFinding[] {
  const byRule = new Map<string, HealthFinding>();
  for (const finding of findings) {
    const family = finding.ruleId.replace(/-red$|-amber$/, '');
    const existing = byRule.get(family);
    if (!existing || finding.weight > existing.weight) {
      byRule.set(family, finding);
    }
  }
  return [...byRule.values()];
}

export function evaluatePortfolioHealth(input: {
  programs: Program[];
  dependencies: Dependency[];
  risks: Risk[];
  releases: Release[];
  incidents: Incident[];
  decisions: Decision[];
  capacities: Capacity[];
  asOf?: Date;
}): ProgramHealthAssessment[] {
  return input.programs
    .map((program) =>
      evaluateProgramHealth({
        program,
        dependencies: input.dependencies,
        risks: input.risks,
        releases: input.releases,
        incidents: input.incidents,
        decisions: input.decisions,
        capacities: input.capacities,
        asOf: input.asOf,
      }),
    )
    .sort((a, b) => a.healthScore - b.healthScore);
}

export function capacityGapForProgram(capacities: Capacity[], programId: string): number {
  const rows = capacities.filter((item) => item.programId === programId).map(deriveCapacityMetrics);
  if (rows.length === 0) return 0;
  const total = rows.reduce((sum, row) => sum + row.totalCapacity, 0);
  const demand = rows.reduce((sum, row) => sum + row.demand, 0);
  return total > 0 ? Math.round((Math.max(demand - total, 0) / total) * 100) : 0;
}

export function openCriticalRiskCount(risks: Risk[]): number {
  return risks.filter((risk) => isOpenRisk(risk) && risk.severity === 'critical').length;
}
