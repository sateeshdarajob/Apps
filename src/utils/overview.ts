import type {
  Decision,
  Dependency,
  Incident,
  Milestone,
  Program,
  RagStatus,
  Release,
  Risk,
  Kpi,
  Probability,
  ImpactLevel,
} from '@/types';

const MS_PER_DAY = 86_400_000;

const PROBABILITY_SCORE: Record<Probability, number> = {
  rare: 1,
  unlikely: 2,
  possible: 3,
  likely: 4,
  almostCertain: 5,
};

const IMPACT_SCORE: Record<ImpactLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function daysBetween(from: string | Date, to: string | Date): number {
  const start = typeof from === 'string' ? new Date(from) : from;
  const end = typeof to === 'string' ? new Date(to) : to;
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function daysRemaining(targetDate: string, asOf = new Date()): number {
  return daysBetween(asOf, targetDate);
}

/** Positive = ahead of schedule (days buffer); negative = behind. */
export function scheduleVarianceDays(program: Program, asOf = new Date()): number {
  const totalDays = Math.max(daysBetween(program.startDate, program.targetDate), 1);
  const elapsedDays = Math.min(Math.max(daysBetween(program.startDate, asOf), 0), totalDays);
  const expectedPct = (elapsedDays / totalDays) * 100;
  const variancePct = program.percentComplete - expectedPct;
  return Math.round((variancePct / 100) * totalDays);
}

export function riskScore(risk: Risk): number {
  return PROBABILITY_SCORE[risk.probability] * IMPACT_SCORE[risk.impact];
}

export function isOpenRisk(risk: Risk): boolean {
  return !['closed', 'accepted', 'completed', 'cancelled'].includes(risk.status);
}

export function isHighCriticalRisk(risk: Risk): boolean {
  return isOpenRisk(risk) && (risk.severity === 'high' || risk.severity === 'critical');
}

export function isCriticalBlocker(dependency: Dependency): boolean {
  return (
    dependency.isBlocker &&
    (dependency.status === 'blocked' || dependency.status === 'atRisk') &&
    (dependency.impact === 'high' || dependency.impact === 'critical')
  );
}

export function isPendingDecision(decision: Decision): boolean {
  return decision.status === 'proposed' || decision.status === 'inReview';
}

export function isOpenPriorityIncident(incident: Incident): boolean {
  const open = !['resolved', 'closed', 'cancelled', 'completed'].includes(incident.status);
  return open && (incident.severity === 'sev1' || incident.severity === 'sev2');
}

export function isUpcomingRelease(release: Release, asOf = new Date()): boolean {
  if (release.status === 'released' || release.status === 'rolledBack') return false;
  return daysRemaining(release.plannedDate, asOf) >= -7;
}

export function milestoneBucket(
  milestone: Milestone,
  asOf = new Date(),
): 'completed' | 'inProgress' | 'atRisk' | 'delayed' {
  if (milestone.status === 'completed') return 'completed';
  if (milestone.status === 'missed' || milestone.status === 'slipped') return 'delayed';
  if (daysRemaining(milestone.plannedDate, asOf) < 0) {
    return 'delayed';
  }
  if (
    milestone.status === 'atRisk' ||
    milestone.status === 'blocked' ||
    milestone.rag === 'amber'
  ) {
    return 'atRisk';
  }
  if (milestone.status === 'inProgress' || milestone.status === 'notStarted') return 'inProgress';
  return 'inProgress';
}

export type ExecutiveKpi = Kpi & {
  href?: string;
};

export function buildExecutiveKpis(input: {
  programs: Program[];
  milestones: Milestone[];
  dependencies: Dependency[];
  risks: Risk[];
  releases: Release[];
  incidents: Incident[];
  decisions: Decision[];
  asOf?: Date;
}): ExecutiveKpi[] {
  const asOf = input.asOf ?? new Date();
  const activePrograms = input.programs.filter(
    (p) => p.status !== 'closed' && p.status !== 'proposed',
  );
  const onTrackPct =
    activePrograms.length === 0
      ? 0
      : Math.round(
          (activePrograms.filter((p) => p.rag === 'green').length / activePrograms.length) * 100,
        );

  const dueMilestones = input.milestones.filter((m) => m.status !== 'cancelled');
  const onTimeMilestones = dueMilestones.filter((m) => {
    if (m.status === 'completed') {
      if (!m.actualDate) return true;
      return daysBetween(m.plannedDate, m.actualDate) <= 0;
    }
    return daysRemaining(m.plannedDate, asOf) >= 0 && m.rag !== 'red';
  });
  const milestoneOnTimePct =
    dueMilestones.length === 0
      ? 0
      : Math.round((onTimeMilestones.length / dueMilestones.length) * 100);

  const criticalBlockers = input.dependencies.filter(isCriticalBlocker);
  const highCriticalRisks = input.risks.filter(isHighCriticalRisk);
  const upcomingReleases = input.releases.filter((r) => isUpcomingRelease(r, asOf));
  const openIncidents = input.incidents.filter(isOpenPriorityIncident);
  const pendingDecisions = input.decisions.filter(isPendingDecision);

  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'kpi-active-programs',
      label: 'Active Programs',
      value: activePrograms.length,
      trend: 'flat',
      status: activePrograms.length > 0 ? 'green' : 'grey',
      helperText: 'Excludes closed',
      category: 'portfolio',
      asOfDate,
      href: '#program-health',
    },
    {
      id: 'kpi-on-track',
      label: 'Programs On Track',
      value: onTrackPct,
      unit: '%',
      delta: onTrackPct >= 70 ? 4 : -6,
      trend: onTrackPct >= 70 ? 'up' : 'down',
      status: onTrackPct >= 70 ? 'green' : onTrackPct >= 50 ? 'amber' : 'red',
      helperText: 'vs prior period',
      category: 'delivery',
      asOfDate,
      href: '#program-health',
    },
    {
      id: 'kpi-milestone-ontime',
      label: 'Milestone On-Time',
      value: milestoneOnTimePct,
      unit: '%',
      delta: milestoneOnTimePct >= 75 ? 3 : -5,
      trend: milestoneOnTimePct >= 75 ? 'up' : 'down',
      status: milestoneOnTimePct >= 75 ? 'green' : milestoneOnTimePct >= 55 ? 'amber' : 'red',
      helperText: 'Completed + upcoming',
      category: 'delivery',
      asOfDate,
      href: '#upcoming-milestones',
    },
    {
      id: 'kpi-critical-blockers',
      label: 'Critical Blockers',
      value: criticalBlockers.length,
      delta: criticalBlockers.length > 0 ? 1 : 0,
      trend: criticalBlockers.length > 0 ? 'up' : 'flat',
      status:
        criticalBlockers.length === 0 ? 'green' : criticalBlockers.length <= 2 ? 'amber' : 'red',
      helperText: 'High/critical impact',
      category: 'risk',
      asOfDate,
      href: '#critical-blockers',
    },
    {
      id: 'kpi-high-risks',
      label: 'High/Critical Risks',
      value: highCriticalRisks.length,
      delta: highCriticalRisks.length > 1 ? 1 : 0,
      trend: highCriticalRisks.length > 1 ? 'up' : 'flat',
      status:
        highCriticalRisks.length === 0 ? 'green' : highCriticalRisks.length <= 2 ? 'amber' : 'red',
      helperText: 'Open items',
      category: 'risk',
      asOfDate,
      href: '/risks',
    },
    {
      id: 'kpi-upcoming-releases',
      label: 'Upcoming Releases',
      value: upcomingReleases.length,
      trend: 'flat',
      status: upcomingReleases.some((r) => r.readinessScore < 70)
        ? 'amber'
        : upcomingReleases.length > 0
          ? 'green'
          : 'grey',
      helperText: 'Next windows',
      category: 'delivery',
      asOfDate,
      href: '#upcoming-releases',
    },
    {
      id: 'kpi-open-incidents',
      label: 'Open P0/P1 Incidents',
      value: openIncidents.length,
      delta: openIncidents.length > 0 ? 1 : -1,
      trend: openIncidents.length > 0 ? 'up' : 'down',
      status: openIncidents.length === 0 ? 'green' : openIncidents.length === 1 ? 'amber' : 'red',
      helperText: 'Sev1 / Sev2',
      category: 'quality',
      asOfDate,
      href: '/incidents',
    },
    {
      id: 'kpi-pending-decisions',
      label: 'Pending Decisions',
      value: pendingDecisions.length,
      delta: pendingDecisions.filter((d) => d.escalationRequired).length,
      trend: pendingDecisions.length > 0 ? 'up' : 'flat',
      status:
        pendingDecisions.length === 0
          ? 'green'
          : pendingDecisions.some((d) => d.escalationRequired)
            ? 'red'
            : 'amber',
      helperText: 'Stakeholder action',
      category: 'portfolio',
      asOfDate,
      href: '#decisions-needed',
    },
  ];
}

export function ragDistribution(
  programs: Program[],
): { status: RagStatus; label: string; value: number }[] {
  const counts: Record<'green' | 'amber' | 'red', number> = { green: 0, amber: 0, red: 0 };
  for (const program of programs) {
    if (program.rag === 'green' || program.rag === 'amber' || program.rag === 'red') {
      counts[program.rag] += 1;
    }
  }
  return [
    { status: 'green', label: 'Green', value: counts.green },
    { status: 'amber', label: 'Amber', value: counts.amber },
    { status: 'red', label: 'Red', value: counts.red },
  ];
}

export function milestoneStatusSeries(milestones: Milestone[], asOf = new Date()) {
  const buckets = { completed: 0, inProgress: 0, atRisk: 0, delayed: 0 };
  for (const milestone of milestones) {
    if (milestone.status === 'cancelled') continue;
    buckets[milestoneBucket(milestone, asOf)] += 1;
  }
  return [
    {
      label: 'Milestones',
      completed: buckets.completed,
      inProgress: buckets.inProgress,
      atRisk: buckets.atRisk,
      delayed: buckets.delayed,
    },
  ];
}
