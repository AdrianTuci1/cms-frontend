import React from 'react';
import styles from '../styles/RecentActivities.module.css';

const RecentActivities = () => {
  // Mock data for automation events
  const automationEvents = [
    {
      id: 1,
      type: 'booking',
      title: 'Rezervare preluata de pe WhatsApp',
      description: 'Clientul a trimis o cerere de rezervare prin WhatsApp',
      timestamp: '2024-03-20 14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Rezervare preluata de pe Booking.com',
      description: 'Noua rezervare pentru camera 101',
      timestamp: '2024-03-20 14:25',
      status: 'completed'
    },
    {
      id: 3,
      type: 'whatsapp',
      title: 'Cerere de confirmare trimisa',
      description: 'Am trimis o cerere de confirmare pentru rezervarea #1234',
      timestamp: '2024-03-20 14:20',
      status: 'pending'
    },
    {
      id: 4,
      type: 'reporting',
      title: 'Ajustare preturi automate',
      description: 'Preturile au fost ajustate in functie de gradul de ocupare',
      timestamp: '2024-03-20 14:15',
      status: 'completed'
    }
  ];

  return (
    <div className={styles.eventsList}>
      <h2>Activitati Recente</h2>
      {automationEvents.map(event => (
        <div key={event.id} className={styles.eventCard}>
          <div className={styles.eventHeader}>
            <div className={styles.eventInfo}>
              <span className={`${styles.eventIcon} ${styles[event.type]}`}>
                {event.type === 'booking' ? '📅' : event.type === 'whatsapp' ? '💬' : '📊'}
              </span>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
            <div className={styles.eventMeta}>
              <span className={styles.timestamp}>{event.timestamp}</span>
              <span className={`${styles.statusBadge} ${styles[event.status]}`}>
                {event.status === 'completed' ? 'Finalizat' : 'In asteptare'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities; 