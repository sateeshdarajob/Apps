import type {
  DeliveryPeriodMetric,
  Kpi,
  Milestone,
  Program,
  Sprint,
  WorkItemAgingBucket,
} from '@/types';
import { daysBetween, daysRemaining, milestoneBucket } from './overview';

export function sprintPredictability(sprint: Sprint): number {
  if (sprint.committedPoints <= 0) return 0;
  return Math.round((sprint.completedPoints / sprint.committedPoints) * 100);
}

export function buildDeliveryKpis(input: {
  sprints: Sprint[];
  milestones: Milestone[];
  periodMetrics: DeliveryPeriodMetric[];
  asOf?: Date;
}): Kpi[] {
  const asOf = input.asOf ?? new Date();
  const asOfDate = asOf.toISOString().slice(0, 10);
  const completedSprints = input.sprints.filter((sprint) => sprint.status === 'completed');
  const predictabilitySource = completedSprints.length > 0 ? completedSprints : input.sprints;

  const predictability =
    predictabilitySource.length === 0
      ? 0
      : Math.round(
          predictabilitySource.reduce((sum, sprint) => sum + sprintPredictability(sprint), 0) /
            predictabilitySource.length,
        );

  const activeMilestones = input.milestones.filter((item) => item.status !== 'cancelled');
  const onTimeMilestones = activeMilestones.filter((item) => {
    if (item.status === 'completed') {
      if (!item.actualDate) return true;
      return daysBetween(item.plannedDate, item.actualDate) <= 0;
    }
    return daysRemaining(item.plannedDate, asOf) >= 0 && item.rag !== 'red';
  });
  const milestoneAdherence =
    activeMilestones.length === 0
      ? 0
      : Math.round((onTimeMilestones.length / activeMilestones.length) * 100);

  const onTimeDelivery =
    input.periodMetrics.length === 0
      ? 0
      : Math.round(
          input.periodMetrics.reduce((sum, item) => sum + item.onTimePct, 0) /
            input.periodMetrics.length,
        );

  const originalScope = input.periodMetrics.reduce((sum, item) => sum + item.originalScope, 0);
  const addedScope = input.periodMetrics.reduce((sum, item) => sum + item.addedScope, 0);
  const scopeChangePct = originalScope === 0 ? 0 : Math.round((addedScope / originalScope) * 100);

  const committed = input.sprints.reduce((sum, sprint) => sum + sprint.committedPoints, 0);
  const completed = input.sprints.reduce((sum, sprint) => sum + sprint.completedPoints, 0);
  const completionPct = committed === 0 ? 0 : Math.round((completed / committed) * 100);

  const blockedItems = input.sprints.reduce((sum, sprint) => sum + sprint.blockedItems, 0);

  const carryover = input.sprints.reduce((sum, sprint) => sum + sprint.carriedOverPoints, 0);
  const carryoverPct = committed === 0 ? 0 : Math.round((carryover / committed) * 100);

  const totalDefects = input.sprints.reduce((sum, sprint) => sum + sprint.defectCount, 0);
  const escapedDefects = input.sprints.reduce((sum, sprint) => sum + sprint.escapedDefects, 0);
  const defectLeakagePct =
    totalDefects === 0 ? 0 : Math.round((escapedDefects / totalDefects) * 100);

  return [
    {
      id: 'del-kpi-predictability',
      label: 'Sprint Predictability',
      value: predictability,
      unit: '%',
      delta: predictability >= 85 ? 3 : -4,
      trend: predictability >= 85 ? 'up' : 'down',
      status: predictability >= 85 ? 'green' : predictability >= 70 ? 'amber' : 'red',
      helperText: 'Completed / committed',
      category: 'delivery',
      asOfDate,
      href: '#delivery-table',
    },
    {
      id: 'del-kpi-milestone',
      label: 'Milestone Adherence',
      value: milestoneAdherence,
      unit: '%',
      delta: milestoneAdherence >= 75 ? 2 : -5,
      trend: milestoneAdherence >= 75 ? 'up' : 'down',
      status: milestoneAdherence >= 75 ? 'green' : milestoneAdherence >= 55 ? 'amber' : 'red',
      helperText: 'On-time milestones',
      category: 'delivery',
      asOfDate,
      href: '#milestone-completion',
    },
    {
      id: 'del-kpi-ontime',
      label: 'On-Time Delivery',
      value: onTimeDelivery,
      unit: '%',
      delta: onTimeDelivery >= 80 ? 2 : -6,
      trend: onTimeDelivery >= 80 ? 'up' : 'down',
      status: onTimeDelivery >= 80 ? 'green' : onTimeDelivery >= 65 ? 'amber' : 'red',
      helperText: 'Trailing periods',
      category: 'delivery',
      asOfDate,
      href: '#delivery-trend',
    },
    {
      id: 'del-kpi-scope',
      label: 'Scope Change',
      value: scopeChangePct,
      unit: '%',
      delta: scopeChangePct > 15 ? 4 : -1,
      trend: scopeChangePct > 15 ? 'up' : 'flat',
      status: scopeChangePct <= 10 ? 'green' : scopeChangePct <= 20 ? 'amber' : 'red',
      helperText: 'Added / original',
      category: 'delivery',
      asOfDate,
      href: '#scope-change',
    },
    {
      id: 'del-kpi-completion',
      label: 'Completion',
      value: completionPct,
      unit: '%',
      delta: completionPct >= 75 ? 3 : -3,
      trend: completionPct >= 75 ? 'up' : 'down',
      status: completionPct >= 75 ? 'green' : completionPct >= 50 ? 'amber' : 'red',
      helperText: 'Points completed',
      category: 'delivery',
      asOfDate,
      href: '#planned-vs-actual',
    },
    {
      id: 'del-kpi-blocked',
      label: 'Blocked Items',
      value: blockedItems,
      delta: blockedItems > 3 ? 2 : 0,
      trend: blockedItems > 3 ? 'up' : 'flat',
      status: blockedItems === 0 ? 'green' : blockedItems <= 4 ? 'amber' : 'red',
      helperText: 'Across sprints',
      category: 'risk',
      asOfDate,
      href: '#delivery-table',
    },
    {
      id: 'del-kpi-carryover',
      label: 'Carryover',
      value: carryoverPct,
      unit: '%',
      delta: carryoverPct > 15 ? 3 : -2,
      trend: carryoverPct > 15 ? 'up' : 'down',
      status: carryoverPct <= 10 ? 'green' : carryoverPct <= 20 ? 'amber' : 'red',
      helperText: 'Of committed',
      category: 'delivery',
      asOfDate,
      href: '#delivery-table',
    },
    {
      id: 'del-kpi-leakage',
      label: 'Defect Leakage',
      value: defectLeakagePct,
      unit: '%',
      delta: defectLeakagePct > 20 ? 2 : -1,
      trend: defectLeakagePct > 20 ? 'up' : 'down',
      status: defectLeakagePct <= 15 ? 'green' : defectLeakagePct <= 25 ? 'amber' : 'red',
      helperText: 'Escaped / found',
      category: 'quality',
      asOfDate,
      href: '#work-item-aging',
    },
  ];
}

