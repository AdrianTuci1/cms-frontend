import { getBusinessType } from '../../config/businessTypes';
import AutomationSection from '../../sections/AutomationSection';
import HistorySection from '../../sections/HistorySection';
import StaffSection from '../../sections/StaffSection';
import SettingsSection from '../../sections/SettingsSection';
import TimelineView from '../../views/TimelineView';
import SalesView from '../../views/SalesView';
import ClientsView from '../../views/ClientsView';
import StocksView from '../../views/StocksView';

const Dashboard = ({ currentSection, currentView }) => {
  const businessType = getBusinessType();

  const renderHomeView = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView />;
      case 'sales':
        return <SalesView />;
      case 'clients':
        return <ClientsView />;
      case 'stocks':
        return <StocksView />;
      default:
        return <TimelineView />;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return renderHomeView();
      case 'automation':
        return <AutomationSection />;
      case 'history':
        return <HistorySection />;
      case 'staff':
        return <StaffSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <h1>{businessType.name} Dashboard</h1>
      <div className="dashboard-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard; 