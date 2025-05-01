import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import BulkUpload from '../components/admin/BulkUpload.jsx';
import ScoreUpload from '../components/admin/ScoreUpload.jsx';
import TrainingModuleView from '../components/admin/TrainingModuleView.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('adminAuth');
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bulk-upload" element={<BulkUpload />} />
        <Route path="score-upload" element={<ScoreUpload />} />
        <Route path="training-modules" element={<TrainingModuleView />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
