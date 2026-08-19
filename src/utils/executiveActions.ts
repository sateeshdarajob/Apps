import type {
  Capacity,
  Decision,
  Dependency,
  Incident,
  Program,
  Release,
  Risk,
} from '@/types';
import type { ProgramHealthAssessment } from './healthRules';
import { isCriticalDependency, isOverdueDependency } from './dependencies';
import { computeOverallReadiness, isActiveRelease, isReleaseAtRisk } from './releases';
import {
  exceedsSla,
  isOpenIncident,
  isP0,
  isP1,
  toPriorityLabel,
} from './incidents';
import {
  isOverdueDecision,
  requiresExecutiveAction,
} from './decisions';
import { isPendingDecision, daysRemaining, scheduleVarianceDays } from './overview';
import { deriveCapacityMetrics } from './resources';

export type ActionCategory =
  | 'immediate'
  | 'attention'
  | 'upcomingDecision'
  | 'information';

export type ExecutiveAction = {
  id: string;
  category: ActionCategory;
  title: string;
  program: string;
  programId?: string;
  reason: string;
  owner: string;
  dueDate: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendedAction: string;
  href: string;
};

const CATEGORY_ORDER: ActionCategory[] = [
  'immediate',
  'attention',
  'upcomingDecision',
  'information',
];

export const ACTION_CATEGORY_META: Record<
  ActionCategory,
  { label: string; emoji: string; color: string }
> = {
  immediate: { label: 'Immediate Action', emoji: '🔴', color: '#C62828' },
  attention: { label: 'Attention Required', emoji: '🟠', color: '#C47A11' },
  upcomingDecision: { label: 'Upcoming Decision', emoji: '🟡', color: '#B78900' },
  information: { label: 'Information', emoji: '🔵', color: '#1565A0' },
};

type ActionInput = {
  programs: Program[];
  dependencies: Dependency[];
  risks: Risk[];
  releases: Release[];
  incidents: Incident[];
  decisions: Decision[];
  capacities: Capacity[];
  assessments: ProgramHealthAssessment[];
  asOf?: Date;
};

