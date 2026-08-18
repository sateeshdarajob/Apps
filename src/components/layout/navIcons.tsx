import type { ReactElement } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const iconMap: Record<string, ReactElement> = {
  overview: <DashboardOutlinedIcon fontSize="small" />,
  delivery: <LocalShippingOutlinedIcon fontSize="small" />,
  roadmap: <MapOutlinedIcon fontSize="small" />,
  dependencies: <HubOutlinedIcon fontSize="small" />,
  risks: <WarningAmberOutlinedIcon fontSize="small" />,
  releases: <RocketLaunchOutlinedIcon fontSize="small" />,
  incidents: <ReportProblemOutlinedIcon fontSize="small" />,
  resources: <GroupsOutlinedIcon fontSize="small" />,
  metrics: <InsightsOutlinedIcon fontSize="small" />,
  decisions: <GavelOutlinedIcon fontSize="small" />,
  settings: <SettingsOutlinedIcon fontSize="small" />,
};

export function getNavIcon(iconKey: string): ReactElement {
  return iconMap[iconKey] ?? <DashboardOutlinedIcon fontSize="small" />;
}
