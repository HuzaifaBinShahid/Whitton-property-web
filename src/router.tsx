import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PropertiesPage } from '@/pages/PropertiesPage';
import { PropertyNewPage } from '@/pages/PropertyNewPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { UnitNewPage } from '@/pages/UnitNewPage';
import { UnitDetailPage } from '@/pages/UnitDetailPage';
import { UnitSelectPage } from '@/pages/UnitSelectPage';
import { StatsPage } from '@/pages/StatsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <PropertiesPage /> },
      { path: '/stats', element: <StatsPage /> },
      { path: '/property/new', element: <PropertyNewPage /> },
      { path: '/property/:id', element: <PropertyDetailPage /> },
      { path: '/unit/new', element: <UnitNewPage /> },
      { path: '/unit/:id', element: <UnitDetailPage /> },
      { path: '/unit/:id/select', element: <UnitSelectPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
