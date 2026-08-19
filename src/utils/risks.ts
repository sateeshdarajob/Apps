import type { EscalationLevel, ImpactLevel, Kpi, Probability, Program, Risk } from '@/types';
import { daysRemaining, isOpenRisk, riskScore } from './overview';

const PROBABILITY_ORDER: Probability[] = [
  'almostCertain',
  'likely',
  'possible',
  'unlikely',
  'rare',
];

const IMPACT_ORDER: ImpactLevel[] = ['low', 'medium', 'high', 'critical'];

export function isCriticalRisk(risk: Risk): boolean {
  return isOpenRisk(risk) && risk.severity === 'critical';
}

export function isHighRisk(risk: Risk): boolean {
  return isOpenRisk(risk) && risk.severity === 'high';
}

export function isOverdueRisk(risk: Risk, asOf = new Date()): boolean {
  return isOpenRisk(risk) && daysRemaining(risk.targetResolutionDate, asOf) < 0;
}

export function isDueWithinDays(risk: Risk, days: number, asOf = new Date()): boolean {
  if (!isOpenRisk(risk)) return false;
  const remaining = daysRemaining(risk.targetResolutionDate, asOf);
  return remaining >= 0 && remaining <= days;
}

export function hasNoMitigation(risk: Risk): boolean {
  return isOpenRisk(risk) && !risk.mitigation.trim();
}

export function requiresExecutiveAttention(risk: Risk): boolean {
  return (
    isOpenRisk(risk) &&
    (risk.severity === 'critical' ||
      risk.escalationLevel === 'executive' ||
      risk.escalationLevel === 'vp' ||
      (risk.severity === 'high' && isOverdueRisk(risk)))
  );
}

export function riskAgingBucket(ageInDays: number): '0-7' | '8-14' | '15-30' | '30+' {
  if (ageInDays <= 7) return '0-7';
  if (ageInDays <= 14) return '8-14';
  if (ageInDays <= 30) return '15-30';
  return '30+';
}

export function buildRiskKpis(risks: Risk[], asOf = new Date()): Kpi[] {
  const open = risks.filter(isOpenRisk);
  const critical = open.filter(isCriticalRisk);
  const high = open.filter(isHighRisk);
  const dueSoon = open.filter((item) => isDueWithinDays(item, 7, asOf));
  const overdue = open.filter((item) => isOverdueRisk(item, asOf));
  const noMitigation = open.filter(hasNoMitigation);
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'risk-kpi-total',
      label: 'Total Risks',
      value: open.length,
      trend: 'flat',
      status: open.length <= 4 ? 'green' : open.length <= 7 ? 'amber' : 'red',
      helperText: 'Open items',
      category: 'risk',
      asOfDate,
      href: '#risk-table',
    },
    {
      id: 'risk-kpi-critical',
      label: 'Critical Risks',
      value: critical.length,
      delta: critical.length,
      trend: critical.length > 0 ? 'up' : 'flat',
      status: critical.length === 0 ? 'green' : 'red',
      helperText: 'Severity critical',
      category: 'risk',
      asOfDate,
      href: '#risk-table',
    },
    {
      id: 'risk-kpi-high',
      label: 'High Risks',
      value: high.length,
      trend: high.length > 2 ? 'up' : 'flat',
      status: high.length === 0 ? 'green' : high.length <= 2 ? 'amber' : 'red',
      helperText: 'Severity high',
      category: 'risk',
      asOfDate,
      href: '#risk-table',
    },
    {
      id: 'risk-kpi-due-7',
      label: 'Risks Due in 7 Days',
      value: dueSoon.length,
      trend: 'flat',
      status: dueSoon.length === 0 ? 'green' : dueSoon.length <= 2 ? 'amber' : 'red',
      helperText: 'Near-term targets',
      category: 'risk',
      asOfDate,
      href: '#risk-table',
    },
    {
      id: 'risk-kpi-overdue',
      label: 'Overdue Risks',
      value: overdue.length,
      delta: overdue.length > 0 ? 1 : -1,
      trend: overdue.length > 0 ? 'up' : 'down',
      status: overdue.length === 0 ? 'green' : 'red',
      helperText: 'Past target date',
      category: 'risk',
      asOfDate,
      href: '#risk-aging',
    },
    {
      id: 'risk-kpi-no-mitigation',
      label: 'Risks Without Mitigation',
      value: noMitigation.length,
      trend: noMitigation.length > 0 ? 'up' : 'flat',
      status: noMitigation.length === 0 ? 'green' : 'red',
      helperText: 'Missing mitigation plan',
      category: 'risk',
      asOfDate,
      href: '#risk-table',
    },
  ];
}

export function buildProbabilityImpactHeatmap(risks: Risk[]) {
  const open = risks.filter(isOpenRisk);
  const cells = PROBABILITY_ORDER.flatMap((probability) =>
    IMPACT_ORDER.map((impact) => {
      const matching = open.filter(
        (risk) => risk.probability === probability && risk.impact === impact,
      );
      return {
        probability,
        impact,
        count: matching.length,
        score: matching.reduce((sum, risk) => sum + riskScore(risk), 0),
      };
    }),
  );

  return { probabilities: PROBABILITY_ORDER, impacts: IMPACT_ORDER, cells };
}

export function aggregateRiskTrend(risks: Risk[]) {
  // Deterministic mock trend derived from current open volume.
  const open = risks.filter(isOpenRisk).length;
  const base = Math.max(open - 3, 1);
  return [
    { label: 'W-5', value: base },
    { label: 'W-4', value: base + 1 },
    { label: 'W-3', value: base + 2 },
    { label: 'W-2', value: Math.max(open - 1, 1) },
    { label: 'W-1', value: open },
    { label: 'Now', value: open },
  ];
}

export function aggregateRisksBySeverity(risks: Risk[]) {
  const order = ['critical', 'high', 'medium', 'low'] as const;
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const risk of risks.filter(isOpenRisk)) {
    counts[risk.severity] += 1;
  }
  return order.map((severity) => ({
    label: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: counts[severity],
    severity,
  }));
}

export function aggregateRiskAging(risks: Risk[]) {
  const order = ['0-7', '8-14', '15-30', '30+'] as const;
  const counts = { '0-7': 0, '8-14': 0, '15-30': 0, '30+': 0 };
  for (const risk of risks.filter(isOpenRisk)) {
    counts[riskAgingBucket(risk.ageInDays)] += 1;
  }
  return order.map((bucket) => ({
    label: bucket === '0-7' ? '0-7 days' : bucket,
    value: counts[bucket],
    bucket,
  }));
}

export type RiskTableRow = Risk & {
  programName: string;
  score: number;
  overdue: boolean;
  executiveAttention: boolean;
};

export function buildRiskTableRows(
  risks: Risk[],
  programs: Program[],
  asOf = new Date(),
): RiskTableRow[] {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  return risks
    .map((risk) => ({
      ...risk,
      programName: nameById.get(risk.programId) ?? risk.programId,
      score: riskScore(risk),
      overdue: isOverdueRisk(risk, asOf),
      executiveAttention: requiresExecutiveAttention(risk),
    }))
    .sort(
      (a, b) =>
        Number(b.executiveAttention) - Number(a.executiveAttention) ||
        b.score - a.score ||
        b.ageInDays - a.ageInDays,
    );
}

export function formatEscalation(level: EscalationLevel): string {
  if (level === 'none') return 'None';
  if (level === 'vp') return 'VP';
  return level.charAt(0).toUpperCase() + level.slice(1);
}
