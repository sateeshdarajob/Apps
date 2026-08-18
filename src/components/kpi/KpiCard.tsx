import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Box, Card, CardContent, Typography } from '@mui/material';
import type { KpiMetric } from '@/types';
import { formatDelta } from '@/utils';
import { StatusBadge } from '@/components/status';

type KpiCardProps = {
  metric: KpiMetric;
};

function TrendIcon({ trend }: { trend?: KpiMetric['trend'] }) {
  if (trend === 'up') return <TrendingUpIcon fontSize="small" color="success" />;
  if (trend === 'down') return <TrendingDownIcon fontSize="small" color="error" />;
  if (trend === 'flat') return <TrendingFlatIcon fontSize="small" color="disabled" />;
  return null;
}

export function KpiCard({ metric }: KpiCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
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
                metric.delta > 0
                  ? 'error.main'
                  : metric.delta < 0
                    ? 'success.main'
                    : 'text.secondary'
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
    </Card>
  );
}

type KpiCardGridProps = {
  metrics: KpiMetric[];
};

export function KpiCardGrid({ metrics }: KpiCardGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {metrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </Box>
  );
}
