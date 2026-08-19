import type {
  Defect,
  Incident,
  Kpi,
  Program,
  ReadinessFlag,
  Release,
} from '@/types';
import { daysRemaining } from './overview';

const READINESS_FLAG_SCORE: Record<ReadinessFlag, number> = {
  complete: 100,
  waived: 100,
  inProgress: 50,
  notStarted: 0,
  blocked: 0,
};

export const READINESS_DIMENSIONS = [
  { key: 'codeComplete', label: 'Code Complete' },
  { key: 'qaComplete', label: 'QA Complete' },
  { key: 'securityComplete', label: 'Security' },
  { key: 'performanceComplete', label: 'Performance' },
  { key: 'documentationComplete', label: 'Documentation' },
  { key: 'businessReadiness', label: 'Business Readiness' },
] as const;

export type ReadinessDimensionKey = (typeof READINESS_DIMENSIONS)[number]['key'];

export function computeOverallReadiness(release: Release): number {
  const scores = READINESS_DIMENSIONS.map(
    (dimension) => READINESS_FLAG_SCORE[release[dimension.key]],
  );
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

export function isReleaseAtRisk(release: Release): boolean {
  if (release.status === 'released' || release.status === 'rolledBack') return false;
  return computeOverallReadiness(release) < 85;
}

export function isActiveRelease(release: Release): boolean {
  return release.status !== 'released' && release.status !== 'rolledBack';
}

export function isOnTimeRelease(release: Release): boolean {
  if (!release.actualDate) return daysRemaining(release.plannedDate) >= 0;
  return release.actualDate <= release.plannedDate;
}

export function buildReleaseKpis(
  releases: Release[],
  defects: Defect[],
  incidents: Incident[],
  asOf = new Date(),
): Kpi[] {
  const quarterStart = new Date(asOf.getFullYear(), Math.floor(asOf.getMonth() / 3) * 3, 1);
  const thisQuarter = releases.filter((release) => new Date(release.plannedDate) >= quarterStart);
  const completed = releases.filter(
    (release) => release.status === 'released' || release.status === 'rolledBack',
  );
  const onTimePct =
    completed.length === 0
      ? 100
      : Math.round(
          (completed.filter(isOnTimeRelease).length / completed.length) * 100,
        );
  const active = releases.filter(isActiveRelease);
  const avgReadiness =
    active.length === 0
      ? 100
      : Math.round(
          active.reduce((sum, release) => sum + computeOverallReadiness(release), 0) /
            active.length,
        );
  const criticalDefects = defects.filter(
    (defect) =>
      (defect.severity === 'critical' || defect.severity === 'blocker') &&
      !['fixed', 'verified', 'closed', 'wontFix'].includes(defect.status),
  ).length;
  const regressionPass = Math.max(100 - criticalDefects * 4 - active.filter(isReleaseAtRisk).length * 3, 55);
  const rollbacks = releases.filter((release) => release.status === 'rolledBack').length;
  const prodIncidents = incidents.filter(
    (incident) =>
      incident.severity === 'sev1' ||
      incident.severity === 'sev2' ||
      incident.impactedServices.some((service) => service.includes('api') || service.includes('ui')),
  ).length;
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'rel-kpi-quarter',
      label: 'Releases This Quarter',
      value: thisQuarter.length,
      trend: 'flat',
      status: 'green',
      helperText: 'Planned in current quarter',
      category: 'delivery',
      asOfDate,
      href: '#release-calendar',
    },
    {
      id: 'rel-kpi-ontime',
      label: 'On-Time Release %',
      value: onTimePct,
      unit: '%',
      trend: onTimePct >= 80 ? 'up' : 'down',
      status: onTimePct >= 85 ? 'green' : onTimePct >= 70 ? 'amber' : 'red',
      helperText: 'Completed releases',
      category: 'delivery',
      asOfDate,
      href: '#release-trend',
    },
    {
      id: 'rel-kpi-readiness',
      label: 'Average Readiness %',
      value: avgReadiness,
      unit: '%',
      trend: avgReadiness >= 85 ? 'up' : 'down',
      status: avgReadiness >= 85 ? 'green' : avgReadiness >= 70 ? 'amber' : 'red',
      helperText: 'Active releases',
      category: 'quality',
      asOfDate,
      href: '#release-readiness',
    },
    {
      id: 'rel-kpi-defects',
      label: 'Critical Open Defects',
      value: criticalDefects,
      trend: criticalDefects > 0 ? 'up' : 'flat',
      status: criticalDefects === 0 ? 'green' : criticalDefects <= 2 ? 'amber' : 'red',
      helperText: 'Blocker / critical',
      category: 'quality',
      asOfDate,
      href: '#release-table',
    },
    {
      id: 'rel-kpi-regression',
      label: 'Regression Pass %',
      value: regressionPass,
      unit: '%',
      trend: regressionPass >= 85 ? 'up' : 'down',
      status: regressionPass >= 85 ? 'green' : regressionPass >= 70 ? 'amber' : 'red',
      helperText: 'Derived from open risk signals',
      category: 'quality',
      asOfDate,
      href: '#release-readiness',
    },
    {
      id: 'rel-kpi-rollbacks',
      label: 'Rollbacks',
      value: rollbacks,
      trend: rollbacks > 0 ? 'up' : 'flat',
      status: rollbacks === 0 ? 'green' : 'red',
      helperText: 'Production rollbacks',
      category: 'risk',
      asOfDate,
      href: '#release-table',
    },
    {
      id: 'rel-kpi-incidents',
      label: 'Production Incidents',
      value: prodIncidents,
      trend: prodIncidents > 2 ? 'up' : 'flat',
      status: prodIncidents <= 1 ? 'green' : prodIncidents <= 3 ? 'amber' : 'red',
      helperText: 'P0/P1 and production services',
      category: 'risk',
      asOfDate,
      href: '#release-table',
    },
  ];
}

