import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import UploadCollectionPage from './pages/UploadCollectionPage';
import RunResultsPage from './pages/RunResultsPage';
import HistoryPage from './pages/HistoryPage';
// import SettingsPage from './pages/SettingsPage';
// import LoginPage from './pages/LoginPage';

import WebhookDashboard from './pages/webhooks/Dashboard';
import WebhookEndpoints from './pages/webhooks/Endpoints';
import WebhookRequests from './pages/webhooks/Requests';
import WebhookReports from './pages/webhooks/Reports';
import WebhookHistory from './pages/webhooks/History';
import WebhookSettings from './pages/webhooks/Settings';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="upload" element={<UploadCollectionPage />} />
        <Route path="results" element={<RunResultsPage />} />
        <Route path="results/:executionId" element={<RunResultsPage />} />
        <Route path="history" element={<HistoryPage />} />
        {/* <Route path="settings" element={<SettingsPage />} /> */}
        {/* <Route path="login" element={<LoginPage />} /> */}
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Webhook Inspector routes */}
        <Route path="webhooks/dashboard" element={<WebhookDashboard />} />
        <Route path="webhooks/endpoints" element={<WebhookEndpoints />} />
        <Route path="webhooks/requests" element={<WebhookRequests />} />
        <Route path="webhooks/reports" element={<WebhookReports />} />
        <Route path="webhooks/history" element={<WebhookHistory />} />
        <Route path="webhooks/settings" element={<WebhookSettings />} />
      </Route>
    </Routes>
  );
}
