import React from 'react';
import { PublicLayout } from './layouts/PublicLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { PricingPage } from './pages/public/PricingPage';
import { StudentLayout } from './layouts/StudentLayout';
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
import './styles.css';

function App() {
  const path = window.location.pathname;
  const publicPage = path === '/login' ? LoginPage : path === '/signup' ? SignupPage : path === '/pricing' ? PricingPage : LandingPage;
  const segments = path.split('/').filter(Boolean);
  const StudentPage = path === '/profile' ? ProfilePage : path === '/settings' ? SettingsPage : path === '/companies' ? CompaniesPage : segments[0] === 'companies' && segments.length >= 2 ? CompanyPreparationPage : path === '/practice' ? PracticePage : path === '/practice/aptitude' ? AptitudePage : segments[0] === 'practice' && segments[1] === 'aptitude' && segments.length === 3 ? AptitudeCategoryPage : segments[0] === 'practice' && segments[1] === 'aptitude' && segments.length >= 4 ? AptitudeTopicPage : path === '/practice/dsa' ? DSASheetPage : segments[0] === 'practice' && segments[1] === 'dsa' && segments.length >= 3 ? DSAProblemPage : path === '/mock-tests' ? MockTestsPage : segments[0] === 'mock-tests' && segments.length === 2 ? MockTestInstructionsPage : segments[0] === 'mock-tests' && segments[2] === 'start' ? MockTestPage : segments[0] === 'mock-tests' && segments[2] === 'result' ? MockTestResultPage : segments[0] === 'mock-tests' && segments[2] === 'review' ? MockTestReviewPage : path === '/learning' ? LearningPage : path === '/learning/academics' ? AcademicsPage : path === '/learning/dsa' ? DSAPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length === 3 ? SemesterPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length === 4 ? SubjectPage : segments[0] === 'learning' && segments[1] === 'academics' && segments.length >= 5 ? LessonPage : segments[0] === 'learning' && segments[1] === 'dsa' && segments.length >= 3 ? DSATopicPage : DashboardPage;
  const studentPaths = ['/dashboard', '/profile', '/settings', '/learning', '/practice', '/coding', '/mock-tests', '/companies'];
  return studentPaths.includes(path) ? <StudentLayout><StudentPage /></StudentLayout> : <PublicLayout><publicPage /></PublicLayout>;
}

export default App;
