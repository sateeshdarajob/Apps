import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useLocation } from 'react-router-dom';
import { useDashboardRole } from '@/hooks';
import { navigationForRole } from '@/utils';
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './constants';
import { NAVIGATION_ITEMS } from './navigationConfig';
import { getNavIcon } from './navIcons';

type SideNavProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
};

export function SideNav({ collapsed, mobileOpen, onToggleCollapse, onMobileClose }: SideNavProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const desktopWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;
  const showLabels = isMobile || !collapsed;
  const { role } = useDashboardRole();

  const visibleItems = navigationForRole(NAVIGATION_ITEMS, role);
  const primaryItems = visibleItems.filter((item) => item.section !== 'secondary');
  const secondaryItems = visibleItems.filter((item) => item.section === 'secondary');

  const renderItems = (items: typeof NAVIGATION_ITEMS) =>
    items.map((item) => {
      const selected =
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

      const button = (
        <ListItemButton
          key={item.id}
          component={NavLink}
          to={item.path}
          selected={selected}
          onClick={isMobile ? onMobileClose : undefined}
          sx={{
            mb: 0.5,
            borderRadius: 1.5,
            justifyContent: showLabels ? 'flex-start' : 'center',
            px: showLabels ? 1.5 : 1,
            color: '#FFFFFF',
            '&.Mui-selected': {
              bgcolor: 'rgba(255,255,255,0.18)',
              color: '#FFFFFF',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
            },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            // Theme typography variants hardcode dark slate — override for navy drawer.
            '& .MuiListItemIcon-root': { color: '#FFFFFF' },
            '& .MuiListItemText-primary': {
              color: '#FFFFFF',
              fontWeight: selected ? 600 : 500,
              opacity: 1,
            },
            '& .MuiSvgIcon-root': { color: '#FFFFFF' },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: showLabels ? 36 : 0,
              color: '#FFFFFF',
              justifyContent: 'center',
            }}
          >
            {getNavIcon(item.icon)}
          </ListItemIcon>
          {showLabels && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.8125rem',
                lineHeight: 1.45,
                fontWeight: selected ? 600 : 500,
                sx: { color: '#FFFFFF' },
              }}
            />
          )}
        </ListItemButton>
      );

      return showLabels ? (
        button
      ) : (
        <Tooltip key={item.id} title={item.label} placement="right">
          {button}
        </Tooltip>
      );
    });

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: showLabels ? 'space-between' : 'center',
          px: showLabels ? 2 : 1,
          py: 1.75,
          minHeight: 56,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {showLabels && (
          <Box sx={{ minWidth: 0, pr: 1 }}>
            <Typography
              sx={{
                display: 'block',
                lineHeight: 1.2,
                color: 'rgba(255,255,255,0.72)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Engineering
            </Typography>
            <Typography
              sx={{
                lineHeight: 1.2,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              TPM Control Tower
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            sx={{ color: 'inherit', bgcolor: 'rgba(255,255,255,0.08)', flexShrink: 0 }}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
        {isMobile && (
          <IconButton
            onClick={onMobileClose}
            size="small"
            sx={{ color: 'inherit', bgcolor: 'rgba(255,255,255,0.08)' }}
            aria-label="Close navigation"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>{renderItems(primaryItems)}</List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 1.5 }} />
        <List sx={{ px: 1, py: 1.5 }}>{renderItems(secondaryItems)}</List>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: desktopWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: desktopWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRight: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
