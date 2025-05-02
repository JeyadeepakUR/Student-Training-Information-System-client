import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext.jsx';
import { ThemeProvider } from './ThemeProvider';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentView from './pages/StudentView';
import StudentLayout from './components/Students/StudentLayout';
import StudentDashboard from './components/Students/StudentDashboard';
import MyTrainings from './components/Students/MyTrainings';
import Attendance from './components/Students/Attendance';
import ExamPerformance from './components/Students/ExamPerformance';
import Profile from './components/Students/Profile';
import StudentRegister from './components/Students/StudentRegister';
import StudentLogin from './components/Students/StudentLogin';
import Leaderboard from './components/Students/Leaderboard';
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

const StudentPrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isStudentAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
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
            
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/" element={
              <StudentPrivateRoute>
                <StudentLayout />
              </StudentPrivateRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="student/trainings" element={<MyTrainings />} />
              <Route path="student/attendance" element={<Attendance />} />
              <Route path="student/exams" element={<ExamPerformance />} />
              <Route path="student/profile" element={<Profile />} />
              <Route path="student/leaderboard" element={<Leaderboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SampleDataProvider>
    </ThemeProvider>
  );
};

export default App;
