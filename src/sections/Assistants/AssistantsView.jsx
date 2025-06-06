import React from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import styles from './styles/AssistantsView.module.css';
import SystemHealth from './components/SystemHealth';
import AutomationSections from './components/AutomationSections';
import RecentActivities from './components/RecentActivities';

const AssistantsView = () => {
  const { assistants, toggleAssistant, updateAssistantConfig } = useAssistantStore();

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <SystemHealth />
          <AutomationSections 
            assistants={assistants}
            onToggle={toggleAssistant}
            onConfigUpdate={updateAssistantConfig}
          />
        </div>

        {/* Right Column - Automation Events */}
        <div className={styles.rightColumn}>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default AssistantsView; 