import React, { useEffect, useRef } from 'react';
import styles from '../styles/AIAssistantChat.module.css';
import useAIAssistantStore from '../../../../store/aiAssistantStore';
import Chat from './Chat';
import ChatInput from './ChatInput';
import useDrawerStore from '../../../../store/drawerStore';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { AIAssistantService } from '../../../../services/aiAssistant';
import { useClickOutside } from '../hooks/useClickOutside';

const AIAssistantChat = () => {
  const { 
    messages,
    isLoading,
    clearMessages,
    addMessage
  } = useAIAssistantStore();

  const { closeDrawer } = useDrawerStore();
  const chatRef = useRef(null);

  // Debug logging
  console.log('AIAssistantChat render:', { messages, isLoading, messagesLength: messages.length });

  // Initialize AI Assistant service
  useEffect(() => {
    console.log('AIAssistantChat - initializing service');
    AIAssistantService.init();
    
    // Add message handler
    AIAssistantService.addMessageHandler(addMessage);
    
    return () => {
      AIAssistantService.removeMessageHandler(addMessage);
    };
  }, [addMessage]);

  // Handle click outside to close
  useClickOutside(chatRef, () => {
    closeDrawer();
  });

  const handleNewChat = async () => {
    await clearMessages();
  };

  const handleChatHistory = () => {
    // History is now handled through API
    console.log('Chat history is maintained through API');
  };

  const handleSendMessage = async (content) => {
    try {
      console.log('Sending message:', content);
      await AIAssistantService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const isChatEmpty = messages.length === 0 && !isLoading;

  return (
    <div className={styles.chatContainer} ref={chatRef}>
      <button className={styles.aiCloseButton} onClick={closeDrawer}>
        ×
      </button>
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
        </div>
        <div className={styles.chatSection}>
          {isChatEmpty ? (
            <ChatInput onSendMessage={handleSendMessage} />
          ) : (
            <>
              <Chat />
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantChat; 