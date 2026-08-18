import { Box } from '@mui/material';
import { KpiCardGrid } from '@/components/kpi';
import { ChartCard, SimpleBarChart, SimpleLineChart } from '@/components/charts';
import { DataTable } from '@/components/tables';
import { StatusBadge } from '@/components/status';
import { PageHeader, LoadingState } from '@/components/common';
import { useDeliveryVelocity, usePortfolioKpis, usePrograms } from '@/hooks';
import type { Program, TableColumn } from '@/types';
import { formatPercent, titleCase } from '@/utils';

const programColumns: TableColumn<Program>[] = [
  {
    id: 'code',
    label: 'Code',
    width: 90,
  },
  {
    id: 'name',
    label: 'Program',
  },
  {
    id: 'phase',
    label: 'Phase',
    render: (row) => titleCase(row.phase),
  },
  {
    id: 'health',
    label: 'RAG',
    render: (row) => <StatusBadge status={row.health} />,
  },
  {
    id: 'percentComplete',
    label: 'Progress',
    align: 'right',
    render: (row) => formatPercent(row.percentComplete),
  },
];

/**
 * Foundation Control Tower page — proves layout, KPI, chart, and table primitives
 * against the mock data layer. Full dashboard widgets come in a later increment.
 */
export function ControlTowerPage() {
  const { data: kpis = [], isLoading: kpisLoading } = usePortfolioKpis();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: velocity = [], isLoading: velocityLoading } = useDeliveryVelocity();

  const isLoading = kpisLoading || programsLoading || velocityLoading;

  if (isLoading) {
    return <LoadingState label="Loading control tower…" />;
  }

  const ragCounts = [
    { label: 'Green', value: programs.filter((p) => p.health === 'green').length },
    { label: 'Amber', value: programs.filter((p) => p.health === 'amber').length },
    { label: 'Red', value: programs.filter((p) => p.health === 'red').length },
  ];

  return (
    <Box>
      <PageHeader
        title="Portfolio overview"
        description="Cross-program health, delivery signals, and active engineering initiatives."
      />

      <KpiCardGrid metrics={kpis} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mt: 3,
          gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
        }}
      >
        <ChartCard title="Delivery velocity" subtitle="Story points completed by month">
          <SimpleLineChart data={velocity} />
        </ChartCard>
        <ChartCard title="RAG distribution" subtitle="Current program health mix">
          <SimpleBarChart data={ragCounts} />
        </ChartCard>
      </Box>

      <Box sx={{ mt: 3 }}>
        <PageHeader title="Active programs" description="Filtered by global header selections." />
        <DataTable
          columns={programColumns}
          rows={programs}
          emptyMessage="No programs match filters."
        />
      </Box>
    </Box>
  );
}
