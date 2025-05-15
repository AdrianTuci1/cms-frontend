import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styles from './DentalInfoCard.module.css';

const DentalInfoCard = ({ data }) => {
  const { 
    medicPhoto, 
    medicName, 
    medicSpecialization, 
    appointmentDate, 
    appointmentTime,
    treatmentType
  } = data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format date as "DD MMM YYYY" in Romanian
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('ro-RO', options);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.doctorInfo}>
          <div className={styles.doctorAvatar}>
            {medicPhoto ? (
              <img src={medicPhoto} alt={medicName} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}></div>
            )}
          </div>
          <div className={styles.doctorDetails}>
            <h2 className={styles.doctorName}>Dr. {medicName}</h2>
            <p className={styles.doctorSpecialization}>{medicSpecialization}</p>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.appointmentTime}>
              {appointmentTime}
            </div>
          </div>
        </div>
        
        <div className={styles.appointmentInfo}>
          <h3 className={styles.appointmentTitle}>{treatmentType}</h3>
          <div className={styles.dateDetailsRow}>
            <p className={styles.appointmentDate}>
              {formatDate(appointmentDate)}
            </p>
            <div className={styles.detailsLink}>
              Detalii <IoChevronForward className={styles.arrowIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalInfoCard; 