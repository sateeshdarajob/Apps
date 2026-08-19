import { useMemo, useState } from 'react';
import { Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AgingBarChart,
  ChartCard,
  ProbabilityImpactHeatmap,
  SimpleBarChart,
  SimpleLineChart,
} from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useRisksData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateRiskAging,
  aggregateRiskTrend,
  aggregateRisksBySeverity,
  buildProbabilityImpactHeatmap,
  buildRiskKpis,
  buildRiskTableRows,
  formatEscalation,
  titleCase,
} from '@/utils';
import type { RiskTableRow } from '@/utils';

export function RisksPage() {
  const { programs, risks, isLoading } = useRisksData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(() => buildRiskKpis(risks), [risks]);
  const heatmap = useMemo(() => buildProbabilityImpactHeatmap(risks), [risks]);
  const trend = useMemo(() => aggregateRiskTrend(risks), [risks]);
  const bySeverity = useMemo(() => aggregateRisksBySeverity(risks), [risks]);
  const aging = useMemo(() => aggregateRiskAging(risks), [risks]);
  const rows = useMemo(() => buildRiskTableRows(risks, programs), [risks, programs]);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading risks…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageHeader
        title="Risks"
        description="Risk register, probability × impact heatmap, and executive-attention highlights."
      />

      <KpiCardGrid metrics={kpis} columns={6} onMetricClick={handleKpiClick} />

      <ChartCard
        id="risk-heatmap"
        title="Probability vs Impact"
        subtitle="Open risks plotted on the risk matrix"
        height={280}
      >
        <ProbabilityImpactHeatmap
          probabilities={heatmap.probabilities}
          impacts={heatmap.impacts}
          cells={heatmap.cells}
        />
      </ChartCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
        }}
      >
        <ChartCard id="risk-trend" title="Risk trend" subtitle="Open risk volume" height={240}>
          <SimpleLineChart data={trend} color="#C62828" />
        </ChartCard>
        <ChartCard
          id="risk-severity"
          title="Risk distribution by severity"
          subtitle="Open items"
          height={240}
        >
          <SimpleBarChart data={bySeverity} color="#C47A11" />
        </ChartCard>
        <ChartCard id="risk-aging" title="Risk aging" subtitle="Open risks by age" height={240}>
          <AgingBarChart data={aging} />
        </ChartCard>
      </Box>

      <SectionCard
        id="risk-table"
        title="Top risks"
        description="Click a row for detail. Executive-attention risks are highlighted."
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Executive attention" sx={chipSx('#C62828')} />
          <Chip size="small" label="Overdue" sx={chipSx('#C47A11')} />
          <Chip size="small" label="No mitigation" sx={chipSx('#1565A0')} />
        </Stack>

        <DataTable
          columns={riskColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search ID, program, risk, owner…"
          emptyMessage="No risks match the current filters."
          onRowClick={(row) => setSelectedId(row.id)}
          getRowSx={(row) => ({
            ...(row.executiveAttention
              ? { bgcolor: 'rgba(198, 40, 40, 0.07)' }
              : row.overdue
                ? { bgcolor: 'rgba(196, 122, 17, 0.06)' }
                : !row.mitigation.trim()
                  ? { bgcolor: 'rgba(21, 101, 160, 0.05)' }
                  : {}),
          })}
          getSortValue={(row, columnId) => {
            if (columnId === 'owner') return row.owner.name;
            return (row as unknown as Record<string, unknown>)[columnId] as
              | string
              | number
              | boolean
              | null
              | undefined;
          }}
          getFilterText={(row) =>
            [
              row.id,
              row.programName,
              row.title,
              row.owner.name,
              row.mitigation,
              row.status,
              row.severity,
            ].join(' ')
          }
        />
      </SectionCard>

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 440 } } }}
      >
        {selected && (
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selected.id}
                </Typography>
                <Typography variant="h3">{selected.title}</Typography>
              </Box>
              <IconButton aria-label="Close risk detail" onClick={() => setSelectedId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selected.executiveAttention && (
                <Chip size="small" color="error" label="Executive attention" />
              )}
              {selected.overdue && <Chip size="small" color="warning" label="Overdue" />}
              <StatusBadge
                status={
                  selected.severity === 'critical'
                    ? 'red'
                    : selected.severity === 'high'
                      ? 'amber'
                      : 'grey'
                }
                label={titleCase(selected.severity)}
              />
            </Stack>

            <Typography variant="body1">{selected.description}</Typography>
            <Divider />
            <DetailRow label="Program" value={selected.programName} />
            <DetailRow label="Probability" value={titleCase(selected.probability)} />
            <DetailRow label="Impact" value={titleCase(selected.impact)} />
            <DetailRow label="Risk score" value={String(selected.score)} />
            <DetailRow label="Owner" value={selected.owner.name} />
            <DetailRow label="Target date" value={selected.targetResolutionDate} />
            <DetailRow label="Escalation" value={formatEscalation(selected.escalationLevel)} />
            <DetailRow label="Status" value={titleCase(selected.status)} />
            <DetailRow label="Age" value={`${selected.ageInDays} days`} />
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Mitigation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.mitigation.trim() || 'No mitigation plan recorded.'}
              </Typography>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {value}
      </Typography>
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

const riskColumns: TableColumn<RiskTableRow>[] = [
  { id: 'id', label: 'ID', width: 90 },
  { id: 'programName', label: 'Program' },
  {
    id: 'title',
    label: 'Risk',
    render: (row) => (
      <Typography variant="body2" sx={{ maxWidth: 260 }}>
        {row.title}
      </Typography>
    ),
  },
  { id: 'probability', label: 'Probability', render: (row) => titleCase(row.probability) },
  { id: 'impact', label: 'Impact', render: (row) => titleCase(row.impact) },
  { id: 'score', label: 'Risk Score', align: 'right' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  {
    id: 'mitigation',
    label: 'Mitigation',
    render: (row) => (
      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
        {row.mitigation.trim() || '—'}
      </Typography>
    ),
  },
  { id: 'targetResolutionDate', label: 'Target Date' },
  {
    id: 'escalationLevel',
    label: 'Escalation',
    render: (row) => formatEscalation(row.escalationLevel),
  },
  { id: 'status', label: 'Status', render: (row) => titleCase(row.status) },
];
