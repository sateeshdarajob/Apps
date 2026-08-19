import type { Incident, IncidentSeverity, Kpi, Program } from '@/types';
import { daysRemaining } from './overview';

/** P0 = sev1, P1 = sev2 for governance views. */
export function toPriorityLabel(severity: IncidentSeverity): 'P0' | 'P1' | 'P2' | 'P3' {
  if (severity === 'sev1') return 'P0';
  if (severity === 'sev2') return 'P1';
  if (severity === 'sev3') return 'P2';
  return 'P3';
}

export function isOpenIncident(incident: Incident): boolean {
  return !['resolved', 'closed', 'cancelled', 'completed'].includes(incident.status);
}

export function isP0(incident: Incident): boolean {
  return incident.severity === 'sev1';
}

export function isP1(incident: Incident): boolean {
  return incident.severity === 'sev2';
}

/** P1 SLA threshold in minutes (mock governance rule). */
export const P1_SLA_MINUTES = 60;
export const P0_SLA_MINUTES = 30;

export function exceedsSla(incident: Incident): boolean {
  const mttr = incident.mttrMinutes;
  if (mttr == null) {
    // Open incidents: age vs SLA using start time.
    if (!isOpenIncident(incident)) return false;
    const elapsedMinutes = Math.round(
      (Date.now() - new Date(incident.startTime).getTime()) / 60_000,
    );
    return isP0(incident)
      ? elapsedMinutes > P0_SLA_MINUTES
      : isP1(incident)
        ? elapsedMinutes > P1_SLA_MINUTES
        : false;
  }
  if (isP0(incident)) return mttr > P0_SLA_MINUTES;
  if (isP1(incident)) return mttr > P1_SLA_MINUTES;
  return false;
}

export function isRepeatIncident(incident: Incident, all: Incident[]): boolean {
  const token = incident.title.toLowerCase().split(/[\s—-]+/).slice(0, 3).join(' ');
  return all.filter((other) => {
    if (other.id === incident.id) return false;
    const otherToken = other.title.toLowerCase().split(/[\s—-]+/).slice(0, 3).join(' ');
    return (
      other.programId === incident.programId &&
      (other.title.toLowerCase().includes('repeat') ||
        incident.title.toLowerCase().includes('repeat') ||
        otherToken === token)
    );
  }).length > 0;
}

export function buildIncidentKpis(incidents: Incident[], asOf = new Date()): Kpi[] {
  const p0 = incidents.filter(isP0);
  const p1 = incidents.filter(isP1);
  const open = incidents.filter(isOpenIncident);
  const resolvedWithMttr = incidents.filter((item) => item.mttrMinutes != null);
  const mttr =
    resolvedWithMttr.length === 0
      ? 0
      : Math.round(
          resolvedWithMttr.reduce((sum, item) => sum + (item.mttrMinutes ?? 0), 0) /
            resolvedWithMttr.length,
        );
  const closed = incidents.filter((item) => item.endTime);
  const mtbfDays =
    closed.length < 2
      ? 30
      : Math.round(
          closed
            .map((item) => new Date(item.startTime).getTime())
            .sort((a, b) => a - b)
            .reduce((gaps, time, index, arr) => {
              if (index === 0) return gaps;
              return gaps + (time - arr[index - 1]) / 86_400_000;
            }, 0) /
            (closed.length - 1),
        );
  const slaBreaches = incidents.filter(exceedsSla).length;
  const repeats = incidents.filter((item) => isRepeatIncident(item, incidents)).length;
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'inc-kpi-p0',
      label: 'P0 Incidents',
      value: p0.length,
      trend: p0.some(isOpenIncident) ? 'up' : 'flat',
      status: p0.some(isOpenIncident) ? 'red' : p0.length === 0 ? 'green' : 'amber',
      helperText: 'Severity 1',
      category: 'risk',
      asOfDate,
      href: '#incident-table',
    },
    {
      id: 'inc-kpi-p1',
      label: 'P1 Incidents',
      value: p1.length,
      trend: p1.length > 2 ? 'up' : 'flat',
      status: p1.length === 0 ? 'green' : p1.length <= 2 ? 'amber' : 'red',
      helperText: 'Severity 2',
      category: 'risk',
      asOfDate,
      href: '#incident-table',
    },
    {
      id: 'inc-kpi-open',
      label: 'Open Incidents',
      value: open.length,
      trend: open.length > 0 ? 'up' : 'down',
      status: open.length === 0 ? 'green' : open.some(isP0) ? 'red' : 'amber',
      helperText: 'Active investigations',
      category: 'risk',
      asOfDate,
      href: '#incident-table',
    },
    {
      id: 'inc-kpi-mttr',
      label: 'MTTR',
      value: mttr,
      unit: 'min',
      trend: mttr > 60 ? 'up' : 'down',
      status: mttr <= 45 ? 'green' : mttr <= 90 ? 'amber' : 'red',
      helperText: 'Mean time to restore',
      category: 'quality',
      asOfDate,
      href: '#mttr-trend',
    },
    {
      id: 'inc-kpi-mtbf',
      label: 'MTBF',
      value: mtbfDays,
      unit: 'd',
      trend: mtbfDays >= 14 ? 'up' : 'down',
      status: mtbfDays >= 14 ? 'green' : mtbfDays >= 7 ? 'amber' : 'red',
      helperText: 'Mean time between failures',
      category: 'quality',
      asOfDate,
      href: '#incident-trend',
    },
    {
      id: 'inc-kpi-sla',
      label: 'SLA Breaches',
      value: slaBreaches,
      trend: slaBreaches > 0 ? 'up' : 'flat',
      status: slaBreaches === 0 ? 'green' : slaBreaches === 1 ? 'amber' : 'red',
      helperText: 'P0/P1 SLA exceeded',
      category: 'risk',
      asOfDate,
      href: '#incident-table',
    },
    {
      id: 'inc-kpi-repeat',
      label: 'Repeat Incidents',
      value: repeats,
      trend: repeats > 0 ? 'up' : 'flat',
      status: repeats === 0 ? 'green' : 'red',
      helperText: 'Recurring patterns',
      category: 'risk',
      asOfDate,
      href: '#incident-table',
    },
  ];
}

