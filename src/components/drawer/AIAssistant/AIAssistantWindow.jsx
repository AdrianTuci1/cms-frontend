import React from 'react';
import styles from './AIAssistantWindow.module.css';
import AIAssistantChat from './AIAssistantChat';

const AIAssistantWindow = () => {
  return (
    <div className={styles.container}>
      <AIAssistantChat />
    </div>
  );
};

export default AIAssistantWindow; 