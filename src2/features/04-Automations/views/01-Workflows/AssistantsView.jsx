import React, { useEffect } from 'react';
import { useWorkflowsStore } from '../../store/workflowsStore';
import styles from './styles/AssistantsView.module.css';
import SystemHealth from '../../components/SystemHealth';
import AutomationSections from '../../components/AutomationSections';
import RecentActivities from '../../components/RecentActivities';

const AssistantsView = () => {
  const { 
    assistants, 
    systemHealth, 
    recentActivities, 
    isLoading, 
    error,
    toggleAssistant, 
    updateAssistantConfig,
    fetchSystemHealth,
    fetchRecentActivities
  } = useWorkflowsStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchSystemHealth();
    fetchRecentActivities();
  }, [fetchSystemHealth, fetchRecentActivities]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Eroare la încărcarea datelor: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <SystemHealth 
            systemHealth={systemHealth}
            isLoading={isLoading}
          />
          <AutomationSections 
            assistants={assistants}
            onToggle={toggleAssistant}
            onConfigUpdate={updateAssistantConfig}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Automation Events */}
        <div className={styles.rightColumn}>
          <RecentActivities 
            activities={recentActivities}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AssistantsView; 