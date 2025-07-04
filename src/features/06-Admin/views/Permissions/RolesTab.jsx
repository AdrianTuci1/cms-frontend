import React from 'react';
import styles from './RolesTab.module.css';
import useRolesStore from '../../store/rolesStore';

const RolesTab = ({ onEditRole }) => {
  const { roles } = useRolesStore();

  const handleEditRole = (role) => {
    if (onEditRole) {
      onEditRole(role);
    }
  };

  return (
    <div className={styles.rolesContainer}>
      {/* Roles Cards */}
      {roles.map((role) => (
        <div 
          key={role.id} 
          className={styles.card}
          onClick={() => handleEditRole(role)}
        >
          {/* Role Header */}
          <div className={styles.roleHeader}>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default RolesTab; 