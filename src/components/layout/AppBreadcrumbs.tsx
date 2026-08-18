import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { resolveNavigationItem } from './navigationConfig';

type AppBreadcrumbsProps = {
  pathname: string;
};

export function AppBreadcrumbs({ pathname }: AppBreadcrumbsProps) {
  const current = resolveNavigationItem(pathname);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ '& .MuiBreadcrumbs-separator': { mx: 0.75 } }}>
      <MuiLink
        component={RouterLink}
        to="/"
        underline="hover"
        color="text.secondary"
        variant="caption"
      >
        Control Tower
      </MuiLink>
      <Typography variant="caption" color="text.primary" fontWeight={600}>
        {current?.label ?? 'Overview'}
      </Typography>
    </Breadcrumbs>
  );
}
