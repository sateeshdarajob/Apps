import { useMemo, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { AppHeader } from './AppHeader';
import { NAVIGATION_ITEMS } from './navigationConfig';
import { APP_HEADER_HEIGHT, DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './constants';

function resolvePageTitle(pathname: string): string {
  const match = NAVIGATION_ITEMS.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
  );
  return match?.label ?? 'Control Tower';
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const drawerOffset = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;
  const title = useMemo(() => resolvePageTitle(location.pathname), [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SideNav collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <AppHeader title={title} drawerOffset={drawerOffset} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerOffset}px)`,
          minWidth: 0,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar sx={{ minHeight: `${APP_HEADER_HEIGHT}px !important` }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