export function buildExecutiveActions(input: ActionInput): ExecutiveAction[] {
  const {
    programs,
    dependencies,
    releases,
    incidents,
    decisions,
    capacities,
    assessments,
    asOf = new Date(),
  } = input;
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  const actions: ExecutiveAction[] = [];

  const overdueCriticalDeps = dependencies.filter(
    (dep) => isCriticalDependency(dep) && isOverdueDependency(dep, asOf),
  );
  if (overdueCriticalDeps.length > 0) {
    actions.push({
      id: 'act-deps-overdue',
      category: 'immediate',
      title: `${overdueCriticalDeps.length} critical dependencies overdue`,
      program: 'Portfolio',
      reason: overdueCriticalDeps
        .slice(0, 2)
        .map((dep) => dep.description)
        .join('; '),
      owner: overdueCriticalDeps[0].escalationOwner.name,
      dueDate: overdueCriticalDeps[0].dueDate,
      severity: 'critical',
      recommendedAction: 'Escalate owners and clear blockers within 48 hours.',
      href: '/dependencies',
    });
  }

  const gapTeams = capacities
    .map(deriveCapacityMetrics)
    .filter((row) => row.significantGap);
  const gapPrograms = new Set(gapTeams.map((row) => row.programId).filter(Boolean));
  if (gapPrograms.size > 0) {
    actions.push({
      id: 'act-capacity-gaps',
      category: 'attention',
      title: `${gapPrograms.size} programs have capacity gaps`,
      program: 'Portfolio',
      reason: gapTeams
        .slice(0, 2)
        .map((row) => `${row.team} gap ${row.gapPct}%`)
        .join('; '),
      owner: 'Engineering leadership',
      dueDate: asOf.toISOString().slice(0, 10),
      severity: 'high',
      recommendedAction: 'Reallocate capacity or defer demand for over-committed teams.',
      href: '/resources',
    });
  }

  for (const release of releases.filter((item) => isActiveRelease(item) && isReleaseAtRisk(item))) {
    const readiness = computeOverallReadiness(release);
    actions.push({
      id: `act-rel-${release.id}`,
      category: readiness < 70 ? 'immediate' : 'attention',
      title: `Release ${release.version} readiness is ${readiness}%`,
      program: nameById.get(release.programId) ?? release.programId,
      programId: release.programId,
      reason: release.notes ?? 'Below 85% readiness threshold',
      owner: release.releaseManager.name,
      dueDate: release.plannedDate,
      severity: readiness < 70 ? 'critical' : 'high',
      recommendedAction: 'Close readiness gaps before go/no-go.',
      href: '/releases',
    });
  }

  const execDecisions = decisions.filter(
    (decision) => isPendingDecision(decision) && requiresExecutiveAction(decision),
  );
  if (execDecisions.length > 0) {
    actions.push({
      id: 'act-exec-decisions',
      category: 'upcomingDecision',
      title: `${execDecisions.length} executive decisions pending`,
      program: 'Portfolio',
      reason: execDecisions
        .slice(0, 2)
        .map((decision) => decision.title)
        .join('; '),
      owner: execDecisions[0].owner.name,
      dueDate: execDecisions[0].dueDate,
      severity: 'high',
      recommendedAction: 'Schedule decision forum and clear blockers.',
      href: '/decisions',
    });
  }

  for (const incident of incidents.filter(
    (item) =>
      (isP0(item) && isOpenIncident(item)) ||
      (isP1(item) && (exceedsSla(item) || item.postmortemStatus === 'overdue')),
  )) {
    actions.push({
      id: `act-inc-${incident.id}`,
      category: isP0(incident) && isOpenIncident(incident) ? 'immediate' : 'attention',
      title: isOpenIncident(incident)
        ? `${toPriorityLabel(incident.severity)} open: ${incident.title}`
        : `${toPriorityLabel(incident.severity)} RCA/postmortem overdue`,
      program: nameById.get(incident.programId) ?? incident.programId,
      programId: incident.programId,
      reason: incident.rootCause ?? incident.description,
      owner: incident.owner.name,
      dueDate: incident.correctiveActions[0]?.dueDate ?? asOf.toISOString().slice(0, 10),
      severity: isP0(incident) ? 'critical' : 'high',
      recommendedAction: isOpenIncident(incident)
        ? 'Drive mitigation and executive status cadence.'
        : 'Complete postmortem and overdue corrective actions.',
      href: '/incidents',
    });
  }

  for (const program of programs) {
    const variance = scheduleVarianceDays(program, asOf);
    if (variance < -7) {
      actions.push({
        id: `act-sched-${program.id}`,
        category: variance < -14 ? 'immediate' : 'attention',
        title: `${program.name} milestone delayed by ${Math.abs(variance)} days`,
        program: program.name,
        programId: program.id,
        reason: program.ragComment ?? 'Schedule variance exceeds control threshold',
        owner: program.owner.name,
        dueDate: program.targetDate,
        severity: variance < -14 ? 'critical' : 'high',
        recommendedAction: 'Publish recovery plan and protect critical path.',
        href: `/programs/${program.id}`,
      });
    }
  }

  for (const decision of decisions.filter(
    (item) => isPendingDecision(item) && daysRemaining(item.dueDate, asOf) <= 7,
  )) {
    if (actions.some((action) => action.id === 'act-exec-decisions' && requiresExecutiveAction(decision))) {
      // already summarized
    }
    if (!requiresExecutiveAction(decision) || daysRemaining(decision.dueDate, asOf) > 0) {
      actions.push({
        id: `act-dec-${decision.id}`,
        category: isOverdueDecision(decision, asOf) ? 'immediate' : 'upcomingDecision',
        title: decision.title,
        program: decision.programId
          ? (nameById.get(decision.programId) ?? decision.programId)
          : 'Portfolio',
        programId: decision.programId,
        reason: decision.description,
        owner: decision.owner.name,
        dueDate: decision.dueDate,
        severity: decision.impact === 'critical' ? 'critical' : 'high',
        recommendedAction: decision.blocksMilestone
          ? 'Resolve before milestone to avoid schedule slip.'
          : 'Confirm decision owner and target date.',
        href: '/decisions',
      });
    }
  }

  for (const assessment of assessments.filter((item) => item.rag === 'red').slice(0, 3)) {
    if (actions.some((action) => action.programId === assessment.programId)) continue;
    actions.push({
      id: `act-health-${assessment.programId}`,
      category: 'information',
      title: `${assessment.programName} health score ${assessment.healthScore}`,
      program: assessment.programName,
      programId: assessment.programId,
      reason: assessment.primaryReason,
      owner: 'TPM',
      dueDate: asOf.toISOString().slice(0, 10),
      severity: 'medium',
      recommendedAction: assessment.recommendedAction,
      href: `/programs/${assessment.programId}`,
    });
  }

  // Deduplicate by title+program and rank by category
  const seen = new Set<string>();
  return actions
    .filter((action) => {
      const key = `${action.category}:${action.title}:${action.program}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
        severityRank(b.severity) - severityRank(a.severity),
    )
    .slice(0, 12);
}

function severityRank(severity: ExecutiveAction['severity']): number {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity];
}
