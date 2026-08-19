import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Box, Card, CardActionArea, CardContent, Tooltip, Typography } from '@mui/material';
import type { KpiMetric, RagStatus } from '@/types';
import { formatDelta } from '@/utils';
import { StatusBadge } from '@/components/status';

type KpiCardProps = {
  metric: KpiMetric;
  onClick?: () => void;
};

function TrendIcon({ trend }: { trend?: KpiMetric['trend'] }) {
  const sx = { fontSize: 16, color: 'text.secondary' };
  if (trend === 'up') return <TrendingUpIcon sx={sx} />;
  if (trend === 'down') return <TrendingDownIcon sx={sx} />;
  if (trend === 'flat') return <TrendingFlatIcon sx={sx} />;
  return null;
}

function statusAccent(status?: RagStatus): string | undefined {
  if (status === 'red') return 'error.main';
  if (status === 'amber') return 'warning.main';
  return undefined;
}

export function KpiCard({ metric, onClick }: KpiCardProps) {
  const accent = statusAccent(metric.status);

  const content = (
    <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          minHeight: 22,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            lineHeight: 1.3,
            pr: 0.5,
          }}
        >
          {metric.label}
        </Typography>
        {metric.status && (metric.status === 'red' || metric.status === 'amber') ? (
          <StatusBadge status={metric.status} />
        ) : null}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1 }}>
        <Typography
          variant="h1"
          component="p"
          sx={{
            fontSize: { xs: '1.375rem', md: '1.5rem' },
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {metric.value}
        </Typography>
        {metric.unit ? (
          <Typography component="span" variant="caption" color="text.secondary">
            {metric.unit}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mt: 1,
          minHeight: 18,
          flexWrap: 'wrap',
        }}
      >
        <TrendIcon trend={metric.trend} />
        {typeof metric.delta === 'number' && (
          <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatDelta(metric.delta)}
          </Typography>
        )}
        {metric.helperText && (
          <Typography variant="caption" color="text.secondary" noWrap title={metric.helperText}>
            {metric.helperText}
          </Typography>
        )}
      </Box>
    </CardContent>
  );

  const card = (
    <Card
      sx={{
        height: '100%',
        borderLeft: accent ? '3px solid' : undefined,
        borderLeftColor: accent,
        transition: 'border-color 120ms ease, background-color 120ms ease',
        ...(onClick
          ? {
              '&:hover': {
                borderColor: 'primary.light',
                bgcolor: 'action.hover',
              },
            }
          : {}),
      }}
    >
      {onClick ? (
        <CardActionArea
          onClick={onClick}
          sx={{ height: '100%', alignItems: 'stretch', borderRadius: 'inherit' }}
        >
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );

  if (!onClick) return card;

  return (
    <Tooltip title={`Open ${metric.label}`} placement="top" enterDelay={600}>
      <Box sx={{ height: '100%' }}>{card}</Box>
    </Tooltip>
  );
}

type KpiCardGridProps = {
  metrics: KpiMetric[];
  onMetricClick?: (metric: KpiMetric) => void;
  columns?: number;
};

export function KpiCardGrid({ metrics, onMetricClick, columns = 4 }: KpiCardGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: `repeat(${Math.min(columns, 4)}, minmax(0, 1fr))`,
          lg: `repeat(${Math.min(columns, 6)}, minmax(0, 1fr))`,
          xl: `repeat(${columns}, minmax(0, 1fr))`,
        },
      }}
    >
      {metrics.map((metric) => (
        <KpiCard
          key={metric.id}
          metric={metric}
          onClick={onMetricClick ? () => onMetricClick(metric) : undefined}
        />
      ))}
    </Box>
  );
}
