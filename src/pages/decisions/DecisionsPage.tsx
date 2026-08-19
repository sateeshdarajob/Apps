import { useMemo, useState } from 'react';
import { Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AgingBarChart, ChartCard } from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useDecisionsData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateDecisionAging,
  buildDecisionKpis,
  buildDecisionTableRows,
  titleCase,
} from '@/utils';
import type { DecisionTableRow } from '@/utils';

export function DecisionsPage() {
  const { programs, decisions, isLoading } = useDecisionsData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(() => buildDecisionKpis(decisions), [decisions]);
  const aging = useMemo(() => aggregateDecisionAging(decisions), [decisions]);
  const rows = useMemo(() => buildDecisionTableRows(decisions, programs), [decisions, programs]);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading decisions…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageHeader
        title="Decisions"
        description="Decision register with aging, escalation, and milestone-blocking highlights."
      />

      <KpiCardGrid metrics={kpis} columns={4} onMetricClick={handleKpiClick} />

      <ChartCard
        id="decision-aging"
        title="Decision aging"
        subtitle="Pending decisions by age"
        height={240}
      >
        <AgingBarChart data={aging} />
      </ChartCard>

      <SectionCard
        id="decision-table"
        title="Decision register"
        description="Overdue and milestone-blocking decisions are highlighted for escalation."
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Overdue" sx={chipSx('#C62828')} />
          <Chip size="small" label="Blocking milestone" sx={chipSx('#C47A11')} />
          <Chip size="small" label="Executive action" sx={chipSx('#1565A0')} />
        </Stack>

        <DataTable
          columns={decisionColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search decision, program, owner…"
          emptyMessage="No decisions match the current filters."
          onRowClick={(row) => setSelectedId(row.id)}
          getRowSx={(row) => ({
            ...(row.overdue
              ? { bgcolor: 'rgba(198, 40, 40, 0.07)' }
              : row.blocking
                ? { bgcolor: 'rgba(196, 122, 17, 0.06)' }
                : row.executive
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
            [row.id, row.title, row.programName, row.owner.name, row.status, row.impact].join(' ')
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
              <IconButton aria-label="Close decision detail" onClick={() => setSelectedId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selected.overdue && <Chip size="small" color="error" label="Overdue" />}
              {selected.blocking && <Chip size="small" color="warning" label="Blocking milestone" />}
              {selected.executive && <Chip size="small" color="info" label="Executive action" />}
              <StatusBadge
                status={
                  selected.impact === 'critical'
                    ? 'red'
                    : selected.impact === 'high'
                      ? 'amber'
                      : 'grey'
                }
                label={titleCase(selected.impact)}
              />
            </Stack>

            <Typography variant="body1">{selected.description}</Typography>
            <Divider />
            <DetailRow label="Program" value={selected.programName} />
            <DetailRow label="Owner" value={selected.owner.name} />
            <DetailRow label="Due date" value={selected.dueDate} />
            <DetailRow label="Age" value={`${selected.ageInDays} days`} />
            <DetailRow label="Impact" value={titleCase(selected.impact)} />
            <DetailRow label="Status" value={titleCase(selected.status)} />
            <DetailRow
              label="Escalation required"
              value={selected.escalationRequired ? 'Yes' : 'No'}
            />
            {selected.outcome && (
              <>
                <Divider />
                <Typography variant="subtitle2">Outcome</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selected.outcome}
                </Typography>
              </>
            )}
            <Divider />
            <Typography variant="subtitle2">Stakeholders</Typography>
            <Typography variant="body2" color="text.secondary">
              {selected.stakeholders.map((person) => person.name).join(', ')}
            </Typography>
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

const decisionColumns: TableColumn<DecisionTableRow>[] = [
  { id: 'id', label: 'ID', width: 90 },
  {
    id: 'title',
    label: 'Decision',
    render: (row) => (
      <Typography variant="body2" sx={{ maxWidth: 280 }}>
        {row.title}
      </Typography>
    ),
  },
  { id: 'programName', label: 'Program' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  { id: 'dueDate', label: 'Due Date' },
  {
    id: 'ageInDays',
    label: 'Age',
    align: 'right',
    render: (row) => `${row.ageInDays}d`,
  },
  { id: 'impact', label: 'Impact', render: (row) => titleCase(row.impact) },
  { id: 'status', label: 'Status', render: (row) => titleCase(row.status) },
  {
    id: 'escalationRequired',
    label: 'Escalation Required',
    render: (row) => (row.escalationRequired ? 'Yes' : 'No'),
  },
];
