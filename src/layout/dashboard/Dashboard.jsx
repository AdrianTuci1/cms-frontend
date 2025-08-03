import { useOutletContext } from 'react-router-dom';
import AutomationSection from '../../features/04-Automations/views/AutomationSection';
import HistorySection from '../../features/05-Activities/views/HistorySection';
import AdminView from '../../features/06-Admin/views/AdminView';
import StocksView from '../../features/02-Stocks/views/StocksView';
import TimelineView from '../../features/01-Home/views/01-Timeline/TimelineView';
import SalesView from '../../features/01-Home/views/02-Sales/SalesView';
import ClientsView from '../../features/01-Home/views/03-Clients/ClientsView';
import ServicesView from '../../features/01-Home/views/04-Services/ServicesView';
import InvoicesSection from '../../features/03-Invoices/views/InvoicesSection';
import BlitzView from '../../features/08-Blitz/BlitzView';

// Component for dashboard views
const DashboardViews = () => {
  const { currentView } = useOutletContext();

  const renderDashboardViews = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView />;
      case 'sales':
        return <SalesView />;
      case 'clients':
        return <ClientsView />;
      case 'services':
        return <ServicesView />;
      default:
        return <TimelineView />;
    }
  };

  return (
    <div>
      {renderDashboardViews()}
    </div>
  );
};

// Component for other sections that don't need the data context
const OtherSections = () => {
  const { currentSection, currentView } = useOutletContext();

  const renderSection = () => {
    switch (currentSection) {
      case 'blitz':
        return <BlitzView />;
      case 'stocks':
        return <StocksView view={currentView} />;
      case 'automations':
        return <AutomationSection />;
      case 'activities':
        return <HistorySection />;
      case 'admin':
        return <AdminView />;
      case 'invoices':
        return <InvoicesSection />;
      default:
        return null;
    }
  };

  return renderSection();
};

const Dashboard = () => {
  const { currentSection } = useOutletContext();

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {currentSection === 'dashboard' ? (
          <DashboardViews />
        ) : (
          <OtherSections />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 