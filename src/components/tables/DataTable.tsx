import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { TableColumn } from '@/types';

type DataTableProps<T extends { id: string }> = {
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
  dense?: boolean;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = 'No data available',
  dense = true,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                align={column.align ?? 'left'}
                sx={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => {
                  const key = String(column.id);
                  const rawValue = (row as unknown as Record<string, unknown>)[key];

                  return (
                    <TableCell key={key} align={column.align ?? 'left'}>
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
  );
}
