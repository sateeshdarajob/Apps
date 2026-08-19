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
  Tooltip,
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
        px: { xs: 1.25, md: 1.75 },
        py: 1.25,
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 1.5,
      }}
    >
      <Stack spacing={1.25}>
        {/* Filters on their own row so outlined InputLabels never collide with actions. */}
        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(7, minmax(120px, 1fr))',
            },
          }}
        >
          <FilterSelect
            id="filter-portfolio"
            label="Portfolio"
            value={filters.portfolioId}
            onChange={handleFilterChange('portfolioId')}
            allLabel="All portfolios"
            options={portfolios.map((item) => ({ value: item.id, label: item.name }))}
          />
          <FilterSelect
            id="filter-program"
            label="Program"
            value={filters.programId}
            onChange={handleFilterChange('programId')}
            allLabel="All programs"
            options={programs.map((item) => ({
              value: item.id,
              label: `${item.code} — ${item.name}`,
            }))}
          />
          <FilterSelect
            id="filter-quarter"
            label="Quarter"
            value={filters.quarter}
            onChange={handleFilterChange('quarter')}
            allLabel="All quarters"
            options={quarters.map((item) => ({ value: item.id, label: item.label }))}
          />
          <FilterSelect
            id="filter-team"
            label="Team"
            value={filters.teamId}
            onChange={handleFilterChange('teamId')}
            allLabel="All teams"
            options={teams.map((item) => ({ value: item.id, label: item.name }))}
          />
          <FilterSelect
            id="filter-product"
            label="Product"
            value={filters.productId}
            onChange={handleFilterChange('productId')}
            allLabel="All products"
            options={products.map((item) => ({ value: item.id, label: item.name }))}
          />
          <FormControl size="small" fullWidth sx={{ minWidth: 0 }}>
            <InputLabel id="filter-rag">RAG</InputLabel>
            <Select
              labelId="filter-rag"
              label="RAG"
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
          <FormControl size="small" fullWidth sx={{ minWidth: 0 }}>
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
          direction="row"
          spacing={1}
          alignItems="center"
          useFlexGap
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 128 }}>
            <InputLabel id="auto-refresh">Refresh</InputLabel>
            <Select
              labelId="auto-refresh"
              label="Refresh"
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

          <Tooltip title="Reload mock data and refresh timestamps">
            <Button
              variant="contained"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refreshNow}
            >
              Refresh Now
            </Button>
          </Tooltip>

          <Tooltip title="Clear all filter dimensions">
            <Badge badgeContent={activeFilterCount || undefined} color="primary">
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                startIcon={<FilterAltOffIcon />}
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Badge>
          </Tooltip>

          <Tooltip title="Restore default quarter and date range">
            <Button
              variant="text"
              size="small"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={resetFilters}
            >
              Defaults
            </Button>
          </Tooltip>

          <Box sx={{ minWidth: 128, pl: { sm: 0.5 } }}>
            <Typography variant="overline" display="block" sx={{ lineHeight: 1.2 }}>
              Last refreshed
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              title={formatTimestamp(lastRefreshedAt)}
              sx={{ lineHeight: 1.2 }}
            >
              {formatRelativeTime(lastRefreshedAt)}
            </Typography>
          </Box>
        </Stack>

        {activeChips.length > 0 && (
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Active ({activeFilterCount})
            </Typography>
            {activeChips.map((chip) => (
              <Chip
                key={chip.key}
                size="small"
                variant="outlined"
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

function FilterSelect({
  id,
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  // While async filter options load, avoid MUI out-of-range Select warnings.
  const valueInOptions =
    value === 'all' || options.some((item) => item.value === value) ? value : 'all';

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Select labelId={id} label={label} value={valueInOptions} onChange={onChange}>
        <MenuItem value="all">{allLabel}</MenuItem>
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
