import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentView from './pages/StudentView';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import BulkUpload from './components/admin/BulkUpload';
import ScoreUpload from './components/admin/ScoreUpload';
import TrainingModuleView from './components/admin/TrainingModuleView';
import StudentList from './components/admin/StudentList';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <SampleDataProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/students"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <StudentList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/bulk-upload"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BulkUpload />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/scores"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ScoreUpload />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/training"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <TrainingModuleView />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<StudentView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SampleDataProvider>
  );
};

export default App;
