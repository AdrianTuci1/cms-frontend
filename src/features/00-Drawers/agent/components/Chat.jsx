import React, { useRef } from 'react';
import { FaArrowUp, FaReply, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from '../styles/AIAssistantChat.module.css';
import useAIAssistantStore from '../../../../store/aiAssistantStore';
import { AIAssistantService } from '../../../../services/aiAssistant';
import { Message } from './Message';
import { useAutoScroll } from '../hooks/useAutoScroll';

const Chat = () => {
  const { messages, isLoading } = useAIAssistantStore();
  const messagesContainerRef = useRef(null);
  const bottomRef = useAutoScroll(messages);

  // Debug logging
  console.log('Chat component render:', { messages, isLoading, messagesLength: messages.length });

  const handleReply = async (messageId, content) => {
    try {
      await AIAssistantService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const handleEdit = async (messageId, newContent) => {
    try {
      await AIAssistantService.editMessage(messageId, newContent);
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  // Show loading state only when loading and no messages
  const showLoading = isLoading && messages.length === 0;

  return (
    <div className={styles.messagesWrapper}>
      <div 
        className={styles.messagesContainer}
        ref={messagesContainerRef}
      >
        {showLoading && (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.loadingSpinner} />
            Loading messages...
          </div>
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className={styles.welcomeMessage}>
            <h2>Welcome to AI Assistant</h2>
            <p>I'm here to help you manage your business. Ask me anything about reservations, customers, or any other tasks you need assistance with.</p>
            <div className={styles.suggestions}>
              <p>Try asking me to:</p>
              <ul>
                <li>Create a new reservation</li>
                <li>Search for customer information</li>
                <li>Help with scheduling</li>
                <li>Generate reports</li>
              </ul>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onReply={handleReply}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        ))}
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Chat; 