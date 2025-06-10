import React from 'react';
import styles from './UserDrawer.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaEdit } from 'react-icons/fa';

const UserDrawer = () => {
  const { closeDrawer } = useDrawerStore();

  // Mock user data - in a real app, this would come from a store or API
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    avatar: null, // URL to avatar image if available
    notifications: 3,
    note: 'Remember to check the monthly reports and update the team schedule.'
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  const handleSettings = () => {
    // Implement settings navigation
    console.log('Settings clicked');
  };

  const handleNotifications = () => {
    // Implement notifications view
    console.log('Notifications clicked');
  };

  const handleEditNote = () => {
    // Implement note editing
    console.log('Edit note clicked');
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.drawerHeader}>
          <h2>User Profile</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            ×
          </button>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileRow}>
            <div className={styles.avatarContainer}>
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <FaUser size={32} />
                </div>
              )}
            </div>
            
            <div className={styles.userInfo}>
              <h3>{userData.name}</h3>
              <p className={styles.email}>{userData.email}</p>
              <p className={styles.role}>{userData.role}</p>
            </div>
          </div>

          <div className={styles.noteSection}>
            <div className={styles.noteHeader}>
              <h4>Note</h4>
              <button className={styles.editNoteButton} onClick={handleEditNote}>
                <FaEdit size={14} />
              </button>
            </div>
            <p className={styles.noteText}>{userData.note}</p>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button className={styles.actionButton} onClick={handleNotifications}>
            <FaBell className={styles.actionIcon} />
            <span>Notifications</span>
            {userData.notifications > 0 && (
              <span className={styles.notificationBadge}>{userData.notifications}</span>
            )}
          </button>
          
          <button className={styles.actionButton} onClick={handleSettings}>
            <FaCog className={styles.actionIcon} />
            <span>Settings</span>
          </button>
          
          <button className={`${styles.actionButton} ${styles.logoutButton}`} onClick={handleLogout}>
            <FaSignOutAlt className={styles.actionIcon} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDrawer; 