import { Box, CircularProgress, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h2" component="h2">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  );
}

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 8,
      }}
    >
      <CircularProgress size={28} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
}

type PlaceholderPanelProps = {
  title: string;
  description: string;
};

/** Lightweight placeholder for routes that are scaffolded but not yet implemented. */
export function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: 4,
      }}
    >
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
