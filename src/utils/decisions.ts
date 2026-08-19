import type { Decision, Kpi, Program } from '@/types';
import { daysRemaining, isPendingDecision } from './overview';

export function isOverdueDecision(decision: Decision, asOf = new Date()): boolean {
  return isPendingDecision(decision) && daysRemaining(decision.dueDate, asOf) < 0;
}

export function isHighImpactDecision(decision: Decision): boolean {
  return (
    isPendingDecision(decision) &&
    (decision.impact === 'high' || decision.impact === 'critical')
  );
}

export function requiresExecutiveAction(decision: Decision): boolean {
  return (
    isPendingDecision(decision) &&
    (decision.escalationRequired ||
      decision.impact === 'critical' ||
      decision.priority === 'critical')
  );
}

export function isBlockingDecision(decision: Decision): boolean {
  return isPendingDecision(decision) && Boolean(decision.blocksMilestone);
}

export function decisionAgingBucket(ageInDays: number): '0-7' | '8-14' | '15-30' | '30+' {
  if (ageInDays <= 7) return '0-7';
  if (ageInDays <= 14) return '8-14';
  if (ageInDays <= 30) return '15-30';
  return '30+';
}

export function buildDecisionKpis(decisions: Decision[], asOf = new Date()): Kpi[] {
  const pending = decisions.filter(isPendingDecision);
  const overdue = pending.filter((item) => isOverdueDecision(item, asOf));
  const highImpact = pending.filter(isHighImpactDecision);
  const execAction = pending.filter(requiresExecutiveAction);
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'dec-kpi-pending',
      label: 'Pending Decisions',
      value: pending.length,
      trend: 'flat',
      status: pending.length <= 3 ? 'green' : pending.length <= 5 ? 'amber' : 'red',
      helperText: 'Proposed / in review',
      category: 'delivery',
      asOfDate,
      href: '#decision-table',
    },
    {
      id: 'dec-kpi-overdue',
      label: 'Overdue Decisions',
      value: overdue.length,
      trend: overdue.length > 0 ? 'up' : 'flat',
      status: overdue.length === 0 ? 'green' : 'red',
      helperText: 'Past due date',
      category: 'risk',
      asOfDate,
      href: '#decision-aging',
    },
    {
      id: 'dec-kpi-high',
      label: 'High Impact Decisions',
      value: highImpact.length,
      trend: 'flat',
      status: highImpact.length <= 2 ? 'amber' : 'red',
      helperText: 'High / critical impact',
      category: 'risk',
      asOfDate,
      href: '#decision-table',
    },
    {
      id: 'dec-kpi-exec',
      label: 'Decisions Requiring Executive Action',
      value: execAction.length,
      trend: execAction.length > 0 ? 'up' : 'flat',
      status: execAction.length === 0 ? 'green' : execAction.length === 1 ? 'amber' : 'red',
      helperText: 'Escalation required',
      category: 'risk',
      asOfDate,
      href: '#decision-table',
    },
  ];
}

export function aggregateDecisionAging(decisions: Decision[]) {
  const order = ['0-7', '8-14', '15-30', '30+'] as const;
  const counts = { '0-7': 0, '8-14': 0, '15-30': 0, '30+': 0 };
  for (const decision of decisions.filter(isPendingDecision)) {
    counts[decisionAgingBucket(decision.ageInDays)] += 1;
  }
  return order.map((bucket) => ({
    label: bucket === '0-7' ? '0-7 days' : bucket,
    value: counts[bucket],
    bucket,
  }));
}

export type DecisionTableRow = Decision & {
  programName: string;
  overdue: boolean;
  blocking: boolean;
  executive: boolean;
};

export function buildDecisionTableRows(
  decisions: Decision[],
  programs: Program[],
  asOf = new Date(),
): DecisionTableRow[] {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  return decisions
    .map((decision) => ({
      ...decision,
      programName: decision.programId
        ? (nameById.get(decision.programId) ?? decision.programId)
        : 'Portfolio',
      overdue: isOverdueDecision(decision, asOf),
      blocking: isBlockingDecision(decision),
      executive: requiresExecutiveAction(decision),
    }))
    .sort(
      (a, b) =>
        Number(b.overdue) - Number(a.overdue) ||
        Number(b.blocking) - Number(a.blocking) ||
        b.ageInDays - a.ageInDays,
    );
}
