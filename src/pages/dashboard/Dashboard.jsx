import { useOutletContext } from 'react-router-dom';
import AutomationSection from '../../sections/AutomationSection';
import HistorySection from '../../sections/HistorySection';
import StaffSection from '../../sections/StaffSection';
import SettingsSection from '../../sections/SettingsSection';
import TimelineView from '../../views/TimelineView';
import StocksView from '../../views/StocksView';
import SalesView from '../../views/SalesView';
import ClientsView from '../../views/ClientsView';

const Dashboard = () => {
  const { currentSection, currentView } = useOutletContext();

  const renderDashboardViews = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView />;
      case 'stocks':
        return <StocksView />;
      case 'sales':
        return <SalesView />;
      case 'clients':
        return <ClientsView />;
      default:
        return <TimelineView />;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return renderDashboardViews();
      case 'automations':
        return <AutomationSection />;
      case 'activities':
        return <HistorySection />;
      case 'admin':
        return <StaffSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard; 