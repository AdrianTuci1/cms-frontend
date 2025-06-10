import React, { useState } from 'react';
import styles from './AddMember.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { FaTimes } from 'react-icons/fa';

const AddMember = () => {
  const { closeDrawer } = useDrawerStore();
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement member creation logic
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.memberContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.drawerHeader}>
          <h2>New Team Member</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.memberForm}>
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
            <h3>Role Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="role">
                Role<span className={styles.required}>*</span>
              </label>
              <select
                id="role"
                value={formData.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={closeDrawer}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember; 