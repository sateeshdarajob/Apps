import { useMemo, useState } from 'react';
import { Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AgingBarChart, ChartCard, SimpleBarChart } from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useDependenciesData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateDependenciesBySeverity,
  aggregateDependenciesByTeam,
  aggregateDependencyAging,
  buildDependencyKpis,
  buildDependencyTableRows,
  daysRemaining,
  titleCase,
} from '@/utils';
import type { DependencyTableRow } from '@/utils';

export function DependenciesPage() {
  const { programs, dependencies, isLoading } = useDependenciesData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(() => buildDependencyKpis(dependencies), [dependencies]);
  const aging = useMemo(() => aggregateDependencyAging(dependencies), [dependencies]);
  const bySeverity = useMemo(() => aggregateDependenciesBySeverity(dependencies), [dependencies]);
  const byTeam = useMemo(() => aggregateDependenciesByTeam(dependencies), [dependencies]);
  const rows = useMemo(
    () => buildDependencyTableRows(dependencies, programs),
    [dependencies, programs],
  );

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const handleKpiClick = (metric: Kpi) => {
    if (!metric.href?.startsWith('#')) return;
    document.getElementById(metric.href.slice(1))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (isLoading) {
    return <LoadingState label="Loading dependencies…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title="Dependencies"
        description="Cross-program blockers, aging, and escalation posture — filterable across the portfolio."
      />

      <KpiCardGrid metrics={kpis} columns={5} onMetricClick={handleKpiClick} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
        }}
      >
        <ChartCard
          id="dependency-aging"
          title="Dependency aging"
          subtitle="Open dependencies by age"
          height={240}
        >
          <AgingBarChart data={aging} />
        </ChartCard>

        <ChartCard
          id="dependency-severity"
          title="Dependencies by severity"
          subtitle="Impact distribution"
          height={240}
        >
          <SimpleBarChart data={bySeverity} color="#C47A11" />
        </ChartCard>

        <ChartCard
          id="dependency-teams"
          title="Dependencies by owning team"
          subtitle="Blocking team load"
          height={240}
        >
          <SimpleBarChart data={byTeam} color="#0B3A53" />
        </ChartCard>
      </Box>

      <SectionCard
        id="dependency-table"
        title="Critical dependency register"
        description="Click a row for detail. Overdue, critical, and blocking items are highlighted."
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Overdue" sx={highlightChipSx('#C62828')} />
          <Chip size="small" label="Critical" sx={highlightChipSx('#C47A11')} />
          <Chip size="small" label="Blocking" sx={highlightChipSx('#1565A0')} />
        </Stack>

        <DataTable
          columns={dependencyColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search ID, program, owner, team…"
          emptyMessage="No dependencies match the current filters."
          onRowClick={(row) => setSelectedId(row.id)}
          getRowSx={(row) => ({
            ...(row.overdue
              ? { bgcolor: 'rgba(198, 40, 40, 0.06)' }
              : row.critical
                ? { bgcolor: 'rgba(196, 122, 17, 0.06)' }
                : row.blocking
                  ? { bgcolor: 'rgba(21, 101, 160, 0.05)' }
                  : {}),
          })}
          getSortValue={(row, columnId) => {
            if (columnId === 'owner') return row.owner.name;
            if (columnId === 'blockingTeam') return row.blockingTeam.name;
            if (columnId === 'escalationOwner') return row.escalationOwner.name;
            return (row as unknown as Record<string, unknown>)[columnId] as
              string | number | boolean | null | undefined;
          }}
          getFilterText={(row) =>
            [
              row.id,
              row.programName,
              row.description,
              row.owner.name,
              row.blockingTeam.name,
              row.escalationOwner.name,
              row.status,
              row.impact,
              row.mitigation,
            ].join(' ')
          }
        />
      </SectionCard>

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
      >
        {selected && (
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selected.id}
                </Typography>
                <Typography variant="h3">{selected.programName}</Typography>
              </Box>
              <IconButton aria-label="Close dependency detail" onClick={() => setSelectedId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selected.overdue && <Chip size="small" color="error" label="Overdue" />}
              {selected.critical && <Chip size="small" color="warning" label="Critical" />}
              {selected.blocking && <Chip size="small" color="info" label="Blocking" />}
              <StatusBadge
                status={
                  selected.status === 'blocked'
                    ? 'red'
                    : selected.status === 'atRisk'
                      ? 'amber'
                      : selected.status === 'completed'
                        ? 'green'
                        : 'grey'
                }
                label={titleCase(selected.status)}
              />
            </Stack>

            <Typography variant="body1">{selected.description}</Typography>
            <Divider />

            <DetailRow label="Owner" value={selected.owner.name} />
            <DetailRow label="Blocking team" value={selected.blockingTeam.name} />
            <DetailRow label="Escalation owner" value={selected.escalationOwner.name} />
            <DetailRow label="Due date" value={selected.dueDate} />
            <DetailRow label="Days remaining" value={String(daysRemaining(selected.dueDate))} />
            <DetailRow label="Age" value={`${selected.ageInDays} days`} />
            <DetailRow label="Impact" value={titleCase(selected.impact)} />
            <DetailRow label="Priority" value={titleCase(selected.priority)} />
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Mitigation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.mitigation}
              </Typography>
            </Box>
            {selected.dependsOnProgramId && (
              <DetailRow label="Depends on program" value={selected.dependsOnProgramId} />
            )}
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

function highlightChipSx(color: string) {
  return {
    bgcolor: `${color}18`,
    color,
    border: `1px solid ${color}55`,
    fontWeight: 600,
  };
}

const dependencyColumns: TableColumn<DependencyTableRow>[] = [
  { id: 'id', label: 'ID', width: 90 },
  { id: 'programName', label: 'Program' },
  {
    id: 'description',
    label: 'Dependency',
    render: (row) => (
      <Typography variant="body2" sx={{ maxWidth: 280 }}>
        {row.description}
      </Typography>
    ),
  },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  { id: 'blockingTeam', label: 'Blocking Team', render: (row) => row.blockingTeam.name },
  {
    id: 'dueDate',
    label: 'Due Date',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={row.overdue ? 700 : 400}
        color={row.overdue ? 'error.main' : 'text.primary'}
      >
        {row.dueDate}
      </Typography>
    ),
  },
  {
    id: 'ageInDays',
    label: 'Age',
    align: 'right',
    render: (row) => `${row.ageInDays}d`,
  },
  {
    id: 'impact',
    label: 'Impact',
    render: (row) => (
      <Chip
        size="small"
        label={titleCase(row.impact)}
        color={row.impact === 'critical' ? 'error' : row.impact === 'high' ? 'warning' : 'default'}
        variant={row.impact === 'medium' || row.impact === 'low' ? 'outlined' : 'filled'}
      />
    ),
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => titleCase(row.status),
  },
  {
    id: 'mitigation',
    label: 'Mitigation',
    render: (row) => (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 220 }}
        noWrap
        title={row.mitigation}
      >
        {row.mitigation}
      </Typography>
    ),
  },
  {
    id: 'escalationOwner',
    label: 'Escalation Owner',
    render: (row) => row.escalationOwner.name,
  },
];
