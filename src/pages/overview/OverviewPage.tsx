import { useMemo, useState } from 'react';
import { Box, Button, Chip, LinearProgress, Link, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChartCard, MilestoneStackedBar, RagDonutChart } from '@/components/charts';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { KpiCardGrid } from '@/components/kpi';
import { StatusBadge, RagDot } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useGlobalFilters, useOverviewData } from '@/hooks';
import type {
  Decision,
  Dependency,
  Milestone,
  Program,
  RagStatus,
  Release,
  Risk,
  TableColumn,
} from '@/types';
import {
  buildExecutiveKpis,
  daysRemaining,
  formatPercent,
  isCriticalBlocker,
  isHighCriticalRisk,
  isPendingDecision,
  isUpcomingRelease,
  milestoneStatusSeries,
  ragDistribution,
  riskScore,
  scheduleVarianceDays,
  titleCase,
} from '@/utils';
import type { ExecutiveKpi } from '@/utils';

type ProgramHealthRow = Program & {
  scheduleVariance: number;
  openRiskCount: number;
  blockerCount: number;
  dependencyCount: number;
};

function formatVariance(days: number): string {
  if (days === 0) return 'On plan';
  if (days > 0) return `+${days}d`;
  return `${days}d`;
}

function programNameById(programs: Program[], id: string): string {
  return programs.find((program) => program.id === id)?.name ?? id;
}

