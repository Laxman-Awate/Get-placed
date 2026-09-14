import React from 'react';
import { PublicLayout } from './layouts/PublicLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { PricingPage } from './pages/public/PricingPage';
import { StudentLayout } from './layouts/StudentLayout';
import { CodingWorkspaceLayout } from './layouts/CodingWorkspaceLayout';
import { DashboardPage } from './pages/student/DashboardPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { SettingsPage } from './pages/student/SettingsPage';
import { LearningPage } from './pages/student/LearningPage';
import { AcademicsPage } from './pages/learning/AcademicsPage';
import { SemesterPage } from './pages/learning/SemesterPage';
import { SubjectPage } from './pages/learning/SubjectPage';
import { LessonPage } from './pages/learning/LessonPage';
import { DSAPage } from './pages/learning/DSAPage';
import { DSATopicPage } from './pages/learning/DSATopicPage';
import { CoreSubjectsPage } from './pages/learning/CoreSubjectsPage';
import { PracticePage } from './pages/student/PracticePage';
import { DSASheetPage } from './pages/practice/DSASheetPage';
import { DSAProblemPage } from './pages/practice/DSAProblemPage';
import { CompaniesPage } from './pages/student/CompaniesPage';
import { CompanyPreparationPage } from './pages/student/CompanyPreparationPage';
import { AptitudePage } from './pages/student/AptitudePage';
import { AptitudeCategoryPage } from './pages/student/AptitudeCategoryPage';
import { AptitudeTopicPage } from './pages/student/AptitudeTopicPage';
import { MockTestsPage } from './pages/student/MockTestsPage';
import { MockTestInstructionsPage } from './pages/student/MockTestInstructionsPage';
import { MockTestPage } from './pages/student/MockTestPage';
import { MockTestResultPage } from './pages/student/MockTestResultPage';
import { MockTestReviewPage } from './pages/student/MockTestReviewPage';
import { CodingPage } from './pages/student/CodingPage';
import { CodingProblemsPage } from './pages/student/CodingProblemsPage';
import { CodingProblemPage } from './pages/student/CodingProblemPage';
import { PlacementReadinessPage } from './pages/student/PlacementReadinessPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGuard } from './components/navigation/AuthGuard';
import { ThemeProvider } from './context/ThemeContext';
import './styles.css';

function Application() {
  const { isAuthenticated } = useAuth();
  const path = window.location.pathname;
  const PublicPage = path === '/login' ? LoginPage : path === '/signup' ? SignupPage : path === '/pricing' ? PricingPage : LandingPage;
  const segments = path.split('/').filter(Boolean);
  const StudentPage = path === '/profile' ? ProfilePage : path === '/placement-readiness' ? PlacementReadinessPage : path === '/settings' ? SettingsPage : path === '/companies' ? CompaniesPage : path === '/learning/core-subjects' ? CoreSubjectsPage : segments[0] === 'companies' && segments.length >= 2 ? CompanyPreparationPage : path === '/practice' ? PracticePage : path === '/practice/aptitude' ? AptitudePage : segments[0] === 'practice' && segments[1] === 'aptitude' && segments.length === 3 ? AptitudeCategoryPage : segments[0] === 'practice' && segments[1] === 'aptitude' && segments.length >= 4 ? AptitudeTopicPage : path === '/practice/dsa' ? DSASheetPage : segments[0] === 'practice' && segments[1] === 'dsa' && segments.length >= 3 ? DSAProblemPage : path === '/coding' ? CodingPage : path === '/coding/problems' ? CodingProblemsPage : segments[0] === 'coding' && segments[1] === 'problems' && segments.length >= 3 ? CodingProblemPage : path === '/mock-tests' ? MockTestsPage : segments[0] === 'mock-tests' && segments.length === 2 ? MockTestInstructionsPage : segments[0] === 'mock-tests' && segments[2] === 'start' ? MockTestPage : segments[0] === 'mock-tests' && segments[2] === 'result' ? MockTestResultPage : segments[0] === 'mock-tests' && segments[2] === 'review' ? MockTestReviewPage : path === '/learning' ? LearningPage : path === '/learning/academics' ? AcademicsPage : path === '/learning/dsa' ? DSAPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length === 3 ? SemesterPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length === 4 ? SubjectPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length >= 5 ? LessonPage : segments[0] === 'learning' && segments[1] === 'dsa' && segments.length >= 3 ? DSATopicPage : DashboardPage;
  const studentRootPaths = ['/dashboard', '/profile', '/settings', '/learning', '/practice', '/coding', '/mock-tests', '/companies', '/placement-readiness'];
  const isStudentPath = studentRootPaths.some(root => path === root || path.startsWith(`${root}/`));
  const isCodingProblemPath = segments[0] === 'coding' && segments[1] === 'problems' && segments.length >= 3;
  const content = isCodingProblemPath ? <CodingWorkspaceLayout><StudentPage /></CodingWorkspaceLayout> : isStudentPath ? <StudentLayout><StudentPage /></StudentLayout> : <PublicLayout><PublicPage /></PublicLayout>;
  return isStudentPath ? <AuthGuard>{content}</AuthGuard> : content;
}

function App() { return <ThemeProvider><AuthProvider><Application /></AuthProvider></ThemeProvider>; }

export default App;
