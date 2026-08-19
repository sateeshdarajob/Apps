import { useMemo, useState } from 'react';
import { Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  ChartCard,
  SimpleBarChart,
  SimpleLineChart,
} from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useIncidentsData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateIncidentTrend,
  aggregateIncidentsByService,
  aggregateIncidentsBySeverity,
  aggregateMttrTrend,
  buildIncidentKpis,
  buildPostmortemRows,
  isOpenIncident,
  titleCase,
} from '@/utils';
import type { PostmortemRow } from '@/utils';

export function IncidentsPage() {
  const { programs, incidents, isLoading } = useIncidentsData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(() => buildIncidentKpis(incidents), [incidents]);
  const trend = useMemo(() => aggregateIncidentTrend(incidents), [incidents]);
  const mttrTrend = useMemo(() => aggregateMttrTrend(incidents), [incidents]);
  const bySeverity = useMemo(() => aggregateIncidentsBySeverity(incidents), [incidents]);
  const byService = useMemo(
    () => aggregateIncidentsByService(incidents, programs),
    [incidents, programs],
  );
  const rows = useMemo(() => buildPostmortemRows(incidents, programs), [incidents, programs]);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading incidents…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageHeader
        title="Incidents"
        description="P0/P1 incident governance, MTTR/MTBF, and postmortem corrective-action tracking."
      />

      <KpiCardGrid metrics={kpis} columns={7} onMetricClick={handleKpiClick} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <ChartCard id="incident-trend" title="Incident trend" height={240}>
          <SimpleLineChart data={trend} color="#C62828" />
        </ChartCard>
        <ChartCard id="mttr-trend" title="MTTR trend" subtitle="Minutes" height={240}>
          <SimpleLineChart data={mttrTrend} color="#0B3A53" />
        </ChartCard>
        <ChartCard title="Incidents by severity" height={240}>
          <SimpleBarChart data={bySeverity} color="#C47A11" />
        </ChartCard>
        <ChartCard title="Incidents by service / program" height={240}>
          <SimpleBarChart data={byService} color="#1565A0" />
        </ChartCard>
      </Box>

      <SectionCard
        id="incident-table"
        title="Postmortem tracking"
        description="RCA, postmortem status, and corrective-action completion. Open P0/P1 items are highlighted."
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Open P0/P1" sx={chipSx('#C62828')} />
          <Chip size="small" label="SLA breach" sx={chipSx('#C47A11')} />
          <Chip size="small" label="Overdue actions" sx={chipSx('#1565A0')} />
        </Stack>

        <DataTable
          columns={incidentColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search incident, owner, RCA…"
          emptyMessage="No incidents match the current filters."
          onRowClick={(row) => setSelectedId(row.id)}
          getRowSx={(row) => ({
            ...(isOpenIncident(row) && (row.priorityLabel === 'P0' || row.priorityLabel === 'P1')
              ? { bgcolor: 'rgba(198, 40, 40, 0.07)' }
              : row.slaBreach
                ? { bgcolor: 'rgba(196, 122, 17, 0.06)' }
                : row.overdueActions > 0
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
              row.title,
              row.programName,
              row.owner.name,
              row.rca,
              row.postmortemStatus,
              row.priorityLabel,
            ].join(' ')
          }
        />
      </SectionCard>

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}
      >
        {selected && (
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selected.id} · {selected.priorityLabel}
                </Typography>
                <Typography variant="h3">{selected.title}</Typography>
              </Box>
              <IconButton aria-label="Close incident detail" onClick={() => setSelectedId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {isOpenIncident(selected) && <Chip size="small" color="error" label="Open" />}
              {selected.slaBreach && <Chip size="small" color="warning" label="SLA breach" />}
              {selected.repeat && <Chip size="small" label="Repeat" />}
              <StatusBadge
                status={
                  selected.priorityLabel === 'P0'
                    ? 'red'
                    : selected.priorityLabel === 'P1'
                      ? 'amber'
                      : 'grey'
                }
                label={selected.priorityLabel}
              />
            </Stack>

            <Typography variant="body1">{selected.description}</Typography>
            <Divider />
            <DetailRow label="Program" value={selected.programName} />
            <DetailRow label="Owner" value={selected.owner.name} />
            <DetailRow label="Status" value={titleCase(selected.status)} />
            <DetailRow
              label="MTTR"
              value={selected.mttrMinutes != null ? `${selected.mttrMinutes} min` : 'In progress'}
            />
            <DetailRow label="Services" value={selected.impactedServices.join(', ')} />
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Root cause analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.rca}
              </Typography>
            </Box>
            <DetailRow label="Postmortem" value={titleCase(selected.postmortemStatus)} />
            <Typography variant="subtitle2">Corrective actions</Typography>
            {selected.correctiveActions.map((action) => (
              <Box key={action.id} sx={{ pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
                <Typography variant="body2">{action.description}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.owner.name} · {action.dueDate} · {titleCase(action.status)}
                  {action.overdue ? ' · Overdue' : ''}
                </Typography>
              </Box>
            ))}
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

const incidentColumns: TableColumn<PostmortemRow>[] = [
  {
    id: 'title',
    label: 'Incident',
    render: (row) => (
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {row.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.programName}
        </Typography>
      </Box>
    ),
  },
  { id: 'priorityLabel', label: 'Severity' },
  {
    id: 'rca',
    label: 'RCA',
    render: (row) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
        {row.rca}
      </Typography>
    ),
  },
  {
    id: 'postmortemStatus',
    label: 'Postmortem',
    render: (row) => titleCase(row.postmortemStatus),
  },
  {
    id: 'correctiveActionCount',
    label: 'Corrective Actions',
    align: 'right',
  },
  { id: 'completedActions', label: 'Completed Actions', align: 'right' },
  { id: 'overdueActions', label: 'Overdue Actions', align: 'right' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  { id: 'status', label: 'Status', render: (row) => titleCase(row.status) },
];