export function aggregateIncidentTrend(incidents: Incident[]) {
  const weeks = ['W-4', 'W-3', 'W-2', 'W-1', 'Now'];
  const total = incidents.length;
  return weeks.map((label, index) => ({
    label,
    value: Math.max(Math.round((total * (index + 1)) / weeks.length) - (index === 2 ? 1 : 0), 0),
  }));
}

export function aggregateMttrTrend(incidents: Incident[]) {
  const withMttr = incidents.filter((item) => item.mttrMinutes != null);
  const avg =
    withMttr.length === 0
      ? 40
      : Math.round(
          withMttr.reduce((sum, item) => sum + (item.mttrMinutes ?? 0), 0) / withMttr.length,
        );
  return [
    { label: 'W-4', value: Math.max(avg - 20, 15) },
    { label: 'W-3', value: Math.max(avg - 10, 20) },
    { label: 'W-2', value: avg + 5 },
    { label: 'W-1', value: avg },
    { label: 'Now', value: avg },
  ];
}

export function aggregateIncidentsBySeverity(incidents: Incident[]) {
  const order: IncidentSeverity[] = ['sev1', 'sev2', 'sev3', 'sev4'];
  const labels: Record<IncidentSeverity, string> = {
    sev1: 'P0',
    sev2: 'P1',
    sev3: 'P2',
    sev4: 'P3',
  };
  const counts: Record<IncidentSeverity, number> = { sev1: 0, sev2: 0, sev3: 0, sev4: 0 };
  for (const incident of incidents) {
    counts[incident.severity] += 1;
  }
  return order.map((severity) => ({
    label: labels[severity],
    value: counts[severity],
    severity,
  }));
}

export function aggregateIncidentsByService(incidents: Incident[], programs: Program[]) {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  const map = new Map<string, number>();
  for (const incident of incidents) {
    const key = nameById.get(incident.programId) ?? incident.impactedServices[0] ?? 'Unknown';
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export type PostmortemRow = Incident & {
  programName: string;
  priorityLabel: string;
  rca: string;
  correctiveActionCount: number;
  completedActions: number;
  slaBreach: boolean;
  repeat: boolean;
};

export function buildPostmortemRows(
  incidents: Incident[],
  programs: Program[],
): PostmortemRow[] {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  return incidents
    .map((incident) => ({
      ...incident,
      programName: nameById.get(incident.programId) ?? incident.programId,
      priorityLabel: toPriorityLabel(incident.severity),
      rca: incident.rootCause ?? 'Pending',
      correctiveActionCount: incident.correctiveActions.length,
      completedActions: incident.correctiveActions.filter((action) => action.status === 'completed')
        .length,
      slaBreach: exceedsSla(incident),
      repeat: isRepeatIncident(incident, incidents),
    }))
    .sort(
      (a, b) =>
        Number(isOpenIncident(b)) - Number(isOpenIncident(a)) ||
        Number(b.priorityLabel === 'P0') - Number(a.priorityLabel === 'P0') ||
        b.overdueActions - a.overdueActions,
    );
}

export function actionDueLabel(dueDate: string, asOf = new Date()): string {
  const remaining = daysRemaining(dueDate, asOf);
  if (remaining < 0) return `${Math.abs(remaining)}d overdue`;
  if (remaining === 0) return 'Due today';
  return `${remaining}d left`;
}
