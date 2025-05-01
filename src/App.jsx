import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SampleDataProvider } from './utils/sampleDataContext.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import StudentView from './pages/StudentView.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <SampleDataProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/student" element={<StudentView />} />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SampleDataProvider>
  );
}

export default App;
