import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import TargetCompanies from './pages/TargetCompanies';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Coding from './pages/Coding';
import MockTest from './pages/MockTest';
import TestUI from './pages/TestUI';
import Results from './pages/Results';
import CompanyPrep from './pages/CompanyPrep';
import Interviews from './pages/Interviews';
import Resume from './pages/Resume';
import PlacementReady from './pages/PlacementReady';
import Roadmap from './pages/Roadmap';
import SettingsPage from './pages/Settings';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: 'register', Component: Register },
      { path: 'profile-setup', Component: ProfileSetup },
      { path: 'target-companies', Component: TargetCompanies },
      {
        path: 'dashboard',
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'learn', Component: Learn },
          { path: 'practice', Component: Practice },
          { path: 'coding', Component: Coding },
          { path: 'mock-test', Component: MockTest },
          { path: 'test-ui', Component: TestUI },
          { path: 'results', Component: Results },
          { path: 'company-prep', Component: CompanyPrep },
          { path: 'interviews', Component: Interviews },
          { path: 'resume', Component: Resume },
          { path: 'placement-ready', Component: PlacementReady },
          { path: 'roadmap', Component: Roadmap },
          { path: 'settings', Component: SettingsPage },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
]);
