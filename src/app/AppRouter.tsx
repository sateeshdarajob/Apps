import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import {
  CapacityPage,
  ControlTowerPage,
  DependenciesPage,
  ProgramsPage,
  RisksPage,
  SettingsPage,
} from '@/pages';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ControlTowerPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="risks" element={<RisksPage />} />
          <Route path="dependencies" element={<DependenciesPage />} />
          <Route path="capacity" element={<CapacityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
