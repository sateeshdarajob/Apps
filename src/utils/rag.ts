import type { Theme } from '@mui/material/styles';
import type { RagStatus } from '@/types';

export function getRagColor(theme: Theme, status: RagStatus): string {
  switch (status) {
    case 'green':
      return theme.palette.success.main;
    case 'amber':
      return theme.palette.warning.main;
    case 'red':
      return theme.palette.error.main;
    case 'grey':
    default:
      return theme.palette.grey[500];
  }
}
