import React, { useState } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaBell, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import styles from './AIAssistantChat.module.css';

const Notifications = ({ notifications, dismissedNotifications, handleNotificationAction, isLoading, onNewChat }) => {
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);

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

  const activeNotifications = notifications.filter(
    notification => !dismissedNotifications.includes(notification.id)
  );

  return (
    <div className={styles.notificationsContainer}>

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
    </div>
  );
};

export default Notifications; 