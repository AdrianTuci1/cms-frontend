import React, { useState } from 'react';
import styles from './RolesTab.module.css';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import useRolesStore from '../../store/rolesStore';

const RolesTab = () => {
  const { roles, staffEmails, addEmail, removeEmail, viewProfile } = useRolesStore();
  const [newEmail, setNewEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (newEmail.trim() && selectedRole) {
      addEmail(selectedRole, newEmail.trim());
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (role, email) => {
    removeEmail(role, email);
  };

  const handleViewProfile = (email) => {
    viewProfile(email);
  };

  return (
    <div className={styles.rolesContainer}>
      {/* Add Email Form */}
      <div className={styles.addEmailForm}>
        <h3>Adaugă Email la Rol</h3>
        <form onSubmit={handleAddEmail}>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Selectează rolul</option>
            <option value="manager">Manager</option>
            <option value="receptioner">Receptioner</option>
            <option value="camerista">Cameristă</option>
          </select>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Introduceți email-ul"
            required
          />
          <button type="submit">
            <FaPlus /> Adaugă
          </button>
        </form>
      </div>

      {/* Roles Cards */}
      {roles.map((role) => (
        <div key={role.id} className={styles.card}>
          <div className={styles.roleInfo}>
            <div className={styles.details}>
              <h3 className={styles.name}>{role.name}</h3>
              <p className={styles.description}>{role.description}</p>
              <div className={styles.accountsCount}>
                <span className={styles.countPill}>
                  {role.accountsCount} {role.accountsCount === 1 ? 'cont' : 'conturi'}
                </span>
              </div>
            </div>
          </div>

          {/* Staff Emails Section */}
          <div className={styles.staffEmails}>
            <h4>Emailuri Staff:</h4>
            {staffEmails[role.name.toLowerCase()]?.map((email, index) => (
              <div key={index} className={styles.emailItem}>
                <span className={styles.email}>{email}</span>
                <div className={styles.emailActions}>
                  <button 
                    onClick={() => handleViewProfile(email)}
                    className={styles.viewButton}
                    title="Vizualizează profil"
                  >
                    <FaEye />
                  </button>
                  <button 
                    onClick={() => handleRemoveEmail(role.name.toLowerCase(), email)}
                    className={styles.removeButton}
                    title="Elimină email"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {(!staffEmails[role.name.toLowerCase()] || staffEmails[role.name.toLowerCase()].length === 0) && (
              <p className={styles.noEmails}>Nu există emailuri asociate acestui rol</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RolesTab; 