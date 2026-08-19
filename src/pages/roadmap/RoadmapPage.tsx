import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { GanttTimeline } from '@/components/roadmap';
import { LoadingState, PageHeader, SectionCard } from '@/components/common';
import { RagDot } from '@/components/status';
import { DataTable } from '@/components/tables';
import { useGlobalFilters, useRoadmapData } from '@/hooks';
import type { Decision, Dependency, Milestone, Release, TableColumn } from '@/types';
import {
  ROADMAP_STATE_COLORS,
  ROADMAP_STATE_LABELS,
  buildGanttRows,
  computeTimelineRange,
  daysRemaining,
  isPendingDecision,
  isUpcomingRelease,
  titleCase,
} from '@/utils';
import type { GanttRow, TimelineViewMode } from '@/utils';

export function RoadmapPage() {
  const navigate = useNavigate();
  const { filters, setFilters } = useGlobalFilters();
  const { programs, roadmapItems, milestones, releases, dependencies, decisions, isLoading } =
    useRoadmapData();
  const [view, setView] = useState<TimelineViewMode>('month');

  const ganttRows = useMemo(
    () => buildGanttRows(roadmapItems, programs, milestones),
    [roadmapItems, programs, milestones],
  );

  const { rangeStart, rangeEnd, columns } = useMemo(
    () => computeTimelineRange(ganttRows, view),
    [ganttRows, view],
  );

  const upcomingMilestones = useMemo(() => {
    return [...milestones]
      .filter((item) => item.status !== 'completed' && item.status !== 'cancelled')
      .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))
      .slice(0, 8)
      .map((item) => ({
        ...item,
        daysLeft: daysRemaining(item.plannedDate),
        programName: programs.find((p) => p.id === item.programId)?.name ?? item.programId,
      }));
  }, [milestones, programs]);

  const upcomingReleases = useMemo(() => {
    return [...releases]
      .filter((item) => isUpcomingRelease(item))
      .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))
      .slice(0, 6)
      .map((item) => ({
        ...item,
        programName: programs.find((p) => p.id === item.programId)?.name ?? item.programId,
      }));
  }, [releases, programs]);

  const keyDependencies = useMemo(() => {
    return [...dependencies]
      .filter((item) => item.isBlocker || item.status === 'blocked' || item.status === 'atRisk')
      .sort((a, b) => b.ageInDays - a.ageInDays)
      .slice(0, 6)
      .map((item) => ({
        ...item,
        programName: programs.find((p) => p.id === item.programId)?.name ?? item.programId,
      }));
  }, [dependencies, programs]);

  const decisionPoints = useMemo(() => {
    return [...decisions]
      .filter(isPendingDecision)
      .sort(
        (a, b) =>
          Number(b.escalationRequired) - Number(a.escalationRequired) ||
          a.dueDate.localeCompare(b.dueDate),
      )
      .slice(0, 6);
  }, [decisions]);

  const handleRowClick = (row: GanttRow) => {
    navigate(`/programs/${row.programId}`);
  };

  if (isLoading) {
    return <LoadingState label="Loading portfolio roadmap…" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageHeader
        title="Portfolio roadmap"
        description="Executive timeline of programs, workstreams, milestones, releases, and decision points."
        actions={
          <Stack direction="row" spacing={1.25} alignItems="center" useFlexGap flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="roadmap-view">Timeline</InputLabel>
              <Select
                labelId="roadmap-view"
                label="Timeline"
                value={view}
                onChange={(event: SelectChangeEvent) =>
                  setView(event.target.value as TimelineViewMode)
                }
              >
                <MenuItem value="month">Month view</MenuItem>
                <MenuItem value="week">Week view</MenuItem>
              </Select>
            </FormControl>
            {(filters.quarter !== 'all' ||
              filters.programId !== 'all' ||
              filters.teamId !== 'all') && (
              <Button
                size="small"
                onClick={() =>
                  setFilters({ quarter: 'all', programId: 'all', teamId: 'all', ragStatus: 'all' })
                }
              >
                Reset roadmap filters
              </Button>
            )}
          </Stack>
        }
      />

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {(Object.keys(ROADMAP_STATE_LABELS) as Array<keyof typeof ROADMAP_STATE_LABELS>).map(
          (state) => (
            <Chip
              key={state}
              size="small"
              label={ROADMAP_STATE_LABELS[state]}
              sx={{
                bgcolor: `${ROADMAP_STATE_COLORS[state]}22`,
                color: ROADMAP_STATE_COLORS[state],
                border: `1px solid ${ROADMAP_STATE_COLORS[state]}55`,
                fontWeight: 600,
              }}
            />
          ),
        )}
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Diamond markers = milestones · Use global Quarter / Program / Team filters above
        </Typography>
      </Stack>

      {/* 1 & 2 — Portfolio + program roadmap Gantt */}
      <SectionCard
        id="portfolio-roadmap"
        title="Portfolio & program roadmap"
        description="Gantt-style executive view. Click a bar to open Program Detail."
      >
        <GanttTimeline
          rows={ganttRows}
          columns={columns}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          view={view}
          onRowClick={handleRowClick}
        />
      </SectionCard>

      {/* 3 — Milestone timeline */}
      <SectionCard
        id="milestone-timeline"
        title="Milestone timeline"
        description="Upcoming milestones across the filtered portfolio."
      >
        <DataTable
          columns={milestoneColumns}
          rows={upcomingMilestones}
          emptyMessage="No upcoming milestones for the current filters."
        />
      </SectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
        }}
      >
        {/* 4 — Upcoming releases */}
        <SectionCard
          id="upcoming-releases"
          title="Upcoming releases"
          description="Next release windows."
        >
          <DataTable
            columns={releaseColumns}
            rows={upcomingReleases}
            emptyMessage="No upcoming releases."
          />
        </SectionCard>

        {/* 5 — Key dependencies */}
        <SectionCard
          id="key-dependencies"
          title="Key dependencies"
          description="Blockers and at-risk deps."
        >
          <DataTable
            columns={dependencyColumns}
            rows={keyDependencies}
            emptyMessage="No critical dependencies."
          />
        </SectionCard>

        {/* 6 — Major decision points */}
        <SectionCard
          id="decision-points"
          title="Major decision points"
          description="Stakeholder decisions on the critical path."
        >
          <DataTable
            columns={decisionColumns}
            rows={decisionPoints}
            emptyMessage="No pending decisions."
          />
        </SectionCard>
      </Box>
    </Box>
  );
}

