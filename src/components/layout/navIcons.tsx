import type { ReactElement } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const iconMap: Record<string, ReactElement> = {
  dashboard: <DashboardOutlinedIcon fontSize="small" />,
  programs: <AccountTreeOutlinedIcon fontSize="small" />,
  risks: <WarningAmberOutlinedIcon fontSize="small" />,
  dependencies: <HubOutlinedIcon fontSize="small" />,
  capacity: <GroupsOutlinedIcon fontSize="small" />,
  settings: <SettingsOutlinedIcon fontSize="small" />,
};

export function getNavIcon(iconKey: string): ReactElement {
  return iconMap[iconKey] ?? <DashboardOutlinedIcon fontSize="small" />;
}
