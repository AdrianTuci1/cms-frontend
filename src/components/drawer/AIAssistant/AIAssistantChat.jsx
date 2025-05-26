import React, { useState, useRef, useEffect } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaBell, FaChevronDown, FaChevronUp, FaArrowUp, FaReply } from 'react-icons/fa';
import styles from './AIAssistantChat.module.css';
import useAIAssistantStore from '../../../store/aiAssistantStore';
import assistantData from '../../../data/conversations.json';

const AIAssistantChat = () => {
  const [message, setMessage] = useState('');
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const chatContentRef = useRef(null);
  const { 
    messages,
    sendMessage,
    isLoading,
    notifications,
    dismissedNotifications,
    handleNotificationAction,
    handleQuickAction
  } = useAIAssistantStore();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className={styles.warningIcon} />;
      case 'error':
        return <FaExclamationTriangle className={styles.errorIcon} />;
      default:
        return <FaInfoCircle className={styles.infoIcon} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const activeNotifications = notifications.filter(
    notification => !dismissedNotifications.includes(notification.id)
  );

  return (
    <div className={styles.chatContainer}>

      {/* Notifications Bar */}
      {activeNotifications.length > 0 && (
        <div className={`${styles.notificationsBar} ${isNotificationsExpanded ? styles.expanded : ''}`}>
          <div className={styles.notificationsHeader}>
            <div className={styles.notificationsCount}>
              <FaBell />
              <span>{activeNotifications.length} Notifications</span>
            </div>
            <button 
              className={styles.expandButton}
              onClick={() => setIsNotificationsExpanded(!isNotificationsExpanded)}
            >
              {isNotificationsExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          
          {isNotificationsExpanded && (
            <div className={styles.notificationsList}>
              {activeNotifications.map(notification => (
                <div key={notification.id} className={`${styles.notification} ${styles[notification.type]}`}>
                  <div className={styles.notificationHeader}>
                    {getNotificationIcon(notification.type)}
                    <h3>{notification.title}</h3>
                  </div>
                  <p>{notification.description}</p>
                  <div className={styles.notificationActions}>
                    {notification.actions.map(action => (
                      <button
                        key={action.id}
                        className={styles.actionButton}
                        onClick={() => handleNotificationAction(notification.id, action.id)}
                        disabled={isLoading}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.chatContent} ref={chatContentRef}>
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className={styles.welcomeMessage}>
            <h2>Welcome to AI Assistant</h2>
            <p>{assistantData.assistant.description}</p>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h3>Quick Actions</h3>
              <div className={styles.quickActionsGrid}>
                {assistantData.assistant.quickActions.map(action => (
                  <button
                    key={action.id}
                    className={styles.quickActionButton}
                    onClick={() => handleQuickAction(action.id)}
                    disabled={isLoading}
                  >
                    <div className={styles.quickActionIcon}>
                      <FaBell />
                    </div>
                    <div className={styles.quickActionContent}>
                      <h4>{action.title}</h4>
                      <p>{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`${styles.message} ${msg.isAI ? styles.aiMessage : styles.userMessage}`}
          >
            <div className={styles.messageContent}>
              <div className={styles.messageHeader}>
                <span className={styles.agentName}>
                  {msg.isAI ? assistantData.assistant.name : 'You'}
                </span>
                <span className={styles.messageTime}>
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <div className={styles.messageText}>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area - always visible */}
      <div className={styles.inputArea}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.messageInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          className={styles.sendButton}
          disabled={!message.trim() || isLoading}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantChat; 