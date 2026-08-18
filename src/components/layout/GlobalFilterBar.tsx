import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AUTO_REFRESH_OPTIONS, useFilterOptions, useGlobalFilters } from '@/hooks';
import {
  DATE_RANGE_OPTIONS,
  RAG_FILTER_OPTIONS,
  formatRelativeTime,
  formatTimestamp,
} from '@/utils';
import type { AutoRefreshInterval, GlobalFilters } from '@/types';

export function GlobalFilterBar() {
  const {
    filters,
    setFilters,
    resetFilters,
    autoRefresh,
    setAutoRefresh,
    lastRefreshedAt,
    refreshNow,
  } = useGlobalFilters();
  const { portfolios, teams, products, quarters, programs } = useFilterOptions();

  const handleFilterChange = (key: keyof GlobalFilters) => (event: SelectChangeEvent<string>) => {
    setFilters({ [key]: event.target.value as never });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        px: { xs: 1.5, md: 2 },
        py: 1.5,
        mb: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', xl: 'center' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            flex: 1,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(7, minmax(120px, 1fr))',
            },
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="filter-portfolio">Portfolio</InputLabel>
            <Select
              labelId="filter-portfolio"
              label="Portfolio"
              value={filters.portfolioId}
              onChange={handleFilterChange('portfolioId')}
            >
              <MenuItem value="all">All portfolios</MenuItem>
              {portfolios.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-program">Program</InputLabel>
            <Select
              labelId="filter-program"
              label="Program"
              value={filters.programId}
              onChange={handleFilterChange('programId')}
            >
              <MenuItem value="all">All programs</MenuItem>
              {programs.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.code} — {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-quarter">Quarter</InputLabel>
            <Select
              labelId="filter-quarter"
              label="Quarter"
              value={filters.quarter}
              onChange={handleFilterChange('quarter')}
            >
              <MenuItem value="all">All quarters</MenuItem>
              {quarters.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-team">Team</InputLabel>
            <Select
              labelId="filter-team"
              label="Team"
              value={filters.teamId}
              onChange={handleFilterChange('teamId')}
            >
              <MenuItem value="all">All teams</MenuItem>
              {teams.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-product">Product</InputLabel>
            <Select
              labelId="filter-product"
              label="Product"
              value={filters.productId}
              onChange={handleFilterChange('productId')}
            >
              <MenuItem value="all">All products</MenuItem>
              {products.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-rag">RAG Status</InputLabel>
            <Select
              labelId="filter-rag"
              label="RAG Status"
              value={filters.ragStatus}
              onChange={handleFilterChange('ragStatus')}
            >
              {RAG_FILTER_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-range">Date Range</InputLabel>
            <Select
              labelId="filter-range"
              label="Date Range"
              value={filters.dateRange}
              onChange={handleFilterChange('dateRange')}
            >
              {DATE_RANGE_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ flexShrink: 0 }}
        >
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="auto-refresh">Auto refresh</InputLabel>
            <Select
              labelId="auto-refresh"
              label="Auto refresh"
              value={autoRefresh}
              onChange={(event: SelectChangeEvent<string>) =>
                setAutoRefresh(event.target.value as AutoRefreshInterval)
              }
            >
              {AUTO_REFRESH_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={refreshNow}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Refresh Now
          </Button>

          <Button
            variant="text"
            color="inherit"
            onClick={resetFilters}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Reset
          </Button>

          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Last refreshed
            </Typography>
            <Typography variant="body2" fontWeight={600} title={formatTimestamp(lastRefreshedAt)}>
              {formatRelativeTime(lastRefreshedAt)}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
