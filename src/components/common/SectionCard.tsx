import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ id, title, description, action, children }: SectionCardProps) {
  return (
    <Card id={id} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: description ? 0.5 : 2,
          }}
        >
          <Typography variant="h4">{title}</Typography>
          {action}
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
