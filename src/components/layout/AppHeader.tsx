import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useGlobalFilters, useOrgUnits, useProgramOptions } from '@/hooks';
import { DATE_RANGE_OPTIONS } from '@/utils';
import type { GlobalFilters } from '@/types';
import { APP_HEADER_HEIGHT } from './constants';

type AppHeaderProps = {
  title: string;
  drawerOffset: number;
};

export function AppHeader({ title, drawerOffset }: AppHeaderProps) {
  const { filters, setFilters } = useGlobalFilters();
  const { data: orgUnits = [] } = useOrgUnits();
  const { data: programs = [] } = useProgramOptions();

  const handleChange = (key: keyof GlobalFilters) => (event: SelectChangeEvent<string>) => {
    setFilters({ [key]: event.target.value });
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        width: `calc(100% - ${drawerOffset}px)`,
        ml: `${drawerOffset}px`,
        height: APP_HEADER_HEIGHT,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${APP_HEADER_HEIGHT}px !important`,
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Technical Program Management
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="filter-org-label">Org Unit</InputLabel>
            <Select
              labelId="filter-org-label"
              label="Org Unit"
              value={filters.orgUnitId}
              onChange={handleChange('orgUnitId')}
            >
              <MenuItem value="all">All org units</MenuItem>
              {orgUnits.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="filter-program-label">Program</InputLabel>
            <Select
              labelId="filter-program-label"
              label="Program"
              value={filters.programId}
              onChange={handleChange('programId')}
            >
              <MenuItem value="all">All programs</MenuItem>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.code} — {program.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-range-label">Date Range</InputLabel>
            <Select
              labelId="filter-range-label"
              label="Date Range"
              value={filters.dateRange}
              onChange={handleChange('dateRange')}
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
