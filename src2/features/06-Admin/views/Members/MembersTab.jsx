import React, { useState } from 'react';
import styles from './MembersTab.module.css';
import { FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const MembersTab = () => {
  const [members, setMembers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '0712 345 678',
      role: 'Manager', 
      workDays: [0, 1, 2, 3, 4], // Monday to Friday
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '0723 456 789',
      role: 'Receptioner', 
      workDays: [1, 3, 5, 6], // Tuesday, Thursday, Saturday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      phone: '0734 567 890',
      role: 'Camerista', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
  ]);

  const getDayPill = (day) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day];
  };

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