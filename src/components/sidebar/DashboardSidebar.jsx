import { BUSINESS_TYPES } from '../../config/businessTypes';

const DashboardSidebar = ({ businessType, currentView, setCurrentView }) => {
  const getSidebarItems = () => {
    return [
      { id: 'timeline', label: 'Timeline' },
      { id: 'sales', label: 'Sales' },
      { id: 'clients', label: 'Clients' },
      { id: 'stocks', label: 'Stocks' }
    ];
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-menu">
        {getSidebarItems().map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar; 