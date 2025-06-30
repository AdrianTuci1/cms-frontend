import React from 'react';
import styles from './MembersTab.module.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import useMembersStore from '../../store/membersStore';

const MembersTab = () => {
  const { members, getDayPill } = useMembersStore();

  return (
    <div className={styles.membersContainer}>
      {members.map(member => (
        <div key={member.id} className={styles.card}>
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
      
      {members.length === 0 && (
        <div className={styles.emptyState}>
          <p>No staff members found. Add a member using the button above.</p>
        </div>
      )}
    </div>
  );
};

export default MembersTab; 