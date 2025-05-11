import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HistoryView from './History/HistoryView';
import ReportsView from './History/ReportsView';

const HistorySection = () => {
  const { currentView } = useOutletContext();

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return <HistoryView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <HistoryView />;
    }
  };

  return (
    <div className="dashboard-section">
      {renderContent()}
    </div>
  );
};

export default HistorySection; 