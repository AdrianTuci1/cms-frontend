import React from 'react';
import styles from './MembersTab.module.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { useDataSync } from '../../../../design-patterns/hooks';
import useDrawerStore, { DRAWER_TYPES } from '../../../00-Drawers/store/drawerStore';

const MembersTab = ({ businessType = 'hotel' }) => {
  // Use useDataSync hook for members data - same as StocksView
  const membersSync = useDataSync('members', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: membersData, loading: membersLoading, error: membersError, isOnline, lastUpdated } = membersSync;
  const { openDrawer } = useDrawerStore();

  // Extract the actual member items from the members data - same as StocksView
  const memberItems = membersData?.items || membersData || [];

  // Funcție pentru obținerea zilelor de lucru ca string - implementată direct în componentă
  const getDayPill = (day) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day];
  };

  const handleMemberClick = (member) => {
    // Edit existing member
    const memberData = {
      id: member.id,
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      workDays: member.workDays || [],
      photoUrl: member.photoUrl || ''
    };

    openDrawer('edit', DRAWER_TYPES.MEMBER, memberData, {
      title: 'Edit Staff Member',
      onSave: async (data, mode) => {
        console.log('Updating member:', data);
        
        try {
          // Use optimistic update from useDataSync
          await membersSync.update(data);
          console.log('Member updated successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to update member:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onDelete: async (data) => {
        console.log('Deleting member:', data);
        
        try {
          // Use optimistic update from useDataSync
          await membersSync.remove(data);
          console.log('Member deleted successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to delete member:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Member edit cancelled');
      }
    });
  };



  // Render loading state
  if (membersLoading) {
    return (
      <div className={styles.membersContainer}>
        <div className={styles.loadingContainer}>
          <h3>Loading staff members...</h3>
          <p>Fetching data from server...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (membersError) {
    return (
      <div className={styles.membersContainer}>
        <div className={styles.errorContainer}>
          <h3>Error loading staff members</h3>
          <p>{membersError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.membersContainer}>
      <div className={styles.statusInfo}>
        <span className={isOnline ? styles.online : styles.offline}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </span>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {memberItems.map(member => (
        <div 
          key={member.id} 
          className={styles.card}
          onClick={() => handleMemberClick(member)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.memberInfo}>
            <div className={styles.photoContainer}>
              <img src={member.photoUrl} alt={member.name} className={styles.photo} />
            </div>
            <div className={styles.details}>
              <h3 className={styles.name}>{member.name}</h3>
              <div className={styles.workDays}>
                {member.workDays.map((day) => (
                  <span key={day} className={styles.dayPill}>
                    {getDayPill(day)}
                  </span>
                ))}
              </div>
              <span className={styles.role}>{member.role}</span>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <span>{member.email}</span>
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.icon} />
                <span>{member.phone}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {memberItems.length === 0 && (
        <div className={styles.emptyState}>
          <p>No staff members found. Add a member using the button above.</p>
        </div>
      )}
    </div>
  );
};

export default MembersTab; 