import React, { useState } from 'react';
import styles from './GymSubscriptionsTab.module.css';

const GymSubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: 'Abonament Standard',
      price: '200 RON',
      duration: '1 lună',
      features: ['Acces la sală', 'Antrenor personal', 'Program de fitness'],
      active: true
    },
    {
      id: 2,
      name: 'Abonament Premium',
      price: '400 RON',
      duration: '1 lună',
      features: ['Acces la sală', 'Antrenor personal', 'Program de fitness', 'Acces la piscină', 'Saună'],
      active: true
    }
  ]);

  const handleStatusChange = (subscriptionId) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, active: !sub.active } : sub
    ));
  };

  return (
    <div className={styles.section}>
      <h2>Gestionare Abonamente</h2>
      <div className={styles.subscriptionsList}>
        {subscriptions.map(subscription => (
          <div key={subscription.id} className={styles.subscriptionCard}>
            <div className={styles.subscriptionHeader}>
              <h3>{subscription.name}</h3>
              <div className={styles.subscriptionActions}>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
              </div>
            </div>
            <div className={styles.subscriptionDetails}>
              <p>Preț: {subscription.price}</p>
              <p>Durată: {subscription.duration}</p>
              <div className={styles.features}>
                <h4>Facilități incluse:</h4>
                <ul>
                  {subscription.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.statusToggle}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={subscription.active}
                    onChange={() => handleStatusChange(subscription.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
                <span>{subscription.active ? 'Activ' : 'Inactiv'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>Adaugă Abonament Nou</button>
    </div>
  );
};

export default GymSubscriptionsTab; 