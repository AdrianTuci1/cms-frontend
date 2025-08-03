import React, { useEffect, useState } from 'react';
import { useWorkflowsStore } from '../../store/workflowsStore';
import styles from './styles/AssistantsView.module.css';
import SystemControls from '../../components/SystemControls';
import Graph from '../../components/Graph';
import AutomationSections from '../../components/AutomationSections';
import RecentActivities from '../../components/RecentActivities';

const AssistantsView = () => {
  const [showAutomationSettings, setShowAutomationSettings] = useState(false);
  
  const { 
    assistants, 
    recentActivities, 
    isLoading, 
    error,
    toggleAssistant, 
    updateAssistantConfig,
    fetchRecentActivities
  } = useWorkflowsStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);

  const handleSettingsClick = () => {
    setShowAutomationSettings(true);
  };

  const handleBackClick = () => {
    setShowAutomationSettings(false);
  };

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
        {/* Left Column - Graph with absolute positioned controls */}
        <div className={styles.leftColumn}>
          {/* System Controls positioned absolutely in top-left corner */}
          <div className={styles.controlsOverlay}>
            <SystemControls 
              onSettingsClick={handleSettingsClick}
            />
          </div>
          
          {/* Graph Component - occupies entire left column */}
          <Graph />
          
          {/* Automation Settings Overlay */}
          {showAutomationSettings && (
            <div className={styles.automationOverlay}>
              <div className={styles.automationOverlayContent}>
                <div className={styles.automationOverlayHeader}>
                  <button 
                    className={styles.backButton}
                    onClick={handleBackClick}
                  >
                    ← Înapoi
                  </button>
                  <h3>Configurare Automatizări</h3>
                </div>
                <AutomationSections 
                  assistants={assistants}
                  onToggle={toggleAssistant}
                  onConfigUpdate={updateAssistantConfig}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recent Activities */}
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