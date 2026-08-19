import { useMemo, useState } from 'react';
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TableColumn } from '@/types';
import { EmptyState } from '@/components/common';

type SortDirection = 'asc' | 'desc';

type DataTableProps<T extends { id: string }> = {
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
  dense?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  filterPlaceholder?: string;
  getSortValue?: (row: T, columnId: string) => string | number | boolean | null | undefined;
  getFilterText?: (row: T) => string;
  onRowClick?: (row: T) => void;
  getRowSx?: (row: T) => SxProps<Theme>;
  maxHeight?: number | string;
};

function defaultSortValue<T extends { id: string }>(
  row: T,
  columnId: string,
): string | number | boolean | null | undefined {
  return (row as unknown as Record<string, unknown>)[columnId] as
    | string
    | number
    | boolean
    | null
    | undefined;
}

function compareValues(
  a: string | number | boolean | null | undefined,
  b: string | number | boolean | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = 'No data available',
  dense = true,
  sortable = false,
  filterable = false,
  filterPlaceholder = 'Filter rows…',
  getSortValue = defaultSortValue,
  getFilterText,
  onRowClick,
  getRowSx,
  maxHeight,
}: DataTableProps<T>) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>('asc');
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    if (!filterable || !query.trim()) return rows;
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (getFilterText) return getFilterText(row).toLowerCase().includes(needle);
      return columns.some((column) => {
        const value = getSortValue(row, String(column.id));
        return String(value ?? '')
          .toLowerCase()
          .includes(needle);
      });
    });
  }, [columns, filterable, getFilterText, getSortValue, query, rows]);

  const sortedRows = useMemo(() => {
    if (!sortable || !orderBy) return filteredRows;
    const next = [...filteredRows];
    next.sort((left, right) => {
      const result = compareValues(getSortValue(left, orderBy), getSortValue(right, orderBy));
      return order === 'asc' ? result : -result;
    });
    return next;
  }, [filteredRows, getSortValue, order, orderBy, sortable]);

  const handleSort = (columnId: string) => {
    if (!sortable) return;
    if (orderBy === columnId) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setOrderBy(columnId);
    setOrder('asc');
  };

  return (
    <Box>
      {filterable && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 1.25,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={filterPlaceholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 320, width: '100%' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {sortedRows.length} of {rows.length}
          </Typography>
        </Box>
      )}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: maxHeight ?? { xs: 420, lg: 'none' },
          borderRadius: 1.5,
          '& .MuiTableCell-stickyHeader': {
            backgroundColor: 'grey.50',
          },
        }}
      >
        <Table size={dense ? 'small' : 'medium'} stickyHeader={Boolean(maxHeight) || true}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const columnId = String(column.id);
                return (
                  <TableCell
                    key={columnId}
                    align={column.align ?? 'left'}
                    sx={{ width: column.width }}
                    sortDirection={orderBy === columnId ? order : false}
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={orderBy === columnId}
                        direction={orderBy === columnId ? order : 'asc'}
                        onClick={() => handleSort(columnId)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                  <EmptyState title={emptyMessage} description="Adjust filters or search to see results." />
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    ...(getRowSx ? getRowSx(row) : {}),
                  }}
                >
                  {columns.map((column) => {
                    const key = String(column.id);
                    const rawValue = (row as unknown as Record<string, unknown>)[key];

                    return (
                      <TableCell
                        key={key}
                        align={column.align ?? 'left'}
                        sx={{
                          fontVariantNumeric: 'tabular-nums',
                          verticalAlign: 'middle',
                        }}
                      >
                        {column.render ? column.render(row) : String(rawValue ?? '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
