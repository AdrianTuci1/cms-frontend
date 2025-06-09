import React from 'react';
import styles from './AIAssistantChat.module.css';
import useAIAssistantStore from '../../../store/aiAssistantStore';
import Chat from './Chat';
import ChatInput from './ChatInput';
import useDrawerStore from '../../../store/drawerStore';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { AIAssistantService } from '../../../services/aiAssistant';

const AIAssistantChat = () => {
  const { 
    messages,
    isLoading,
    clearMessages
  } = useAIAssistantStore();

  const { closeDrawer } = useDrawerStore();

  const handleNewChat = async () => {
    await clearMessages();
  };

  const handleChatHistory = () => {
    // History is now handled through API
    console.log('Chat history is maintained through API');
  };

  const handleSendMessage = async (content) => {
    try {
      await AIAssistantService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.contentWrapper}>
      <div className={styles.drawerHeader}>
        <div className={styles.headerButtons}>
          <button className={styles.newChatButton} onClick={handleNewChat}>
            <IoAddCircleOutline size={16} />
            New Chat
          </button>
          <button className={styles.historyButton} onClick={handleChatHistory}>
            <BsClockHistory size={16} />
            History
          </button>
        </div>
        <button className={styles.closeButton} onClick={closeDrawer}>
          ×
        </button>
      </div>

        <div className={styles.chatSection}>
          <Chat />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantChat; 