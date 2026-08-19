import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  compact?: boolean;
};

export function SectionCard({
  id,
  title,
  description,
  action,
  children,
  compact = false,
}: SectionCardProps) {
  return (
    <Card id={id} sx={{ height: '100%' }}>
      <CardContent
        sx={{
          p: compact ? 1.75 : 2,
          '&:last-child': { pb: compact ? 1.75 : 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1.5,
            mb: description ? 0.25 : 1.5,
          }}
        >
          <Typography variant="h4" component="h3">
            {title}
          </Typography>
          {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Box>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.75, maxWidth: 720, lineHeight: 1.45 }}
          >
            {description}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
