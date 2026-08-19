import {
  Badge,
  Box,
  Button,
  Chip,
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
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { AUTO_REFRESH_OPTIONS, useFilterOptions, useGlobalFilters } from '@/hooks';
import {
  DATE_RANGE_OPTIONS,
  RAG_FILTER_OPTIONS,
  describeActiveFilters,
  formatRelativeTime,
  formatTimestamp,
} from '@/utils';
import type { AutoRefreshInterval, GlobalFilters } from '@/types';

export function GlobalFilterBar() {
  const {
    filters,
    setFilters,
    resetFilters,
    clearFilters,
    activeFilterCount,
    autoRefresh,
    setAutoRefresh,
    lastRefreshedAt,
    refreshNow,
  } = useGlobalFilters();
  const { portfolios, teams, products, quarters, programs } = useFilterOptions();

  const handleFilterChange = (key: keyof GlobalFilters) => (event: SelectChangeEvent<string>) => {
    setFilters({ [key]: event.target.value as never });
  };

  const activeChips = describeActiveFilters(filters, {
    portfolios,
    programs,
    teams,
    products,
    quarters,
  });

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
      <Stack spacing={1.5}>
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
                lg: 'repeat(4, minmax(120px, 1fr))',
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

            <Badge badgeContent={activeFilterCount || undefined} color="primary">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FilterAltOffIcon />}
                onClick={clearFilters}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Clear Filters
              </Button>
            </Badge>

            <Button
              variant="text"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={resetFilters}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Reset to Default
            </Button>

            <Box sx={{ minWidth: 150 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Last refreshed
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                title={formatTimestamp(lastRefreshedAt)}
              >
                {formatTimestamp(lastRefreshedAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatRelativeTime(lastRefreshedAt)}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {activeChips.length > 0 && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Active filters ({activeFilterCount}):
            </Typography>
            {activeChips.map((chip) => (
              <Chip
                key={chip.key}
                size="small"
                label={`${chip.label}: ${chip.value}`}
                onDelete={() =>
                  setFilters({
                    [chip.key]:
                      chip.key === 'dateRange'
                        ? '90d'
                        : chip.key === 'quarter'
                          ? 'all'
                          : 'all',
                  } as Partial<GlobalFilters>)
                }
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
