import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import {
  DecisionsPage,
  DeliveryPage,
  DependenciesPage,
  IncidentsPage,
  MetricsPage,
  OverviewPage,
  ReleasesPage,
  ResourcesPage,
  RisksPage,
  RoadmapPage,
  SettingsPage,
} from '@/pages';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="dependencies" element={<DependenciesPage />} />
          <Route path="risks" element={<RisksPage />} />
          <Route path="releases" element={<ReleasesPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="decisions" element={<DecisionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
