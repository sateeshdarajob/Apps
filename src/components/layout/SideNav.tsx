import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './constants';
import { NAVIGATION_ITEMS } from './navigationConfig';
import { getNavIcon } from './navIcons';

type SideNavProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const location = useLocation();
  const width = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2,
          py: 1.75,
          minHeight: 64,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {!collapsed && (
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.7, letterSpacing: 0.6 }}>
              TPM
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.2, color: 'inherit' }}>
              Control Tower
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{ color: 'inherit', bgcolor: 'rgba(255,255,255,0.08)' }}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 1.5 }}>
        {NAVIGATION_ITEMS.map((item) => {
          const selected =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          const button = (
            <ListItemButton
              key={item.id}
              component={NavLink}
              to={item.path}
              selected={selected}
              sx={{
                mb: 0.5,
                borderRadius: 1.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 1.5,
                color: 'inherit',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.16)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 36,
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                {getNavIcon(item.icon)}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: selected ? 600 : 500 }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.id} title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </List>
    </Drawer>
  );
}
