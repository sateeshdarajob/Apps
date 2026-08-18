import { useMemo, useState } from 'react';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { AppHeader } from './AppHeader';
import { GlobalFilterBar } from './GlobalFilterBar';
import { resolveNavigationItem } from './navigationConfig';
import { APP_HEADER_HEIGHT, DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './constants';

export function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawerOffset = isMobile ? 0 : collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;
  const title = useMemo(
    () => resolveNavigationItem(location.pathname)?.label ?? 'Overview',
    [location.pathname],
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SideNav
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <AppHeader
        title={title}
        drawerOffset={drawerOffset}
        onMobileMenuOpen={() => setMobileOpen(true)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerOffset}px)`,
          minWidth: 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: `${APP_HEADER_HEIGHT}px !important` }} />
        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
          <GlobalFilterBar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
