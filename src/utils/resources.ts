import type { Capacity, Kpi, Program } from '@/types';

export type CapacityMetrics = Capacity & {
  utilizationPct: number;
  gapPct: number;
  overUtilized: boolean;
  demandExceedsCapacity: boolean;
  significantGap: boolean;
  risk: 'none' | 'watch' | 'atRisk' | 'critical';
};

/** Recalculate derived capacity fields from raw allocated / demand inputs. */
export function deriveCapacityMetrics(raw: Capacity): CapacityMetrics {
  const availableCapacity = Math.max(raw.totalCapacity - raw.allocatedCapacity, 0);
  const utilization = raw.totalCapacity > 0 ? raw.allocatedCapacity / raw.totalCapacity : 0;
  const capacityGap = raw.totalCapacity - raw.demand;
  const gapPct =
    raw.totalCapacity > 0 ? Math.max(raw.demand - raw.totalCapacity, 0) / raw.totalCapacity : 0;
  const utilizationPct = Math.round(utilization * 100);
  const overUtilized = utilizationPct > 90;
  const demandExceedsCapacity = raw.demand > raw.totalCapacity;
  const significantGap = gapPct > 0.15;
  let risk: CapacityMetrics['risk'] = 'none';
  if (significantGap || (overUtilized && demandExceedsCapacity)) risk = 'critical';
  else if (overUtilized || demandExceedsCapacity) risk = 'atRisk';
  else if (utilizationPct >= 80) risk = 'watch';

  return {
    ...raw,
    availableCapacity,
    utilization,
    capacityGap,
    utilizationPct,
    gapPct: Math.round(gapPct * 100),
    overUtilized,
    demandExceedsCapacity,
    significantGap,
    risk,
  };
}

export function buildCapacityKpis(capacities: Capacity[], asOf = new Date()): Kpi[] {
  const rows = capacities.map(deriveCapacityMetrics);
  const total = rows.reduce((sum, row) => sum + row.totalCapacity, 0);
  const allocated = rows.reduce((sum, row) => sum + row.allocatedCapacity, 0);
  const available = Math.max(total - allocated, 0);
  const utilizationPct = total > 0 ? Math.round((allocated / total) * 100) : 0;
  const demand = rows.reduce((sum, row) => sum + row.demand, 0);
  const gap = total - demand;
  const gapPct = total > 0 ? Math.round((Math.max(demand - total, 0) / total) * 100) : 0;
  const teamsOver90 = new Set(
    rows.filter((row) => row.overUtilized).map((row) => row.teamId),
  ).size;
  const asOfDate = asOf.toISOString().slice(0, 10);

  return [
    {
      id: 'cap-kpi-total',
      label: 'Total Engineering Capacity',
      value: total,
      unit: 'pw',
      trend: 'flat',
      status: 'green',
      helperText: 'Person-weeks',
      category: 'delivery',
      asOfDate,
      href: '#capacity-table',
    },
    {
      id: 'cap-kpi-allocated',
      label: 'Allocated Capacity',
      value: allocated,
      unit: 'pw',
      trend: 'flat',
      status: utilizationPct > 90 ? 'amber' : 'green',
      helperText: 'Committed to initiatives',
      category: 'delivery',
      asOfDate,
      href: '#allocation-chart',
    },
    {
      id: 'cap-kpi-available',
      label: 'Available Capacity',
      value: available,
      unit: 'pw',
      trend: available < 5 ? 'down' : 'flat',
      status: available === 0 ? 'red' : available < 5 ? 'amber' : 'green',
      helperText: 'Unallocated',
      category: 'delivery',
      asOfDate,
      href: '#capacity-table',
    },
    {
      id: 'cap-kpi-util',
      label: 'Utilization %',
      value: utilizationPct,
      unit: '%',
      trend: utilizationPct > 90 ? 'up' : 'flat',
      status: utilizationPct > 90 ? 'red' : utilizationPct >= 80 ? 'amber' : 'green',
      helperText: 'Allocated / total',
      category: 'delivery',
      asOfDate,
      href: '#utilization-chart',
    },
    {
      id: 'cap-kpi-gap',
      label: 'Capacity Gap',
      value: gapPct,
      unit: '%',
      delta: gap,
      trend: gapPct > 15 ? 'up' : 'flat',
      status: gapPct > 15 ? 'red' : gapPct > 0 ? 'amber' : 'green',
      helperText: gap < 0 ? `${Math.abs(gap)} pw short` : `${gap} pw buffer`,
      category: 'risk',
      asOfDate,
      href: '#gap-chart',
    },
    {
      id: 'cap-kpi-over90',
      label: 'Teams Over 90% Utilization',
      value: teamsOver90,
      trend: teamsOver90 > 0 ? 'up' : 'flat',
      status: teamsOver90 === 0 ? 'green' : teamsOver90 === 1 ? 'amber' : 'red',
      helperText: 'Auto-flagged',
      category: 'risk',
      asOfDate,
      href: '#capacity-table',
    },
  ];
}

