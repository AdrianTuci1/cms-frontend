import React, { useState } from 'react';
import styles from '../styles/AutomationSections.module.css';

const AutomationSections = ({ assistants, onToggle, onConfigUpdate, isLoading }) => {
  const [showApiKey, setShowApiKey] = useState({
    booking: false,
    whatsapp: false,
    reporting: false
  });
  const [expandedSections, setExpandedSections] = useState({
    booking: false,
    whatsapp: false,
    reporting: false
  });

  const handleApiKeyUpdate = (assistantId, apiKey) => {
    if (onConfigUpdate) {
      onConfigUpdate(assistantId, { apiKey });
    }
  };

  const toggleApiKeyVisibility = (assistantId) => {
    setShowApiKey(prev => ({
      ...prev,
      [assistantId]: !prev[assistantId]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggle = (assistantId) => {
    if (onToggle && !isLoading) {
      onToggle(assistantId);
    }
  };

  const renderAutomationSection = (id, title, icon, type) => (
    <div className={styles.automationSection}>
      <div className={styles.automationHeader}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={assistants?.[id]?.isActive || false}
            onChange={() => handleToggle(id)}
            disabled={isLoading}
          />
          <span className={styles.slider}></span>
        </label>
        <div className={styles.automationTitle}>
          <span className={styles.automationIcon}>{icon}</span>
          {title}
        </div>
        <div className={styles.automationToggle} onClick={() => toggleSection(type)}>
          <span>Configurare</span>
          <button className={`${styles.expandButton} ${expandedSections[type] ? styles.expanded : ''}`}>
            ▼
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfigPanel = (id, title, icon, type) => {
    if (!expandedSections[type]) return null;
    
    return (
      <div className={styles.automationConfig}>
        <div className={styles.automationConfigHeader}>
          <div className={styles.automationConfigTitle}>
            <span className={styles.automationIcon}>{icon}</span>
            Configurare {title}
          </div>
          <button className={styles.closeConfigButton} onClick={() => toggleSection(type)}>
            ✕
          </button>
        </div>
        <div className={styles.apiKeyConfigs}>
          <div className={styles.apiKeyCard}>
            <div className={styles.apiKeyHeader}>
              <span className={styles.apiKeyTitle}>API Key</span>
              <button 
                className={styles.visibilityToggle}
                onClick={() => toggleApiKeyVisibility(type)}
              >
                {showApiKey[type] ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className={styles.apiKeyInput}>
              <input
                type={showApiKey[type] ? 'text' : 'password'}
                value={assistants?.[id]?.config?.apiKey || ''}
                onChange={(e) => handleApiKeyUpdate(id, e.target.value)}
                placeholder={`Introduceti API Key-ul ${title}`}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.automationSections}>
        <div className={styles.loading}>
          <p>Se încarcă asistenții...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.automationSections}>
        {renderAutomationSection('reservation', 'Booking.com', '📅', 'booking')}
        {renderAutomationSection('whatsapp', 'WhatsApp', '💬', 'whatsapp')}
        {renderAutomationSection('reporting', 'Raportare', '📊', 'reporting')}
      </div>
      {renderConfigPanel('reservation', 'Booking.com', '📅', 'booking')}
      {renderConfigPanel('whatsapp', 'WhatsApp', '💬', 'whatsapp')}
      {renderConfigPanel('reporting', 'Raportare', '📊', 'reporting')}
    </>
  );
};

export default AutomationSections; 