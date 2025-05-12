import React, { useState } from 'react';
import styles from './MembersTab.module.css';
import StaffMemberCard from './StaffMemberCard';

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

  const handleStatusChange = (memberId, newStatus) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
  };

  return (
    <div className={styles.section}>
      <div className={styles.membersList}>
        {members.map(member => (
          <StaffMemberCard key={member.id} member={member} />
        ))}
      </div>
      
      {members.length === 0 && (
        <div className={styles.emptyState}>
          <p>Nu există membri în staff. Adăugați un membru folosind butonul de mai sus.</p>
        </div>
      )}
    </div>
  );
};

export default MembersTab; 