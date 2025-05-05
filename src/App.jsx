import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebpageLayout from './layouts/WebpageLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { getBusinessType } from './config/businessTypes';

// Public pages
import SignIn from './pages/SignIn';

// Business-specific pages
import Medics from './pages/dental/Medics';
import Treatments from './pages/dental/Treatments';
import Packages from './pages/gym/Packages';
import Classes from './pages/gym/Classes';
import Rooms from './pages/hotel/Rooms';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';
import LandingPage from './pages/LandingPage';

const App = () => {
  const businessType = getBusinessType();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<WebpageLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Business-specific routes */}
          {businessType.name === 'Dental Clinic' && (
            <>
              <Route path="/medics" element={<Medics />} />
              <Route path="/treatments" element={<Treatments />} />
            </>
          )}
          {businessType.name === 'Gym' && (
            <>
              <Route path="/packages" element={<Packages />} />
              <Route path="/classes" element={<Classes />} />
            </>
          )}
          {businessType.name === 'Hotel' && (
            <Route path="/rooms" element={<Rooms />} />
          )}
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Redirect to dashboard if no route matches */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
