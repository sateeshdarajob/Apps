import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import type { GanttRow, TimelineColumn, TimelineViewMode } from '@/utils';
import { ROADMAP_STATE_COLORS, ROADMAP_STATE_LABELS, barPosition, markerPosition } from '@/utils';
import { StatusBadge } from '@/components/status';

type GanttTimelineProps = {
  rows: GanttRow[];
  columns: TimelineColumn[];
  rangeStart: Date;
  rangeEnd: Date;
  view: TimelineViewMode;
  onRowClick?: (row: GanttRow) => void;
};

export function GanttTimeline({
  rows,
  columns,
  rangeStart,
  rangeEnd,
  view,
  onRowClick,
}: GanttTimelineProps) {
  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ minWidth: view === 'week' ? 1100 : 920 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Program / Workstream
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(72px, 1fr))`,
            }}
          >
            {columns.map((column) => (
              <Box
                key={column.key}
                sx={{
                  px: 1,
                  py: 1.25,
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {column.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {rows.map((row) => {
          const { leftPct, widthPct } = barPosition(
            row.startDate,
            row.endDate,
            rangeStart,
            rangeEnd,
          );
          const color = ROADMAP_STATE_COLORS[row.state];

          return (
            <Box
              key={row.id}
              onClick={() => onRowClick?.(row)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': { bgcolor: 'action.hover' },
                minHeight: row.isProgramBar ? 64 : 56,
              }}
            >
              <Box sx={{ px: 2, py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.35 }}>
                <Typography
                  variant="body2"
                  fontWeight={row.isProgramBar ? 700 : 500}
                  noWrap
                  title={row.title}
                >
                  {row.isProgramBar ? row.programName : row.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {row.workstream}
                  {!row.isProgramBar ? ` · ${row.type}` : ''}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StatusBadge status={row.rag} />
                  <Typography variant="caption" color="text.secondary">
                    {row.percentComplete}%
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  backgroundImage: `repeating-linear-gradient(
                    to right,
                    transparent 0,
                    transparent calc(${100 / Math.max(columns.length, 1)}% - 1px),
                    #D8E1E8 calc(${100 / Math.max(columns.length, 1)}% - 1px),
                    #D8E1E8 calc(${100 / Math.max(columns.length, 1)}%)
                  )`,
                }}
              >
                <Tooltip
                  title={`${row.title} · ${ROADMAP_STATE_LABELS[row.state]} · ${row.startDate} → ${row.endDate}`}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: row.isProgramBar ? 18 : 14,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: row.isProgramBar ? 28 : 22,
                      borderRadius: 1.5,
                      bgcolor: color,
                      opacity: row.isProgramBar ? 0.95 : 0.85,
                      overflow: 'hidden',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={row.percentComplete}
                      sx={{
                        height: '100%',
                        bgcolor: 'transparent',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'rgba(255,255,255,0.35)',
                        },
                      }}
                    />
                  </Box>
                </Tooltip>

                {row.milestones.map((milestone) => {
                  const left = markerPosition(milestone.plannedDate, rangeStart, rangeEnd);
                  if (left < 0 || left > 100) return null;
                  return (
                    <Tooltip
                      key={milestone.id}
                      title={`Milestone: ${milestone.name} (${milestone.plannedDate})`}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: row.isProgramBar ? 12 : 8,
                          left: `${left}%`,
                          width: 10,
                          height: 10,
                          bgcolor: '#fff',
                          border: '2px solid',
                          borderColor: color,
                          transform: 'translateX(-50%) rotate(45deg)',
                          zIndex: 1,
                        }}
                      />
                    </Tooltip>
                  );
                })}

                {row.dependsOn.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      right: 8,
                      bottom: 4,
                      color: 'text.secondary',
                      bgcolor: 'rgba(255,255,255,0.85)',
                      px: 0.5,
                      borderRadius: 0.5,
                    }}
                  >
                    deps: {row.dependsOn.length}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}

        {rows.length === 0 && (
          <Box sx={{ px: 2, py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No roadmap items match the current filters.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
