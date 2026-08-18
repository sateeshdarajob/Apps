import { Box, Chip, Typography, useTheme } from '@mui/material';
import type { RagStatus } from '@/types';
import { RAG_LABELS, getRagColor } from '@/utils';

type StatusBadgeProps = {
  status: RagStatus;
  label?: string;
  size?: 'small' | 'medium';
};

export function StatusBadge({ status, label, size = 'small' }: StatusBadgeProps) {
  const theme = useTheme();
  const color = getRagColor(theme, status);

  return (
    <Chip
      size={size}
      label={label ?? RAG_LABELS[status]}
      sx={{
        bgcolor: `${color}18`,
        color,
        border: `1px solid ${color}55`,
        fontWeight: 600,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

type RagDotProps = {
  status: RagStatus;
  withLabel?: boolean;
};

export function RagDot({ status, withLabel = false }: RagDotProps) {
  const theme = useTheme();
  const color = getRagColor(theme, status);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        component="span"
        aria-label={RAG_LABELS[status]}
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {withLabel && (
        <Typography variant="body2" color="text.secondary">
          {RAG_LABELS[status]}
        </Typography>
      )}
    </Box>
  );
}
