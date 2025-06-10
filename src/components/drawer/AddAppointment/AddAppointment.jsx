import React, { useState } from 'react';
import styles from './AddAppointment.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { getBusinessType, BUSINESS_TYPES } from '../../../config/businessTypes';
import { FaTimes } from 'react-icons/fa';

// Import different appointment forms based on business type
import DentalAppointmentForm from './forms/DentalAppointmentForm';
import GymAppointmentForm from './forms/GymAppointmentForm';
import HotelAppointmentForm from './forms/HotelAppointmentForm';

const AddAppointment = () => {
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
    // TODO: Implement appointment creation logic
    console.log('Form submitted:', formData);
  };

  const getFormTitle = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return 'New Dental Appointment';
      case BUSINESS_TYPES.GYM.name:
        return 'New Training Session';
      case BUSINESS_TYPES.HOTEL.name:
        return 'New Hotel Booking';
      default:
        return 'New Appointment';
    }
  };

  const renderAppointmentForm = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return (
          <DentalAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case BUSINESS_TYPES.GYM.name:
        return (
          <GymAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case BUSINESS_TYPES.HOTEL.name:
        return (
          <HotelAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return <div>Unsupported business type</div>;
    }
  };

  return (
    <div className={styles.appointmentContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.drawerHeader}>
          <h2>{getFormTitle()}</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.appointmentForm}>
          {renderAppointmentForm()}
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={closeDrawer}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create {businessType.name === BUSINESS_TYPES.HOTEL.name ? 'Booking' : 'Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment; 