import React, { useState } from 'react';
import styles from './AddAppointment.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { getBusinessType, BUSINESS_TYPES } from '../../../config/businessTypes';
import { FaSpinner } from 'react-icons/fa';

// Import different appointment forms based on business type
import DentalAppointmentForm from './forms/DentalAppointmentForm';
import GymAppointmentForm from './forms/GymAppointmentForm';
import HotelAppointmentForm from './forms/HotelAppointmentForm';

const AddAppointment = () => {
  const { closeDrawer } = useDrawerStore();
  const businessType = getBusinessType();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation - you can expand this based on your needs
    if (!formData.patientName && !formData.clientName && !formData.guestName) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement appointment creation logic
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - close drawer
      closeDrawer();
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Handle error - you could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderAppointmentForm = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return (
          <DentalAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case BUSINESS_TYPES.GYM.name:
        return (
          <GymAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case BUSINESS_TYPES.HOTEL.name:
        return (
          <HotelAppointmentForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      default:
        return <div>Unsupported business type</div>;
    }
  };

  return (
    <div className={styles.appointmentContainer}>
      <div className={styles.contentWrapper}>

        <form onSubmit={handleSubmit} className={styles.appointmentForm}>
          {renderAppointmentForm()}
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={closeDrawer}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="fa-spin" />
                  Creating...
                </>
              ) : (
                `Create ${businessType.name === BUSINESS_TYPES.HOTEL.name ? 'Booking' : 'Appointment'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment; 