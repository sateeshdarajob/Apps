import { useMemo, useState } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  AgingBarChart,
  ChartCard,
  ClickableLineChart,
  DualLineChart,
  MilestoneStackedBar,
  ScopeChangeBar,
} from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useDeliveryData, useGlobalFilters } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateOnTimeTrend,
  aggregatePlannedVsActual,
  aggregateScopeChange,
  aggregateWorkItemAging,
  buildDeliveryKpis,
  buildDeliveryTableRows,
  milestoneCompletionForDelivery,
  sprintPredictabilityTrend,
  titleCase,
} from '@/utils';

type DeliveryRow = ReturnType<typeof buildDeliveryTableRows>[number];

export function DeliveryPage() {
  const { setFilters } = useGlobalFilters();
  const { programs, sprints, milestones, periodMetrics, aging, isLoading } = useDeliveryData();
  const [highlightedSprintId, setHighlightedSprintId] = useState<string | null>(null);
  const [agingFocus, setAgingFocus] = useState<string | null>(null);

  const kpis = useMemo(
    () => buildDeliveryKpis({ sprints, milestones, periodMetrics }),
    [sprints, milestones, periodMetrics],
  );

  const plannedVsActual = useMemo(() => aggregatePlannedVsActual(periodMetrics), [periodMetrics]);
  const scopeChange = useMemo(() => aggregateScopeChange(periodMetrics), [periodMetrics]);
  const onTimeTrend = useMemo(() => aggregateOnTimeTrend(periodMetrics), [periodMetrics]);
  const predictabilityTrend = useMemo(() => sprintPredictabilityTrend(sprints, 10), [sprints]);
  const agingSeries = useMemo(() => aggregateWorkItemAging(aging), [aging]);
  const milestoneSeries = useMemo(() => milestoneCompletionForDelivery(milestones), [milestones]);

  const tableRows = useMemo(() => {
    let rows = buildDeliveryTableRows(sprints, programs);
    if (highlightedSprintId) {
      rows = rows.filter((row) => row.id === highlightedSprintId);
    }
    return rows;
  }, [sprints, programs, highlightedSprintId]);

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading delivery performance…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title="Delivery performance"
        description="Sprint predictability, milestone adherence, and execution signals for TPM-level delivery control."
        actions={
          highlightedSprintId || agingFocus ? (
            <Button
              size="small"
              onClick={() => {
                setHighlightedSprintId(null);
                setAgingFocus(null);
              }}
            >
              Clear drill-down
            </Button>
          ) : undefined
        }
      />

      <KpiCardGrid metrics={kpis} columns={4} onMetricClick={handleKpiClick} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
        }}
      >
        <ChartCard
          id="planned-vs-actual"
          title="Planned vs actual delivery"
          subtitle="Story points by period"
          height={280}
        >
          <DualLineChart data={plannedVsActual} />
        </ChartCard>

        <ChartCard
          id="milestone-completion"
          title="Milestone completion"
          subtitle="Completed / in progress / at risk / delayed"
          height={280}
        >
          <MilestoneStackedBar data={milestoneSeries} />
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <ChartCard
          id="sprint-predictability"
          title="Sprint predictability trend"
          subtitle="Last 8–10 sprints — click a point to focus the table"
          height={260}
        >
          <ClickableLineChart
            data={predictabilityTrend}
            color="#3D8B6E"
            onPointClick={(index) => {
              const point = predictabilityTrend[index];
              if (!point) return;
              setHighlightedSprintId(point.sprintId);
              setFilters({ programId: point.programId });
            }}
          />
        </ChartCard>

        <ChartCard
          id="scope-change"
          title="Scope change"
          subtitle="Original, added, and removed scope by period"
          height={260}
        >
          <ScopeChangeBar data={scopeChange} />
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <ChartCard
          id="delivery-trend"
          title="Delivery trend"
          subtitle="On-time delivery percentage over time"
          height={260}
        >
          <ClickableLineChart data={onTimeTrend} color="#0B3A53" />
        </ChartCard>

        <ChartCard
          id="work-item-aging"
          title="Work item aging"
          subtitle={
            agingFocus
              ? `Focused bucket: ${agingFocus}`
              : 'Open work by age bucket — click a bar to focus'
          }
          height={260}
        >
          <AgingBarChart
            data={agingSeries}
            onBarClick={(bucket) => setAgingFocus((prev) => (prev === bucket ? null : bucket))}
          />
        </ChartCard>
      </Box>

      <SectionCard
        id="delivery-table"
        title="Delivery detail"
        description="Sprint-level planned vs completed, carryover, blockers, defects, and predictability."
        action={
          highlightedSprintId ? (
            <Chip size="small" color="primary" label="Sprint drill-down active" />
          ) : undefined
        }
      >
        <DataTable
          columns={deliveryColumns}
          rows={tableRows}
          sortable
          filterable
          filterPlaceholder="Filter by program or sprint…"
          emptyMessage="No sprint delivery data for the current filters."
          getSortValue={(row, columnId) =>
            (row as unknown as Record<string, unknown>)[columnId] as
              string | number | boolean | null | undefined
          }
          getFilterText={(row) => `${row.programName} ${row.name} ${row.rag}`}
        />
        {agingFocus && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Aging focus ({agingFocus}) highlights backlog pressure; pair with global filters to
            isolate teams or programs.
          </Typography>
        )}
      </SectionCard>
    </Box>
  );
}

const deliveryColumns: TableColumn<DeliveryRow>[] = [
  { id: 'programName', label: 'Program' },
  { id: 'name', label: 'Sprint' },
  { id: 'planned', label: 'Planned', align: 'right' },
  { id: 'completed', label: 'Completed', align: 'right' },
  { id: 'carryover', label: 'Carryover', align: 'right' },
  {
    id: 'blocked',
    label: 'Blocked',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={row.blocked > 0 ? 700 : 400}
        color={row.blocked > 2 ? 'error.main' : 'text.primary'}
      >
        {row.blocked}
      </Typography>
    ),
  },
  { id: 'defects', label: 'Defects', align: 'right' },
  {
    id: 'predictability',
    label: 'Predictability',
    align: 'right',
    render: (row) => (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {row.predictability}%
        </Typography>
        <StatusBadge
          status={row.predictability >= 85 ? 'green' : row.predictability >= 70 ? 'amber' : 'red'}
          label={titleCase(row.rag)}
        />
      </Box>
    ),
  },
];
