import React, { useState } from 'react';
import { FaUser, FaBell, FaStickyNote, FaSignOutAlt, FaEdit, FaCog, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaSync, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaKey } from 'react-icons/fa';
import { useDataSync } from '../../../design-patterns/hooks/useDataSync';
import styles from './UserDrawer.module.css';

const UserDrawer = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Use useDataSync hook for userData
  const {
    data: userData,
    loading: userDataLoading,
    error: userDataError,
    update: updateUserData,
    refresh: refreshUserData,
    lastUpdated,
    isOnline
  } = useDataSync('userData', {
    enableValidation: true,
    enableBusinessLogic: true
  });

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    // You can add actual logout logic here
    onClose();
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await updateUserData({
        ...userData,
        ...updatedProfile
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  // Helper function to get profile data
  const getProfileData = () => {
    if (!userData) return null;
    
    // Combine basic user data with profile data
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      businessType: userData.businessType,
      roles: userData.roles || [],
      permissions: userData.permissions || [],
      phone: userData.profile?.phone || 'N/A',
      avatar: userData.profile?.avatar || null,
      location: userData.profile?.location || 'N/A',
      department: userData.profile?.department || 'N/A',
      lastLogin: userData.profile?.lastLogin || 'N/A',
      preferences: userData.profile?.preferences || {}
    };
  };

  const profileData = getProfileData();

  const renderProfile = () => (
    <div className={styles.profileSection}>
      {userDataLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      ) : userDataError ? (
        <div className={styles.errorState}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <p>Error loading profile: {userDataError.message}</p>
          <button onClick={refreshUserData} className={styles.retryBtn}>
            <FaSync />
            Retry
          </button>
        </div>
      ) : !userData ? (
        <div className={styles.emptyState}>
          <FaUser />
          <p>No user data available</p>
        </div>
      ) : (
        <>
          {/* Data sync status indicator */}
          <div className={styles.syncStatus}>
            <div className={styles.syncInfo}>
              {isOnline ? (
                <FaCheckCircle className={styles.onlineIcon} />
              ) : (
                <FaExclamationTriangle className={styles.offlineIcon} />
              )}
              <span className={styles.syncText}>
                {isOnline ? 'Online' : 'Offline'} • Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </div>
            <button 
              onClick={refreshUserData} 
              className={styles.refreshBtn}
              disabled={userDataLoading}
            >
              <FaSync className={userDataLoading ? styles.spinning : ''} />
            </button>
          </div>

          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <FaUser />
                </div>
              )}
              <button className={styles.editAvatarBtn}>
                <FaEdit />
              </button>
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.userName}>{profileData.name}</h3>
              <p className={styles.userRole}>{profileData.roles.join(', ')}</p>
              <p className={styles.userDepartment}>{profileData.department}</p>
              <p className={styles.businessType}>{profileData.businessType}</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <FaEnvelope className={styles.detailIcon} />
              <div>
                <label>Email</label>
                <span>{profileData.email}</span>
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <FaPhone className={styles.detailIcon} />
              <div>
                <label>Phone</label>
                <span>{profileData.phone}</span>
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <FaMapMarkerAlt className={styles.detailIcon} />
              <div>
                <label>Location</label>
                <span>{profileData.location}</span>
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <FaClock className={styles.detailIcon} />
              <div>
                <label>Last Login</label>
                <span>{profileData.lastLogin}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <FaShieldAlt className={styles.detailIcon} />
              <div>
                <label>Permissions</label>
                <span>{profileData.permissions.length} permissions</span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            <button 
              className={styles.actionBtn}
              onClick={() => handleProfileUpdate({ /* updated fields */ })}
            >
              <FaEdit />
              Edit Profile
            </button>
            <button className={styles.actionBtn}>
              <FaCog />
              Settings
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className={styles.notificationsSection}>
      <div className={styles.sectionHeader}>
        <h3>Notifications</h3>
      </div>
      
      <div className={styles.notificationsList}>
        <div className={styles.emptyState}>
          <FaBell />
          <p>No notifications available</p>
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className={styles.notesSection}>
      <div className={styles.sectionHeader}>
        <h3>Notes</h3>
        <button className={styles.addNoteBtn}>
          <FaEdit />
          Add Note
        </button>
      </div>
      
      <div className={styles.notesList}>
        <div className={styles.emptyState}>
          <FaStickyNote />
          <p>No notes available</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.userDrawer}>
      <div className={styles.drawerHeader}>
        <h2>User Profile</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser />
          Profile
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.active : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell />
          Notifications
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.active : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FaStickyNote />
          Notes
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'notes' && renderNotes()}
      </div>

      <div className={styles.drawerFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDrawer; 