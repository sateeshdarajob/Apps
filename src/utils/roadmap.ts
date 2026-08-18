import type { Milestone, RoadmapDeliveryState, RoadmapItem } from '@/types';
import { daysRemaining } from './overview';

export type TimelineViewMode = 'month' | 'week';

export type TimelineColumn = {
  key: string;
  label: string;
  start: Date;
  end: Date;
};

export function roadmapDeliveryState(item: RoadmapItem, asOf = new Date()): RoadmapDeliveryState {
  if (item.status === 'completed') return 'completed';
  if (daysRemaining(item.endDate, asOf) < 0 && item.percentComplete < 100) return 'delayed';
  if (item.status === 'blocked' || item.rag === 'red') return 'delayed';
  if (item.status === 'atRisk' || item.rag === 'amber') return 'atRisk';
  return 'inProgress';
}

export const ROADMAP_STATE_COLORS: Record<RoadmapDeliveryState, string> = {
  completed: '#2E7D4F',
  inProgress: '#1565A0',
  atRisk: '#C47A11',
  delayed: '#C62828',
};

export const ROADMAP_STATE_LABELS: Record<RoadmapDeliveryState, string> = {
  completed: 'Completed',
  inProgress: 'In Progress',
  atRisk: 'At Risk',
  delayed: 'Delayed',
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function computeTimelineRange(
  items: { startDate: string; endDate: string }[],
  view: TimelineViewMode,
): { rangeStart: Date; rangeEnd: Date; columns: TimelineColumn[] } {
  if (items.length === 0) {
    const now = startOfMonth(new Date());
    const end = endOfMonth(addDays(now, 90));
    return {
      rangeStart: now,
      rangeEnd: end,
      columns: buildColumns(now, end, view),
    };
  }

  const minStart = items.reduce(
    (min, item) => Math.min(min, new Date(item.startDate).getTime()),
    Number.POSITIVE_INFINITY,
  );
  const maxEnd = items.reduce(
    (max, item) => Math.max(max, new Date(item.endDate).getTime()),
    Number.NEGATIVE_INFINITY,
  );

  const rangeStart =
    view === 'week' ? startOfWeek(new Date(minStart)) : startOfMonth(new Date(minStart));
  const rangeEnd =
    view === 'week' ? addDays(startOfWeek(new Date(maxEnd)), 6) : endOfMonth(new Date(maxEnd));

  return {
    rangeStart,
    rangeEnd,
    columns: buildColumns(rangeStart, rangeEnd, view),
  };
}

function buildColumns(rangeStart: Date, rangeEnd: Date, view: TimelineViewMode): TimelineColumn[] {
  const columns: TimelineColumn[] = [];
  if (view === 'month') {
    let cursor = startOfMonth(rangeStart);
    while (cursor <= rangeEnd) {
      const end = endOfMonth(cursor);
      columns.push({
        key: `${cursor.getFullYear()}-${cursor.getMonth() + 1}`,
        label: cursor.toLocaleString(undefined, { month: 'short', year: '2-digit' }),
        start: cursor,
        end,
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return columns;
  }

  let cursor = startOfWeek(rangeStart);
  while (cursor <= rangeEnd) {
    const end = addDays(cursor, 6);
    columns.push({
      key: cursor.toISOString().slice(0, 10),
      label: cursor.toLocaleString(undefined, { month: 'short', day: 'numeric' }),
      start: cursor,
      end,
    });
    cursor = addDays(cursor, 7);
  }
  return columns;
}

export function barPosition(
  startDate: string,
  endDate: string,
  rangeStart: Date,
  rangeEnd: Date,
): { leftPct: number; widthPct: number } {
  const total = Math.max(rangeEnd.getTime() - rangeStart.getTime(), 1);
  const start = Math.max(new Date(startDate).getTime(), rangeStart.getTime());
  const end = Math.min(new Date(endDate).getTime(), rangeEnd.getTime());
  const leftPct = ((start - rangeStart.getTime()) / total) * 100;
  const widthPct = Math.max(((end - start) / total) * 100, 1.5);
  return { leftPct, widthPct };
}

export function markerPosition(date: string, rangeStart: Date, rangeEnd: Date): number {
  const total = Math.max(rangeEnd.getTime() - rangeStart.getTime(), 1);
  const value = new Date(date).getTime();
  return ((value - rangeStart.getTime()) / total) * 100;
}

export type GanttRow = {
  id: string;
  programId: string;
  programName: string;
  workstream: string;
  title: string;
  type: RoadmapItem['type'];
  startDate: string;
  endDate: string;
  percentComplete: number;
  rag: RoadmapItem['rag'];
  state: RoadmapDeliveryState;
  dependsOn: string[];
  milestones: Milestone[];
  isProgramBar: boolean;
};

export function buildGanttRows(
  items: RoadmapItem[],
  programs: { id: string; name: string }[],
  milestones: Milestone[],
): GanttRow[] {
  const programName = (id: string) => programs.find((p) => p.id === id)?.name ?? id;
  const programBars = items.filter((item) => item.type === 'program');
  const workItems = items.filter((item) => item.type !== 'program');

  const rows: GanttRow[] = [];
  for (const programBar of programBars) {
    rows.push({
      id: programBar.id,
      programId: programBar.programId,
      programName: programName(programBar.programId),
      workstream: programBar.workstream,
      title: programBar.title,
      type: programBar.type,
      startDate: programBar.startDate,
      endDate: programBar.endDate,
      percentComplete: programBar.percentComplete,
      rag: programBar.rag,
      state: roadmapDeliveryState(programBar),
      dependsOn: programBar.dependsOn,
      milestones: milestones.filter((m) => m.programId === programBar.programId),
      isProgramBar: true,
    });

    for (const item of workItems.filter((w) => w.programId === programBar.programId)) {
      rows.push({
        id: item.id,
        programId: item.programId,
        programName: programName(item.programId),
        workstream: item.workstream,
        title: item.title,
        type: item.type,
        startDate: item.startDate,
        endDate: item.endDate,
        percentComplete: item.percentComplete,
        rag: item.rag,
        state: roadmapDeliveryState(item),
        dependsOn: item.dependsOn,
        milestones: milestones.filter((m) => item.milestoneIds?.includes(m.id)),
        isProgramBar: false,
      });
    }
  }

  // Include orphan work items if any
  for (const item of workItems) {
    if (rows.some((row) => row.id === item.id)) continue;
    rows.push({
      id: item.id,
      programId: item.programId,
      programName: programName(item.programId),
      workstream: item.workstream,
      title: item.title,
      type: item.type,
      startDate: item.startDate,
      endDate: item.endDate,
      percentComplete: item.percentComplete,
      rag: item.rag,
      state: roadmapDeliveryState(item),
      dependsOn: item.dependsOn,
      milestones: milestones.filter((m) => item.milestoneIds?.includes(m.id)),
      isProgramBar: false,
    });
  }

  return rows;
}
