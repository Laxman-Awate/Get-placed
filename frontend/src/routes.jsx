import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route-level code splitting: each page becomes its own chunk so the
// initial bundle stays small and reloads are fast. The heavy Monaco
// editor (Coding pages) is no longer part of the first paint.
const Landing = lazy(() => import('./pages/Landing'));
const Register = lazy(() => import('./pages/Register'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const TargetCompanies = lazy(() => import('./pages/TargetCompanies'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Learn = lazy(() => import('./pages/Learn'));
const Practice = lazy(() => import('./pages/Practice'));
const Coding = lazy(() => import('./pages/Coding'));
const MockTest = lazy(() => import('./pages/MockTest'));
const TestUI = lazy(() => import('./pages/TestUI'));
const Results = lazy(() => import('./pages/Results'));
const CompanyPrep = lazy(() => import('./pages/CompanyPrep'));
const Interviews = lazy(() => import('./pages/Interviews'));
const Resume = lazy(() => import('./pages/Resume'));
const PlacementReady = lazy(() => import('./pages/PlacementReady'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
        <span className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        Loading...
      </div>
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, element: withSuspense(Landing) },
      { path: 'login', element: withSuspense(Register) },
      { path: 'register', element: withSuspense(Register) },
      { path: 'oauth/callback', element: withSuspense(OAuthCallback) },
      { path: 'profile-setup', element: withSuspense(ProfileSetup) },
      { path: 'target-companies', element: withSuspense(TargetCompanies) },
      {
        path: 'dashboard',
        Component: DashboardLayout,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: 'learn', element: withSuspense(Learn) },
          { path: 'practice', element: withSuspense(Practice) },
          { path: 'coding', element: withSuspense(Coding) },
          { path: 'mock-test', element: withSuspense(MockTest) },
          { path: 'test-ui', element: withSuspense(TestUI) },
          { path: 'results', element: withSuspense(Results) },
          { path: 'company-prep', element: withSuspense(CompanyPrep) },
          { path: 'interviews', element: withSuspense(Interviews) },
          { path: 'resume', element: withSuspense(Resume) },
          { path: 'placement-ready', element: withSuspense(PlacementReady) },
          { path: 'roadmap', element: withSuspense(Roadmap) },
          { path: 'settings', element: withSuspense(SettingsPage) },
        ],
      },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
]);
