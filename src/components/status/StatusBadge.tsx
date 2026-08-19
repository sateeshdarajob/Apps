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
        bgcolor: `${color}14`,
        color,
        border: `1px solid ${color}40`,
        fontWeight: 600,
        height: size === 'small' ? 20 : 24,
        '& .MuiChip-label': { px: 0.85, lineHeight: 1 },
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
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        component="span"
        aria-label={RAG_LABELS[status]}
        title={RAG_LABELS[status]}
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          display: 'inline-block',
          flexShrink: 0,
          boxShadow: `0 0 0 2px ${color}22`,
        }}
      />
      {withLabel && (
        <Typography variant="caption" color="text.secondary">
          {RAG_LABELS[status]}
        </Typography>
      )}
    </Box>
  );
}