export function aggregateCapacityVsDemand(capacities: Capacity[]) {
  const byTeam = new Map<string, { label: string; capacity: number; demand: number }>();
  for (const row of capacities.map(deriveCapacityMetrics)) {
    const existing = byTeam.get(row.teamId) ?? {
      label: row.team,
      capacity: 0,
      demand: 0,
    };
    existing.capacity += row.totalCapacity;
    existing.demand += row.demand;
    byTeam.set(row.teamId, existing);
  }
  return [...byTeam.values()].map((item) => ({
    label: item.label,
    capacity: item.capacity,
    demand: item.demand,
  }));
}

export function aggregateUtilizationByTeam(capacities: Capacity[]) {
  const byTeam = new Map<
    string,
    { label: string; allocated: number; capacity: number }
  >();
  for (const row of capacities.map(deriveCapacityMetrics)) {
    const existing = byTeam.get(row.teamId) ?? {
      label: row.team,
      allocated: 0,
      capacity: 0,
    };
    existing.allocated += row.allocatedCapacity;
    existing.capacity += row.totalCapacity;
    byTeam.set(row.teamId, existing);
  }
  return [...byTeam.values()].map((item) => ({
    label: item.label,
    value: item.capacity > 0 ? Math.round((item.allocated / item.capacity) * 100) : 0,
  }));
}

export function aggregateAllocationByInitiative(
  capacities: Capacity[],
  programs: Program[],
) {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  const map = new Map<string, number>();
  for (const row of capacities) {
    const label = row.programId
      ? (nameById.get(row.programId) ?? row.programId)
      : 'Unassigned';
    map.set(label, (map.get(label) ?? 0) + row.allocatedCapacity);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function aggregateCapacityGap(capacities: Capacity[]) {
  return capacities.map(deriveCapacityMetrics).map((row) => ({
    label: row.team,
    value: row.gapPct,
    rawGap: row.capacityGap,
    flagged: row.significantGap,
  }));
}

export type CapacityTableRow = CapacityMetrics & {
  programName: string;
};

export function buildCapacityTableRows(
  capacities: Capacity[],
  programs: Program[],
): CapacityTableRow[] {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  const byTeam = new Map<string, CapacityMetrics>();

  for (const raw of capacities) {
    const metrics = deriveCapacityMetrics(raw);
    const existing = byTeam.get(metrics.teamId);
    if (!existing) {
      byTeam.set(metrics.teamId, metrics);
      continue;
    }
    const mergedRaw: Capacity = {
      ...existing,
      totalCapacity: existing.totalCapacity + metrics.totalCapacity,
      allocatedCapacity: existing.allocatedCapacity + metrics.allocatedCapacity,
      demand: existing.demand + metrics.demand,
      programId: existing.programId,
    };
    byTeam.set(metrics.teamId, deriveCapacityMetrics(mergedRaw));
  }

  return [...byTeam.values()]
    .map((row) => ({
      ...row,
      programName: row.programId ? (nameById.get(row.programId) ?? row.programId) : '—',
    }))
    .sort((a, b) => b.utilizationPct - a.utilizationPct);
}
