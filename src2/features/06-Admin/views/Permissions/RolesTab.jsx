import React from 'react';
import styles from './RolesTab.module.css';

const RolesTab = () => {
  const roles = [
    {
      id: 1,
      name: 'Administrator',
      description: 'Acces complet la toate funcționalitățile sistemului',
      accountsCount: 2
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Gestionare operațională și raportare',
      accountsCount: 3
    },
    {
      id: 3,
      name: 'Receptioner',
      description: 'Gestionare rezervări și relație cu clienții',
      accountsCount: 5
    },
    {
      id: 4,
      name: 'Cameristă',
      description: 'Gestionare camere și curățenie',
      accountsCount: 8
    }
  ];

  return (
    <div className={styles.rolesContainer}>
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
        </div>
      ))}
    </div>
  );
};

export default RolesTab; 