const PERIOD_ORDER = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function aggregatePlannedVsActual(metrics: DeliveryPeriodMetric[]) {
  const byLabel = new Map<string, { label: string; planned: number; actual: number }>();
  for (const metric of metrics) {
    const current = byLabel.get(metric.label) ?? {
      label: metric.label,
      planned: 0,
      actual: 0,
    };
    current.planned += metric.planned;
    current.actual += metric.actual;
    byLabel.set(metric.label, current);
  }
  return [...byLabel.values()].sort(
    (a, b) => PERIOD_ORDER.indexOf(a.label) - PERIOD_ORDER.indexOf(b.label),
  );
}

export function aggregateScopeChange(metrics: DeliveryPeriodMetric[]) {
  const byLabel = new Map<
    string,
    { label: string; original: number; added: number; removed: number }
  >();
  for (const metric of metrics) {
    const current = byLabel.get(metric.label) ?? {
      label: metric.label,
      original: 0,
      added: 0,
      removed: 0,
    };
    current.original += metric.originalScope;
    current.added += metric.addedScope;
    current.removed += metric.removedScope;
    byLabel.set(metric.label, current);
  }
  return [...byLabel.values()].sort(
    (a, b) => PERIOD_ORDER.indexOf(a.label) - PERIOD_ORDER.indexOf(b.label),
  );
}

export function aggregateOnTimeTrend(metrics: DeliveryPeriodMetric[]) {
  const byLabel = new Map<string, { label: string; total: number; count: number }>();
  for (const metric of metrics) {
    const current = byLabel.get(metric.label) ?? { label: metric.label, total: 0, count: 0 };
    current.total += metric.onTimePct;
    current.count += 1;
    byLabel.set(metric.label, current);
  }
  return [...byLabel.values()]
    .sort((a, b) => PERIOD_ORDER.indexOf(a.label) - PERIOD_ORDER.indexOf(b.label))
    .map((item) => ({
      label: item.label,
      value: item.count === 0 ? 0 : Math.round(item.total / item.count),
    }));
}

export function aggregateWorkItemAging(items: WorkItemAgingBucket[]) {
  const order: WorkItemAgingBucket['bucket'][] = ['0-7', '8-14', '15-30', '30+'];
  const counts: Record<WorkItemAgingBucket['bucket'], number> = {
    '0-7': 0,
    '8-14': 0,
    '15-30': 0,
    '30+': 0,
  };
  for (const item of items) {
    counts[item.bucket] += item.count;
  }
  return order.map((bucket) => ({
    label:
      bucket === '0-7'
        ? '0-7 days'
        : bucket === '8-14'
          ? '8-14'
          : bucket === '15-30'
            ? '15-30'
            : '30+',
    value: counts[bucket],
    bucket,
  }));
}

export function sprintPredictabilityTrend(sprints: Sprint[], limit = 10) {
  return [...sprints]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(-limit)
    .map((sprint) => ({
      label: `S${sprint.number}`,
      value: sprintPredictability(sprint),
      sprintId: sprint.id,
      programId: sprint.programId,
      name: sprint.name,
    }));
}

export function buildDeliveryTableRows(sprints: Sprint[], programs: Program[]) {
  const programName = (id: string) => programs.find((program) => program.id === id)?.name ?? id;
  return [...sprints]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((sprint) => ({
      ...sprint,
      programName: programName(sprint.programId),
      planned: sprint.committedPoints,
      completed: sprint.completedPoints,
      carryover: sprint.carriedOverPoints,
      blocked: sprint.blockedItems,
      defects: sprint.defectCount,
      predictability: sprintPredictability(sprint),
    }));
}

export function milestoneCompletionForDelivery(milestones: Milestone[], asOf = new Date()) {
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
