import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicNavbar from './components/layout/PublicNavbar';
import LandingPage from './features/landing/LandingPage';
import EventsPage from './features/events/EventsPage';
import EventDetailsPage from './features/events/EventDetailsPage';
import LeaderboardPage from './features/leaderboard/LeaderboardPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardIndex from './features/dashboard/DashboardIndex';
import AdminUsers from './features/admin/AdminUsers';
import AdminEvents from './features/admin/AdminEvents';
import AdminLeaderboards from './features/admin/AdminLeaderboards';
import AdminSettings from './features/admin/AdminSettings';
import OrganizerEvents from './features/organizer/OrganizerEvents';
import OrganizerJudging from './features/organizer/OrganizerJudging';
import OrganizerTeams from './features/organizer/OrganizerTeams';
import ParticipantDashboard from './features/participant/ParticipantDashboard';
import ParticipantActivities from './features/participant/ParticipantActivities';
import ParticipantRegister from './features/participant/ParticipantRegister';
import ParticipantSubmitAbstract from './features/participant/ParticipantSubmitAbstract';

const PublicLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <PublicNavbar />
    <div className="flex-1 mt-[68px]"><Outlet /></div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardIndex />} />
        <Route path="activities" element={<ParticipantActivities />} />
        <Route path="register-team" element={<ParticipantRegister />} />
        <Route path="submit-abstract" element={<ParticipantSubmitAbstract />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/events" element={<AdminEvents />} />
        <Route path="admin/leaderboards" element={<AdminLeaderboards />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="organizer/events" element={<OrganizerEvents />} />
        <Route path="organizer/judging" element={<OrganizerJudging />} />
        <Route path="organizer/teams" element={<OrganizerTeams />} />
      </Route>
    </Routes>
  );
}
