import { BUSINESS_TYPES } from '../../config/businessTypes';

const DashboardNavbar = ({ businessType, currentSection, setCurrentSection }) => {
  const getDashboardItems = () => {
    return [
      { id: 'home', label: 'Home' },
      { id: 'automation', label: 'Automation' },
      { id: 'history', label: 'History' },
      { id: 'staff', label: 'Staff' },
      { id: 'settings', label: 'Settings' }
    ];
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-brand">
        <span>{businessType.name} Dashboard</span>
      </div>
      <div className="navbar-menu">
        {getDashboardItems().map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
            onClick={() => setCurrentSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="navbar-end">
        <button className="nav-item">Profile</button>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 