export function OverviewPage() {
  const navigate = useNavigate();
  const { setFilters } = useGlobalFilters();
  const [ragFocus, setRagFocus] = useState<RagStatus | 'all'>('all');
  const { programs, milestones, dependencies, risks, releases, incidents, decisions, isLoading } =
    useOverviewData();

  const focusedPrograms = useMemo(() => {
    if (ragFocus === 'all') return programs;
    return programs.filter((program) => program.rag === ragFocus);
  }, [programs, ragFocus]);

  const kpis = useMemo(
    () =>
      buildExecutiveKpis({
        programs,
        milestones,
        dependencies,
        risks,
        releases,
        incidents,
        decisions,
      }),
    [programs, milestones, dependencies, risks, releases, incidents, decisions],
  );

  const healthRows = useMemo<ProgramHealthRow[]>(
    () =>
      focusedPrograms.map((program) => ({
        ...program,
        scheduleVariance: scheduleVarianceDays(program),
        openRiskCount: program.risks.filter(isHighCriticalRisk).length,
        blockerCount: program.blockers.filter(isCriticalBlocker).length,
        dependencyCount: program.dependencies.length,
      })),
    [focusedPrograms],
  );

  const upcomingMilestones = useMemo(() => {
    return [...milestones]
      .filter((item) => item.status !== 'completed' && item.status !== 'cancelled')
      .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))
      .slice(0, 10)
      .map((item) => ({
        ...item,
        daysLeft: daysRemaining(item.plannedDate),
        programName: programNameById(programs, item.programId),
      }));
  }, [milestones, programs]);

  const criticalBlockers = useMemo(() => {
    return [...dependencies]
      .filter(isCriticalBlocker)
      .sort((a, b) => b.ageInDays - a.ageInDays || IMPACT_RANK[b.impact] - IMPACT_RANK[a.impact])
      .slice(0, 6)
      .map((item) => ({
        ...item,
        programName: programNameById(programs, item.programId),
      }));
  }, [dependencies, programs]);

  const topRisks = useMemo(() => {
    return [...risks]
      .filter(isHighCriticalRisk)
      .map((risk) => ({
        ...risk,
        score: riskScore(risk),
        programName: programNameById(programs, risk.programId),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [risks, programs]);

  const upcomingReleases = useMemo(() => {
    return [...releases]
      .filter((item) => isUpcomingRelease(item))
      .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))
      .slice(0, 5)
      .map((item) => ({
        ...item,
        programName: programNameById(programs, item.programId),
      }));
  }, [releases, programs]);

  const pendingDecisions = useMemo(() => {
    return [...decisions]
      .filter(isPendingDecision)
      .sort(
        (a, b) =>
          Number(b.escalationRequired) - Number(a.escalationRequired) || b.ageInDays - a.ageInDays,
      )
      .slice(0, 5);
  }, [decisions]);

  const handleKpiClick = (metric: ExecutiveKpi) => {
    if (!metric.href) return;
    if (metric.href.startsWith('#')) {
      document
        .getElementById(metric.href.slice(1))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate(metric.href);
  };

  const handleRagClick = (status: RagStatus) => {
    if (ragFocus === status) {
      setRagFocus('all');
      setFilters({ ragStatus: 'all' });
      return;
    }
    setRagFocus(status);
    setFilters({ ragStatus: status });
  };

  if (isLoading) {
    return <LoadingState label="Loading executive overview…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title="Executive overview"
        description="Portfolio health, exceptions, and decisions needing attention — optimized for a 30-second scan."
        actions={
          ragFocus !== 'all' ? (
            <Button
              size="small"
              onClick={() => {
                setRagFocus('all');
                setFilters({ ragStatus: 'all' });
              }}
            >
              Clear RAG focus
            </Button>
          ) : undefined
        }
      />

      {/* Section 1 — Executive KPIs */}
      <KpiCardGrid metrics={kpis} columns={4} onMetricClick={handleKpiClick} />

      {/* Sections 2 & 4 — Health + Milestone status */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1.2fr' },
        }}
      >
        <ChartCard
          id="program-health"
          title="Program health"
          subtitle={
            ragFocus === 'all'
              ? 'Click a segment to focus programs by RAG'
              : `Focused on ${titleCase(ragFocus)} programs`
          }
          height={260}
        >
          <RagDonutChart
            data={ragDistribution(programs)}
            activeStatus={ragFocus}
            onSegmentClick={handleRagClick}
          />
        </ChartCard>

        <ChartCard
          id="milestone-status"
          title="Milestone status"
          subtitle="Completed, in progress, at risk, and delayed"
          height={260}
        >
          <MilestoneStackedBar data={milestoneStatusSeries(milestones)} />
        </ChartCard>
      </Box>

      {/* Section 3 — Portfolio program health table */}
      <SectionCard
        id="program-health-table"
        title="Portfolio program health"
        description="Sort and filter to inspect schedule, risk, and dependency pressure."
      >
        <DataTable
          columns={programColumns}
          rows={healthRows}
          sortable
          filterable
          filterPlaceholder="Filter programs…"
          emptyMessage="No programs match the current filters."
          getSortValue={(row, columnId) => {
            if (columnId === 'owner') return row.owner.name;
            if (columnId === 'rag') return row.rag;
            return (row as unknown as Record<string, unknown>)[columnId] as
              string | number | boolean | null | undefined;
          }}
          getFilterText={(row) =>
            `${row.name} ${row.code} ${row.owner.name} ${row.rag} ${row.targetDate}`
          }
        />
      </SectionCard>

      {/* Section 5 — Upcoming milestones */}
      <SectionCard
        id="upcoming-milestones"
        title="Upcoming milestones"
        description="Next 10 milestones by target date."
      >
        <DataTable
          columns={milestoneColumns}
          rows={upcomingMilestones}
          emptyMessage="No upcoming milestones for the current filters."
        />
      </SectionCard>

      {/* Sections 6 & 7 — Exceptions first */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <SectionCard
          id="critical-blockers"
          title="Critical blockers"
          description="Highest-impact blockers requiring escalation attention."
          action={
            <Link component={RouterLink} to="/dependencies" variant="body2" underline="hover">
              View all
            </Link>
          }
        >
          <DataTable
            columns={blockerColumns}
            rows={criticalBlockers}
            emptyMessage="No critical blockers — healthy signal."
          />
        </SectionCard>

        <SectionCard
          id="top-risks"
          title="Top risks"
          description="Top 5 open high/critical risks by risk score."
          action={
            <Link component={RouterLink} to="/risks" variant="body2" underline="hover">
              View all
            </Link>
          }
        >
          <DataTable
            columns={riskColumns}
            rows={topRisks}
            emptyMessage="No high or critical open risks."
          />
        </SectionCard>
      </Box>

      {/* Sections 8 & 9 */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <SectionCard
          id="upcoming-releases"
          title="Upcoming releases"
          description="Next release windows and readiness."
          action={
            <Link component={RouterLink} to="/releases" variant="body2" underline="hover">
              View all
            </Link>
          }
        >
          <DataTable
            columns={releaseColumns}
            rows={upcomingReleases}
            emptyMessage="No upcoming releases in scope."
          />
        </SectionCard>

        <SectionCard
          id="decisions-needed"
          title="Decisions needed"
          description="Stakeholder actions still pending."
          action={
            <Link component={RouterLink} to="/decisions" variant="body2" underline="hover">
              View all
            </Link>
          }
        >
          <DataTable
            columns={decisionColumns}
            rows={pendingDecisions}
            emptyMessage="No pending decisions."
          />
        </SectionCard>
      </Box>
    </Box>
  );
}

const IMPACT_RANK = { critical: 4, high: 3, medium: 2, low: 1 } as const;

const programColumns: TableColumn<ProgramHealthRow>[] = [
  {
    id: 'name',
    label: 'Program',
    render: (row) => (
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.code}
        </Typography>
      </Box>
    ),
  },
  {
    id: 'owner',
    label: 'Owner',
    render: (row) => row.owner.name,
  },
  {
    id: 'rag',
    label: 'RAG',
    render: (row) => <StatusBadge status={row.rag} />,
  },
  {
    id: 'percentComplete',
    label: 'Progress',
    align: 'right',
    render: (row) => (
      <Box sx={{ minWidth: 96 }}>
        <Typography variant="body2" align="right">
          {formatPercent(row.percentComplete)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={row.percentComplete}
          sx={{ mt: 0.5, height: 6, borderRadius: 999 }}
        />
      </Box>
    ),
  },
  {
    id: 'targetDate',
    label: 'Target Date',
  },
  {
    id: 'scheduleVariance',
    label: 'Schedule Variance',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        color={
          row.scheduleVariance < 0
            ? 'error.main'
            : row.scheduleVariance > 0
              ? 'success.main'
              : 'text.primary'
        }
        fontWeight={600}
      >
        {formatVariance(row.scheduleVariance)}
      </Typography>
    ),
  },
  {
    id: 'openRiskCount',
    label: 'Risk',
    align: 'right',
  },
  {
    id: 'blockerCount',
    label: 'Blockers',
    align: 'right',
  },
  {
    id: 'dependencyCount',
    label: 'Dependencies',
    align: 'right',
  },
];

type UpcomingMilestoneRow = Milestone & { daysLeft: number; programName: string };

const milestoneColumns: TableColumn<UpcomingMilestoneRow>[] = [
  { id: 'name', label: 'Milestone' },
  { id: 'programName', label: 'Program' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  { id: 'plannedDate', label: 'Target Date' },
  {
    id: 'daysLeft',
    label: 'Days Remaining',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        color={
          row.daysLeft < 0 ? 'error.main' : row.daysLeft <= 14 ? 'warning.main' : 'text.primary'
        }
        fontWeight={600}
      >
        {row.daysLeft}
      </Typography>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RagDot status={row.rag} />
        <Typography variant="body2">{titleCase(row.status)}</Typography>
      </Box>
    ),
  },
];

type BlockerRow = Dependency & { programName: string };

const blockerColumns: TableColumn<BlockerRow>[] = [
  { id: 'programName', label: 'Program' },
  { id: 'description', label: 'Blocker' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  {
    id: 'ageInDays',
    label: 'Age',
    align: 'right',
    render: (row) => `${row.ageInDays}d`,
  },
  {
    id: 'impact',
    label: 'Impact',
    render: (row) => <Chip size="small" label={titleCase(row.impact)} />,
  },
  {
    id: 'escalationOwner',
    label: 'Escalation',
    render: (row) => row.escalationOwner.name,
  },
];

type RiskRow = Risk & { score: number; programName: string };

const riskColumns: TableColumn<RiskRow>[] = [
  {
    id: 'score',
    label: 'Score',
    align: 'right',
    render: (row) => (
      <Typography variant="body2" fontWeight={700}>
        {row.score}
      </Typography>
    ),
  },
  { id: 'title', label: 'Risk' },
  { id: 'programName', label: 'Program' },
  {
    id: 'severity',
    label: 'Severity',
    render: (row) => (
      <StatusBadge
        status={row.severity === 'critical' || row.severity === 'high' ? 'red' : 'amber'}
        label={titleCase(row.severity)}
      />
    ),
  },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
];

type ReleaseRow = Release & { programName: string };

const releaseColumns: TableColumn<ReleaseRow>[] = [
  { id: 'version', label: 'Release' },
  { id: 'programName', label: 'Program' },
  { id: 'plannedDate', label: 'Planned' },
  {
    id: 'readinessScore',
    label: 'Readiness',
    align: 'right',
    render: (row) => (
      <Box sx={{ minWidth: 110 }}>
        <Typography variant="body2" align="right" fontWeight={600}>
          {row.readinessScore}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={row.readinessScore}
          color={
            row.readinessScore >= 85 ? 'success' : row.readinessScore >= 60 ? 'warning' : 'error'
          }
          sx={{ mt: 0.5, height: 6, borderRadius: 999 }}
        />
      </Box>
    ),
  },
  {
    id: 'goNoGo',
    label: 'Go/No-Go',
    render: (row) => titleCase(row.goNoGo),
  },
];

const decisionColumns: TableColumn<Decision>[] = [
  { id: 'title', label: 'Decision' },
  { id: 'owner', label: 'Owner', render: (row) => row.owner.name },
  { id: 'dueDate', label: 'Due' },
  {
    id: 'ageInDays',
    label: 'Age',
    align: 'right',
    render: (row) => `${row.ageInDays}d`,
  },
  {
    id: 'impact',
    label: 'Impact',
    render: (row) => titleCase(row.impact),
  },
  {
    id: 'escalationRequired',
    label: 'Escalation',
    render: (row) =>
      row.escalationRequired ? (
        <Chip size="small" color="error" label="Required" />
      ) : (
        <Chip size="small" label="No" variant="outlined" />
      ),
  },
];
