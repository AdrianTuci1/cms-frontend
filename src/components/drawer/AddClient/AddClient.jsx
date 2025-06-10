import React, { useState } from 'react';
import styles from './AddClient.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { FaTimes } from 'react-icons/fa';
import { getBusinessType, BUSINESS_TYPES } from '../../../config/businessTypes';

const AddClient = () => {
  const { closeDrawer } = useDrawerStore();
  const businessType = getBusinessType();
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement client creation logic
    console.log('Form submitted:', formData);
  };

  const renderClientForm = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return (
          <>
            <div className={styles.formSection}>
              <h3>Personal Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">
                  First Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">
                  Last Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  Phone Number<span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Medical Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="medicalHistory">Medical History</label>
                <textarea
                  id="medicalHistory"
                  value={formData.medicalHistory || ''}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  value={formData.allergies || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case BUSINESS_TYPES.GYM.name:
        return (
          <>
            <div className={styles.formSection}>
              <h3>Personal Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">
                  First Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">
                  Last Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  Phone Number<span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Fitness Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="fitnessGoals">Fitness Goals</label>
                <textarea
                  id="fitnessGoals"
                  value={formData.fitnessGoals || ''}
                  onChange={(e) => handleInputChange('fitnessGoals', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="medicalConditions">Medical Conditions</label>
                <textarea
                  id="medicalConditions"
                  value={formData.medicalConditions || ''}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case BUSINESS_TYPES.HOTEL.name:
        return (
          <>
            <div className={styles.formSection}>
              <h3>Personal Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">
                  First Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">
                  Last Name<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  Phone Number<span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Additional Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                  id="specialRequests"
                  value={formData.specialRequests || ''}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      default:
        return <div>Unsupported business type</div>;
    }
  };

  return (
    <div className={styles.clientContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.drawerHeader}>
          <h2>New Client</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.clientForm}>
          {renderClientForm()}
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={closeDrawer}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient; 