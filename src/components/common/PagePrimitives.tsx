import type { ReactNode } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

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
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h2" component="h2" sx={{ mb: description ? 0.35 : 0 }}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 720, lineHeight: 1.45 }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
}

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
        py: 10,
        px: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <CircularProgress size={24} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 5,
        px: 3,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'grey.50',
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 1, opacity: 0.7 }} />
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 420, mx: 'auto', mb: action ? 2 : 0 }}
        >
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Unable to load this view',
  description = 'Something went wrong while loading data. Try refreshing, or adjust filters and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
      sx={{
        py: 5,
        px: 3,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'error.light',
        borderRadius: 2,
        bgcolor: 'error.light',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 28, color: 'error.main', mb: 1 }} />
      <Typography variant="h4" sx={{ mb: 0.5, color: 'error.dark' }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 440, mx: 'auto', mb: onRetry ? 2 : 0 }}
      >
        {description}
      </Typography>
      {onRetry && (
        <Button size="small" variant="outlined" color="error" onClick={onRetry}>
          Try again
        </Button>
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
        p: { xs: 2.5, md: 3.5 },
      }}
    >
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
        {description}
      </Typography>
    </Box>
  );
}
