import { useOutletContext } from 'react-router-dom';
import AutomationSection from '../../sections/AutomationSection';
import HistorySection from '../../sections/HistorySection';
import StaffSection from '../../sections/StaffSection';
import StocksSection from '../../sections/Stocks/StocksSection';
import TimelineView from '../../views/TimelineView';
import SalesView from '../../views/SalesView';
import ClientsView from '../../views/ClientsView';
import TreatmentsView from '../../views/TreatmentsView';
import PackagesView from '../../views/PackagesView';
import RoomsView from '../../views/RoomsView';

const Dashboard = () => {
  const { currentSection, currentView } = useOutletContext();

  const renderDashboardViews = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView />;
      case 'sales':
        return <SalesView />;
      case 'clients':
        return <ClientsView />;
      case 'treatments':
        return <TreatmentsView />;
      case 'packages':
        return <PackagesView />;
      case 'rooms':
        return <RoomsView />;
      default:
        return <TimelineView />;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return renderDashboardViews();
      case 'stocks':
        return <StocksSection view={currentView} />;
      case 'automations':
        return <AutomationSection />;
      case 'activities':
        return <HistorySection />;
      case 'admin':
        return <StaffSection />;
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