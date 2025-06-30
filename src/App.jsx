import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './layout/dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        {/* Redirect to signin if no route matches */}
      </Routes>
    </Router>
  );
};

export default App;
