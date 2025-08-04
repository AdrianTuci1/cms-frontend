import React from 'react';
import styles from './General.module.css';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaTag } from 'react-icons/fa';

const General = ({ patientData }) => {
  if (!patientData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Patient Details</h3>
        </div>
        <div className={styles.noData}>
          <p>No patient data available</p>
        </div>
      </div>
    );
  }

  const formatAge = (birthYear) => {
    if (!birthYear) return 'N/A';
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Patient Details</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.field}>
            <label>Full Name</label>
            <div className={styles.value}>
              <FaUser className={styles.fieldIcon} />
              {patientData.fullName || 'N/A'}
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Age</label>
            <div className={styles.value}>
              <FaCalendarAlt className={styles.fieldIcon} />
              {formatAge(patientData.birthYear)} years old
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Gender</label>
            <div className={styles.value}>
              {patientData.gender ? patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1) : 'N/A'}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.field}>
            <label>Phone</label>
            <div className={styles.value}>
              <FaPhone className={styles.fieldIcon} />
              {patientData.phone || 'N/A'}
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Email</label>
            <div className={styles.value}>
              <FaEnvelope className={styles.fieldIcon} />
              {patientData.email || 'N/A'}
            </div>
          </div>
        </div>

        {patientData.address && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label>Address</label>
              <div className={styles.value}>
                <FaMapMarkerAlt className={styles.fieldIcon} />
                {patientData.address}
              </div>
            </div>
          </div>
        )}

        {patientData.tags && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label>Tags</label>
              <div className={styles.tags}>
                {patientData.tags.split(',').map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {patientData.notes && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label>Notes</label>
              <div className={styles.notes}>{patientData.notes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default General; 