type MilestoneRow = Milestone & { daysLeft: number; programName: string };

const milestoneColumns: TableColumn<MilestoneRow>[] = [
  { id: 'name', label: 'Milestone' },
  { id: 'programName', label: 'Program' },
  { id: 'plannedDate', label: 'Target' },
  {
    id: 'daysLeft',
    label: 'Days Left',
    align: 'right',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={600}
        color={
          row.daysLeft < 0 ? 'error.main' : row.daysLeft <= 14 ? 'warning.main' : 'text.primary'
        }
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

type ReleaseRow = Release & { programName: string };

const releaseColumns: TableColumn<ReleaseRow>[] = [
  { id: 'version', label: 'Release' },
  { id: 'programName', label: 'Program' },
  { id: 'plannedDate', label: 'Date' },
  {
    id: 'readinessScore',
    label: 'Ready',
    align: 'right',
    render: (row) => `${row.readinessScore}%`,
  },
];

type DependencyRow = Dependency & { programName: string };

const dependencyColumns: TableColumn<DependencyRow>[] = [
  { id: 'programName', label: 'Program' },
  { id: 'description', label: 'Dependency' },
  {
    id: 'status',
    label: 'Status',
    render: (row) => titleCase(row.status),
  },
];

const decisionColumns: TableColumn<Decision>[] = [
  { id: 'title', label: 'Decision' },
  { id: 'dueDate', label: 'Due' },
  {
    id: 'escalationRequired',
    label: 'Escalation',
    render: (row) =>
      row.escalationRequired ? (
        <Chip size="small" color="error" label="Required" />
      ) : (
        <Chip size="small" variant="outlined" label="No" />
      ),
  },
];
