import React, { useState } from 'react';
import styles from './AddService.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { getBusinessType, BUSINESS_TYPES } from '../../../config/businessTypes';
import { FaSpinner } from 'react-icons/fa';
import TreatmentForm from './forms/TreatmentForm';
import PackageForm from './forms/PackageForm';
import RoomForm from './forms/RoomForm';

const SERVICE_TYPES = {
  TREATMENT: 'treatment',
  PACKAGE: 'package',
  ROOM: 'room'
};

const AddService = () => {
  const { closeDrawer } = useDrawerStore();
  const businessType = getBusinessType();
  const [serviceType, setServiceType] = useState(() => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return SERVICE_TYPES.TREATMENT;
      case BUSINESS_TYPES.GYM.name:
        return SERVICE_TYPES.PACKAGE;
      case BUSINESS_TYPES.HOTEL.name:
        return SERVICE_TYPES.ROOM;
      default:
        return SERVICE_TYPES.TREATMENT;
    }
  });
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
    if (!formData.name && !formData.serviceName && !formData.roomName) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.price && formData.price !== 0) {
      newErrors.price = 'Price is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
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
      // TODO: Implement service creation logic
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - close drawer
      closeDrawer();
    } catch (error) {
      console.error('Error creating service:', error);
      // Handle error - you could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderServiceForm = () => {
    switch (serviceType) {
      case SERVICE_TYPES.TREATMENT:
        return (
          <TreatmentForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case SERVICE_TYPES.PACKAGE:
        return (
          <PackageForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case SERVICE_TYPES.ROOM:
        return (
          <RoomForm 
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      default:
        return <div>Unsupported service type</div>;
    }
  };

  return (
    <div className={styles.serviceContainer}>
      <div className={styles.contentWrapper}>

        <form onSubmit={handleSubmit} className={styles.serviceForm}>
          {renderServiceForm()}
          
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
                `Create ${serviceType === SERVICE_TYPES.TREATMENT ? 'Treatment' : 
                         serviceType === SERVICE_TYPES.PACKAGE ? 'Package' : 'Room'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService; 