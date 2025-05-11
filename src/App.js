import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ManageStudents from './pages/ManageStudents';
import ManageVaccinationDrives from './pages/ManageVaccinationDrives';
import EnrollStudents from './pages/EnrollStudents';
import VaccinationReport from './pages/VaccinationReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-students"
          element={
            <PrivateRoute>
              <ManageStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-drives"
          element={
            <PrivateRoute>
              <ManageVaccinationDrives />
            </PrivateRoute>
          }
        />
        <Route
          path="/enroll-students"
          element={
            <PrivateRoute>
              <EnrollStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <VaccinationReport />
            </PrivateRoute>
          }
        />
        {/* Redirect root to login or dashboard if token exists */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
