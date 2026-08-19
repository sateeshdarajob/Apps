import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChartCard, SimpleBarChart, SimpleLineChart } from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useReleasesData } from '@/hooks';
import type { Kpi, TableColumn } from '@/types';
import {
  aggregateReleaseReadiness,
  aggregateReleaseTrend,
  buildReleaseCalendar,
  buildReleaseKpis,
  buildReleaseTableRows,
  readinessChecklist,
  titleCase,
} from '@/utils';
import type { ReleaseTableRow } from '@/utils';

export function ReleasesPage() {
  const { programs, releases, defects, incidents, risks, dependencies, isLoading } =
    useReleasesData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(
    () => buildReleaseKpis(releases, defects, incidents),
    [releases, defects, incidents],
  );
  const calendar = useMemo(() => buildReleaseCalendar(releases), [releases]);
  const readiness = useMemo(() => aggregateReleaseReadiness(releases), [releases]);
  const trend = useMemo(() => aggregateReleaseTrend(releases), [releases]);
  const rows = useMemo(
    () => buildReleaseTableRows(releases, programs, defects),
    [releases, programs, defects],
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
    return <LoadingState label="Loading releases…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title="Releases"
        description="Release governance and production readiness visibility across the portfolio."
      />

      <KpiCardGrid metrics={kpis} columns={7} onMetricClick={handleKpiClick} />

      <SectionCard
        id="release-calendar"
        title="Release calendar"
        description="Upcoming and recent releases by planned date. Below 85% readiness is At Risk."
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' },
          }}
        >
          {calendar.map((item) => (
            <Box
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: item.atRisk ? 'warning.main' : 'divider',
                borderRadius: 1.5,
                cursor: 'pointer',
                bgcolor: item.atRisk ? 'rgba(196, 122, 17, 0.06)' : 'background.paper',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{item.version}</Typography>
                {item.atRisk ? (
                  <Chip size="small" color="warning" label="At Risk" />
                ) : (
                  <StatusBadge status={item.rag} />
                )}
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.plannedDate} · Readiness {item.readiness}%
              </Typography>
            </Box>
          ))}
        </Box>
      </SectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
        }}
      >
        <ChartCard
          id="release-readiness"
          title="Release readiness"
          subtitle="Overall readiness score by active release"
          height={260}
        >
          <SimpleBarChart data={readiness} color="#0B3A53" />
        </ChartCard>
        <ChartCard
          id="release-trend"
          title="Release trend"
          subtitle="Planned releases by month"
          height={260}
        >
          <SimpleLineChart data={trend} color="#1565A0" />
        </ChartCard>
      </Box>

      <SectionCard
        id="release-table"
        title="Release readiness table"
        description="Checklist-based overall readiness. Click a row for go/no-go detail."
      >
        <DataTable
          columns={releaseColumns}
          rows={rows}
          sortable
          filterable
          filterPlaceholder="Search version, program, manager…"
          emptyMessage="No releases match the current filters."
          onRowClick={(row) => setSelectedId(row.id)}
          getRowSx={(row) =>
            row.atRisk ? { bgcolor: 'rgba(196, 122, 17, 0.07)' } : {}
          }
          getSortValue={(row, columnId) => {
            if (columnId === 'releaseManager') return row.releaseManager.name;
            return (row as unknown as Record<string, unknown>)[columnId] as
              | string
              | number
              | boolean
              | null
              | undefined;
          }}
          getFilterText={(row) =>
            [row.version, row.name, row.programName, row.releaseManager.name, row.status].join(' ')
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
                  {selected.version}
                </Typography>
                <Typography variant="h3">{selected.name}</Typography>
              </Box>
              <IconButton aria-label="Close release detail" onClick={() => setSelectedId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selected.atRisk && <Chip size="small" color="warning" label="At Risk (<85%)" />}
              <Chip size="small" label={`Go/No-Go: ${titleCase(selected.goNoGo)}`} />
              <StatusBadge status={selected.rag} />
            </Stack>

            <DetailRow label="Program" value={selected.programName} />
            <DetailRow label="Planned date" value={selected.plannedDate} />
            <DetailRow label="Release manager" value={selected.releaseManager.name} />
            <DetailRow label="Status" value={titleCase(selected.status)} />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Overall readiness · {selected.readiness}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={selected.readiness}
                color={selected.readiness < 70 ? 'error' : selected.readiness < 85 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>

            <Divider />
            <Typography variant="subtitle2">Readiness checklist</Typography>
            {readinessChecklist(selected).map((item) => (
              <DetailRow
                key={item.key}
                label={item.label}
                value={`${titleCase(item.status)} (${item.score}%)`}
              />
            ))}

            <Divider />
            <Typography variant="subtitle2">Linked risks</Typography>
            {risks
              .filter((risk) => risk.programId === selected.programId)
              .slice(0, 3)
              .map((risk) => (
                <Typography key={risk.id} variant="body2" color="text.secondary">
                  • {risk.title}
                </Typography>
              ))}

            <Typography variant="subtitle2">Dependencies</Typography>
            {dependencies
              .filter((dep) => dep.programId === selected.programId)
              .slice(0, 3)
              .map((dep) => (
                <Typography key={dep.id} variant="body2" color="text.secondary">
                  • {dep.description}
                </Typography>
              ))}

            <Typography variant="subtitle2">Defects</Typography>
            <Typography variant="body2" color="text.secondary">
              Critical open: {selected.criticalDefectCount}
            </Typography>
            {selected.notes && (
              <>
                <Divider />
                <Typography variant="body2">{selected.notes}</Typography>
              </>
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

const releaseColumns: TableColumn<ReleaseTableRow>[] = [
  { id: 'version', label: 'Version', width: 90 },
  { id: 'name', label: 'Release' },
  { id: 'programName', label: 'Program' },
  { id: 'plannedDate', label: 'Planned' },
  {
    id: 'readiness',
    label: 'Readiness',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={700}
        color={row.readiness < 70 ? 'error.main' : row.readiness < 85 ? 'warning.main' : 'success.main'}
      >
        {row.readiness}%
      </Typography>
    ),
  },
  {
    id: 'atRisk',
    label: 'Flag',
    render: (row) =>
      row.atRisk ? <Chip size="small" color="warning" label="At Risk" /> : <Chip size="small" label="Ready path" />,
  },
  { id: 'goNoGo', label: 'Go/No-Go', render: (row) => titleCase(row.goNoGo) },
  { id: 'releaseManager', label: 'Owner', render: (row) => row.releaseManager.name },
  { id: 'status', label: 'Status', render: (row) => titleCase(row.status) },
];
