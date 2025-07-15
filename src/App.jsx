import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './layout/dashboard/Dashboard';
import LocationsPage from './pages/LocationsPage';
import './App.css';

// Import the data clearing script
import '../clearData.js';

function App() {

  return (
    <Router>
      <div className="App"> 
        <Routes>
          {/* Locations page - first page users see */}
          <Route path="/" element={<LocationsPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          
          {/* Redirect to locations if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
