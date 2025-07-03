import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './layout/dashboard/Dashboard';
import './App.css';

// Import the data clearing script
import '../clearData.js';

function App() {

  return (
    <Router>
      <div className="App"> 
        <Routes>
          {/* Protected routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          {/* Redirect to signin if no route matches */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
