import React, { useState } from 'react';
import styles from './AIAssistantChat.module.css';
import useAIAssistantStore from '../../../store/aiAssistantStore';
import Notifications from './Notifications';
import Chat from './Chat';
import ChatInput from './ChatInput';
import useDrawerStore from '../../../store/drawerStore';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';

const AIAssistantChat = () => {
  const [message, setMessage] = useState('');
  const { 
    messages,
    sendMessage,
    editMessage,
    isLoading,
    notifications,
    dismissedNotifications,
    handleNotificationAction,
    clearMessages,
    replyToMessage
  } = useAIAssistantStore();

  const { closeDrawer } = useDrawerStore();

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const handleNewChat = async () => {
    await clearMessages();
    setMessage('');
  };

  const handleChatHistory = () => {
    // History is now handled through API
    console.log('Chat history is maintained through API');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={styles.chatContainer}>
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

      <div className={styles.notificationsSection}>
        <Notifications 
          notifications={notifications}
          dismissedNotifications={dismissedNotifications}
          handleNotificationAction={handleNotificationAction}
          isLoading={isLoading}
        />
      </div>

      <div className={`${styles.chatSection} ${hasMessages ? styles.hasMessages : ''}`}>
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          isLoading={isLoading}
        />
        <Chat 
          messages={messages}
          isLoading={isLoading}
          replyToMessage={replyToMessage}
          editMessage={editMessage}
        />
      </div>
    </div>
  );
};

export default AIAssistantChat; 