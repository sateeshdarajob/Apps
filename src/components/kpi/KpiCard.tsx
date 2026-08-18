import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import type { KpiMetric } from '@/types';
import { formatDelta } from '@/utils';
import { StatusBadge } from '@/components/status';

type KpiCardProps = {
  metric: KpiMetric;
  onClick?: () => void;
};

function TrendIcon({ trend }: { trend?: KpiMetric['trend'] }) {
  if (trend === 'up') return <TrendingUpIcon fontSize="small" color="success" />;
  if (trend === 'down') return <TrendingDownIcon fontSize="small" color="error" />;
  if (trend === 'flat') return <TrendingFlatIcon fontSize="small" color="disabled" />;
  return null;
}

export function KpiCard({ metric, onClick }: KpiCardProps) {
  const content = (
    <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {metric.label}
        </Typography>
        {metric.status && <StatusBadge status={metric.status} />}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 1 }}>
        <Typography variant="h1" component="p" sx={{ fontSize: '1.75rem' }}>
          {metric.value}
          {metric.unit ? (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {metric.unit}
            </Typography>
          ) : null}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.25, minHeight: 24 }}>
        <TrendIcon trend={metric.trend} />
        {typeof metric.delta === 'number' && (
          <Typography
            variant="caption"
            color={
              metric.delta > 0 ? 'error.main' : metric.delta < 0 ? 'success.main' : 'text.secondary'
            }
          >
            {formatDelta(metric.delta)} pts
          </Typography>
        )}
        {metric.helperText && (
          <Typography variant="caption" color="text.secondary">
            {metric.helperText}
          </Typography>
        )}
      </Box>
    </CardContent>
  );

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        ...(onClick
          ? {
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 0 0 1px rgba(11, 58, 83, 0.12)',
              },
            }
          : {}),
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
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
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: `repeat(${Math.min(columns, 4)}, 1fr)`,
          xl: `repeat(${columns}, 1fr)`,
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
