import React, { useState } from 'react';
import styles from './MembersTab.module.css';

const MembersTab = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  ]);

  const handleStatusChange = (memberId, newStatus) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
  };

  return (
    <div className={styles.section}>
      <h2>Gestionare Membri</h2>
      <div className={styles.membersList}>
        {members.map(member => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.memberHeader}>
              <h3>{member.name}</h3>
              <div className={styles.memberActions}>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
              </div>
            </div>
            <div className={styles.memberDetails}>
              <p>Email: {member.email}</p>
              <p>Rol: {member.role}</p>
              <p>Status: 
                <select 
                  value={member.status}
                  onChange={(e) => handleStatusChange(member.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="active">Activ</option>
                  <option value="inactive">Inactiv</option>
                  <option value="pending">În așteptare</option>
                </select>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>Adaugă Membru Nou</button>
    </div>
  );
};

export default MembersTab; 