export function aggregateReleaseReadiness(releases: Release[]) {
  return releases
    .filter(isActiveRelease)
    .map((release) => ({
      label: release.version,
      value: computeOverallReadiness(release),
      releaseId: release.id,
      atRisk: computeOverallReadiness(release) < 85,
    }))
    .sort((a, b) => a.value - b.value);
}

export function aggregateReleaseTrend(releases: Release[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((label, index) => {
    const month = index + 1;
    const count = releases.filter((release) => {
      const date = new Date(release.plannedDate);
      return date.getMonth() + 1 === month;
    }).length;
    return { label, value: count };
  });
}

export function buildReleaseCalendar(releases: Release[]) {
  return [...releases]
    .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))
    .map((release) => ({
      ...release,
      readiness: computeOverallReadiness(release),
      atRisk: isReleaseAtRisk(release),
      daysLeft: daysRemaining(release.plannedDate),
    }));
}

export type ReleaseTableRow = Release & {
  programName: string;
  readiness: number;
  atRisk: boolean;
  criticalDefectCount: number;
};

export function buildReleaseTableRows(
  releases: Release[],
  programs: Program[],
  defects: Defect[],
): ReleaseTableRow[] {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  return releases
    .map((release) => {
      const readiness = computeOverallReadiness(release);
      return {
        ...release,
        programName: nameById.get(release.programId) ?? release.programId,
        readiness,
        atRisk: isReleaseAtRisk(release),
        readinessScore: readiness,
        criticalDefectCount: defects.filter(
          (defect) =>
            defect.releaseId === release.id &&
            (defect.severity === 'critical' || defect.severity === 'blocker') &&
            !['fixed', 'verified', 'closed', 'wontFix'].includes(defect.status),
        ).length,
      };
    })
    .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate));
}

export function readinessChecklist(release: Release) {
  return READINESS_DIMENSIONS.map((dimension) => ({
    key: dimension.key,
    label: dimension.label,
    status: release[dimension.key],
    score: READINESS_FLAG_SCORE[release[dimension.key]],
  }));
}
