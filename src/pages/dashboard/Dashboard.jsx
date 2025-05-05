import { useOutletContext } from 'react-router-dom';
import { getBusinessType } from '../../config/businessTypes';
import AutomationSection from '../../sections/AutomationSection';
import HistorySection from '../../sections/HistorySection';
import StaffSection from '../../sections/StaffSection';
import SettingsSection from '../../sections/SettingsSection';
import TimelineView from '../../views/TimelineView';
import AnalyticsView from '../../views/AnalyticsView';
import SalesView from '../../views/SalesView';
import ClientsView from '../../views/ClientsView';

const Dashboard = () => {
  const { currentSection, currentView } = useOutletContext();
  const businessType = getBusinessType();

  const renderDashboardViews = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView />;
      case 'analytics':
        return <AnalyticsView />;
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
      case 'team':
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