import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useLocation } from 'react-router-dom';
import { useCurrentUser, useNotifications } from '@/hooks';
import { formatRelativeTime } from '@/utils';
import { APP_HEADER_HEIGHT } from './constants';
import { AppBreadcrumbs } from './AppBreadcrumbs';

type AppHeaderProps = {
  title: string;
  drawerOffset: number;
  onMobileMenuOpen: () => void;
};

export function AppHeader({ title, drawerOffset, onMobileMenuOpen }: AppHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((item) => !item.read).length;

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${drawerOffset}px)`,
        ml: isMobile ? 0 : `${drawerOffset}px`,
        height: APP_HEADER_HEIGHT,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${APP_HEADER_HEIGHT}px !important`,
          gap: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {isMobile && (
            <IconButton edge="start" onClick={onMobileMenuOpen} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ minWidth: 0 }}>
            <AppBreadcrumbs pathname={location.pathname} />
            <Typography variant="h2" component="h1" noWrap>
              {title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Notifications">
            <IconButton
              aria-label="Notifications"
              onClick={(event) => setNotifAnchor(event.currentTarget)}
            >
              <Badge badgeContent={unreadCount} color="error" max={9}>
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

          <Tooltip title={user?.name ?? 'Profile'}>
            <IconButton
              onClick={(event) => setProfileAnchor(event.currentTarget)}
              aria-label="User profile"
              sx={{ borderRadius: 2, px: 1, gap: 1 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {user?.avatarInitials ?? 'U'}
              </Avatar>
              {!isMobile && (
                <Box sx={{ textAlign: 'left', display: { xs: 'none', lg: 'block' } }}>
                  <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                    {user?.name ?? 'Loading…'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                    {user?.role ?? ''}
                  </Typography>
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 340, maxWidth: '90vw' } } }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle2">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No notifications" />
          </MenuItem>
        ) : (
          notifications.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => setNotifAnchor(null)}
              sx={{ alignItems: 'flex-start', py: 1.25 }}
            >
              <ListItemText
                primary={item.title}
                secondary={`${item.body} · ${formatRelativeTime(new Date(item.createdAt))}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: item.read ? 500 : 600,
                }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
          ))
        )}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1.25, minWidth: 220 }}>
          <Typography variant="subtitle2">{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
