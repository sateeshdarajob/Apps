import type { Dependency, Kpi } from '@/types';
import { daysRemaining } from './overview';

export function isOpenDependency(dependency: Dependency): boolean {
  return dependency.status !== 'completed' && dependency.status !== 'cancelled';
}

export function isCriticalDependency(dependency: Dependency): boolean {
  return (
    isOpenDependency(dependency) &&
    (dependency.impact === 'critical' ||
      dependency.priority === 'critical' ||
      dependency.impact === 'high')
  );
}

export function isOverdueDependency(dependency: Dependency, asOf = new Date()): boolean {
  return isOpenDependency(dependency) && daysRemaining(dependency.dueDate, asOf) < 0;
}

export function isBlockingDependency(dependency: Dependency): boolean {
  return isOpenDependency(dependency) && (dependency.isBlocker || dependency.status === 'blocked');
}

export function isDueWithinDays(dependency: Dependency, days: number, asOf = new Date()): boolean {
  if (!isOpenDependency(dependency)) return false;
  const remaining = daysRemaining(dependency.dueDate, asOf);
  return remaining >= 0 && remaining <= days;
}

export function dependencyAgingBucket(ageInDays: number): '0-7' | '8-14' | '15-30' | '30+' {
  if (ageInDays <= 7) return '0-7';
  if (ageInDays <= 14) return '8-14';
  if (ageInDays <= 30) return '15-30';
  return '30+';
}

export function buildDependencyKpis(dependencies: Dependency[], asOf = new Date()): Kpi[] {
  const open = dependencies.filter(isOpenDependency);
  const critical = open.filter(isCriticalDependency);
  const overdue = open.filter((item) => isOverdueDependency(item, asOf));
  const blocking = open.filter(isBlockingDependency);
  const dueSoon = open.filter((item) => isDueWithinDays(item, 7, asOf));
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'dep-kpi-total',
      label: 'Total Dependencies',
      value: open.length,
      trend: 'flat',
      status: open.length > 0 ? 'amber' : 'green',
      helperText: 'Open items',
      category: 'delivery',
      asOfDate,
      href: '#dependency-table',
    },
    {
      id: 'dep-kpi-critical',
      label: 'Critical Dependencies',
      value: critical.length,
      delta: critical.length > 2 ? 1 : 0,
      trend: critical.length > 2 ? 'up' : 'flat',
      status: critical.length === 0 ? 'green' : critical.length <= 2 ? 'amber' : 'red',
      helperText: 'High / critical impact',
      category: 'risk',
      asOfDate,
      href: '#dependency-table',
    },
    {
      id: 'dep-kpi-overdue',
      label: 'Overdue Dependencies',
      value: overdue.length,
      delta: overdue.length > 0 ? 1 : -1,
      trend: overdue.length > 0 ? 'up' : 'down',
      status: overdue.length === 0 ? 'green' : overdue.length === 1 ? 'amber' : 'red',
      helperText: 'Past due date',
      category: 'risk',
      asOfDate,
      href: '#dependency-aging',
    },
    {
      id: 'dep-kpi-blocking',
      label: 'Blocking Dependencies',
      value: blocking.length,
      delta: blocking.length > 1 ? 1 : 0,
      trend: blocking.length > 1 ? 'up' : 'flat',
      status: blocking.length === 0 ? 'green' : blocking.length <= 2 ? 'amber' : 'red',
      helperText: 'Active blockers',
      category: 'risk',
      asOfDate,
      href: '#dependency-table',
    },
    {
      id: 'dep-kpi-due-7',
      label: 'Due in Next 7 Days',
      value: dueSoon.length,
      trend: 'flat',
      status: dueSoon.length === 0 ? 'green' : dueSoon.length <= 2 ? 'amber' : 'red',
      helperText: 'Near-term due dates',
      category: 'delivery',
      asOfDate,
      href: '#dependency-table',
    },
  ];
}

export function aggregateDependencyAging(dependencies: Dependency[]) {
  const order = ['0-7', '8-14', '15-30', '30+'] as const;
  const counts: Record<(typeof order)[number], number> = {
    '0-7': 0,
    '8-14': 0,
    '15-30': 0,
    '30+': 0,
  };

  for (const item of dependencies.filter(isOpenDependency)) {
    counts[dependencyAgingBucket(item.ageInDays)] += 1;
  }

  return order.map((bucket) => ({
    label: bucket === '0-7' ? '0-7 days' : bucket,
    value: counts[bucket],
    bucket,
  }));
}

export function aggregateDependenciesBySeverity(dependencies: Dependency[]) {
  const order = ['critical', 'high', 'medium', 'low'] as const;
  const counts: Record<(typeof order)[number], number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const item of dependencies.filter(isOpenDependency)) {
    counts[item.impact] += 1;
  }

  return order.map((impact) => ({
    label: impact.charAt(0).toUpperCase() + impact.slice(1),
    value: counts[impact],
    impact,
  }));
}

export function aggregateDependenciesByTeam(dependencies: Dependency[]) {
  const map = new Map<string, { label: string; value: number; teamId: string }>();
  for (const item of dependencies.filter(isOpenDependency)) {
    const current = map.get(item.blockingTeam.id) ?? {
      label: item.blockingTeam.name,
      value: 0,
      teamId: item.blockingTeam.id,
    };
    current.value += 1;
    map.set(item.blockingTeam.id, current);
  }
  return [...map.values()].sort((a, b) => b.value - a.value);
}

export type DependencyTableRow = Dependency & {
  programName: string;
  overdue: boolean;
  critical: boolean;
  blocking: boolean;
};

export function buildDependencyTableRows(
  dependencies: Dependency[],
  programs: { id: string; name: string }[],
  asOf = new Date(),
): DependencyTableRow[] {
  return dependencies.map((item) => ({
    ...item,
    programName: programs.find((program) => program.id === item.programId)?.name ?? item.programId,
    overdue: isOverdueDependency(item, asOf),
    critical: isCriticalDependency(item),
    blocking: isBlockingDependency(item),
  }));
}
