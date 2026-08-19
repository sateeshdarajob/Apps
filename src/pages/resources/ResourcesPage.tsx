import { useMemo } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  ChartCard,
  DualSeriesBarChart,
  SimpleBarChart,
} from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { DataTable } from '@/components/tables';
import { useResourcesData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateAllocationByInitiative,
  aggregateCapacityGap,
  aggregateCapacityVsDemand,
  aggregateUtilizationByTeam,
  buildCapacityKpis,
  buildCapacityTableRows,
  titleCase,
} from '@/utils';
import type { CapacityTableRow } from '@/utils';

export function ResourcesPage() {
  const { programs, capacities, isLoading } = useResourcesData();

  const kpis = useMemo(() => buildCapacityKpis(capacities), [capacities]);
  const vsDemand = useMemo(() => aggregateCapacityVsDemand(capacities), [capacities]);
  const utilization = useMemo(() => aggregateUtilizationByTeam(capacities), [capacities]);
  const allocation = useMemo(
    () => aggregateAllocationByInitiative(capacities, programs),
    [capacities, programs],
  );
  const gaps = useMemo(() => aggregateCapacityGap(capacities), [capacities]);
  const rows = useMemo(() => buildCapacityTableRows(capacities, programs), [capacities, programs]);

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading capacity…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title="Resources & Capacity"
        description="Engineering capacity versus roadmap demand — utilization, gaps, and team risk flags."
      />

      <KpiCardGrid metrics={kpis} columns={6} onMetricClick={handleKpiClick} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <ChartCard
          id="capacity-demand"
          title="Capacity vs Demand"
          subtitle="Person-weeks by team"
          height={260}
        >
          <DualSeriesBarChart data={vsDemand} />
        </ChartCard>
        <ChartCard
          id="utilization-chart"
          title="Utilization by team"
          subtitle="Allocated / capacity %"
          height={260}
        >
          <SimpleBarChart data={utilization} color="#0B3A53" />
        </ChartCard>
        <ChartCard
          id="allocation-chart"
          title="Allocation by initiative"
          subtitle="Person-weeks committed"
          height={260}
        >
          <SimpleBarChart data={allocation} color="#1565A0" />
        </ChartCard>
        <ChartCard
          id="gap-chart"
          title="Capacity gap"
          subtitle="Demand shortfall % (flagged >15%)"
          height={260}
        >
          <SimpleBarChart data={gaps} color="#C62828" />
        </ChartCard>
      </Box>

      <SectionCard
        id="capacity-table"
        title="Team capacity register"
        description="Auto-flags: utilization >90%, demand > capacity, capacity gap >15%."
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Util > 90%" sx={chipSx('#C62828')} />
          <Chip size="small" label="Demand > capacity" sx={chipSx('#C47A11')} />
          <Chip size="small" label="Gap > 15%" sx={chipSx('#1565A0')} />
        </Stack>

        <DataTable
          columns={capacityColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search team…"
          emptyMessage="No capacity rows match the current filters."
          getRowSx={(row) => ({
            ...(row.significantGap || row.overUtilized
              ? { bgcolor: 'rgba(198, 40, 40, 0.06)' }
              : row.demandExceedsCapacity
                ? { bgcolor: 'rgba(196, 122, 17, 0.06)' }
                : {}),
          })}
          getSortValue={(row, columnId) =>
            (row as unknown as Record<string, unknown>)[columnId] as
              | string
              | number
              | boolean
              | null
              | undefined
          }
          getFilterText={(row) =>
            [row.team, row.programName, row.risk, String(row.utilizationPct)].join(' ')
          }
        />
      </SectionCard>
    </Box>
  );
}

function chipSx(color: string) {
  return {
    bgcolor: `${color}18`,
    color,
    border: `1px solid ${color}55`,
    fontWeight: 600,
  };
}

const capacityColumns: TableColumn<CapacityTableRow>[] = [
  { id: 'team', label: 'Team' },
  { id: 'totalCapacity', label: 'Capacity', align: 'right' },
  { id: 'allocatedCapacity', label: 'Allocated', align: 'right' },
  { id: 'availableCapacity', label: 'Available', align: 'right' },
  { id: 'demand', label: 'Demand', align: 'right' },
  {
    id: 'utilizationPct',
    label: 'Utilization',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={row.overUtilized ? 700 : 500}
        color={row.overUtilized ? 'error.main' : 'text.primary'}
      >
        {row.utilizationPct}%
      </Typography>
    ),
  },
  {
    id: 'gapPct',
    label: 'Capacity Gap',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={row.significantGap ? 700 : 500}
        color={row.significantGap ? 'error.main' : 'text.primary'}
      >
        {row.gapPct}% ({row.capacityGap > 0 ? '+' : ''}
        {row.capacityGap} pw)
      </Typography>
    ),
  },
  {
    id: 'risk',
    label: 'Risk',
    render: (row) => (
      <Chip
        size="small"
        label={titleCase(row.risk)}
        color={
          row.risk === 'critical' ? 'error' : row.risk === 'atRisk' ? 'warning' : 'default'
        }
        variant={row.risk === 'none' || row.risk === 'watch' ? 'outlined' : 'filled'}
      />
    ),
  },
];
