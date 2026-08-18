import { PlaceholderPanel } from '@/components/common';
import { useGlobalFilters } from '@/hooks';
import { Box, Chip, Stack, Typography } from '@mui/material';

type RoutePlaceholderPageProps = {
  title: string;
  description: string;
};

/** Shared placeholder shell that also surfaces active global filters for verification. */
export function RoutePlaceholderPage({ title, description }: RoutePlaceholderPageProps) {
  const { filters, lastRefreshedAt, autoRefresh, refreshKey } = useGlobalFilters();

  return (
    <Box>
      <PlaceholderPanel title={title} description={description} />
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Active global filters
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip size="small" label={`Portfolio: ${filters.portfolioId}`} />
          <Chip size="small" label={`Program: ${filters.programId}`} />
          <Chip size="small" label={`Quarter: ${filters.quarter}`} />
          <Chip size="small" label={`Team: ${filters.teamId}`} />
          <Chip size="small" label={`Product: ${filters.productId}`} />
          <Chip size="small" label={`RAG: ${filters.ragStatus}`} />
          <Chip size="small" label={`Range: ${filters.dateRange}`} />
          <Chip size="small" label={`Auto-refresh: ${autoRefresh}`} />
          <Chip size="small" label={`Refresh #${refreshKey}`} />
          <Chip size="small" label={`Updated: ${lastRefreshedAt.toLocaleTimeString()}`} />
        </Stack>
      </Box>
    </Box>
  );
}
