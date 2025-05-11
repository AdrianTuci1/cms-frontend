import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AssistantsView from './Assistants/AssistantsView';
import TriggersView from './Assistants/TriggersView';

const AutomationSection = () => {
  const { currentView } = useOutletContext();

  const renderContent = () => {
    switch (currentView) {
      case 'workflows':
        return <AssistantsView />;
      case 'triggers':
        return <TriggersView />;
      default:
        return <AssistantsView />;
    }
  };

  return (
    <div className="dashboard-section">
      {renderContent()}
    </div>
  );
};

export default AutomationSection; 