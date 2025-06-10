import React, { useState } from 'react';
import styles from './AddService.module.css';
import useDrawerStore from '../../../store/drawerStore';
import { FaTimes } from 'react-icons/fa';
import TreatmentForm from './forms/TreatmentForm';
import PackageForm from './forms/PackageForm';
import RoomForm from './forms/RoomForm';
import { getBusinessType, BUSINESS_TYPES } from '../../../config/businessTypes';

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement service creation logic
    console.log('Form submitted:', formData);
  };

  const getFormTitle = () => {
    switch (serviceType) {
      case SERVICE_TYPES.TREATMENT:
        return 'New Treatment';
      case SERVICE_TYPES.PACKAGE:
        return 'New Package';
      case SERVICE_TYPES.ROOM:
        return 'New Room';
      default:
        return 'New Service';
    }
  };

  const renderServiceForm = () => {
    switch (serviceType) {
      case SERVICE_TYPES.TREATMENT:
        return (
          <TreatmentForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case SERVICE_TYPES.PACKAGE:
        return (
          <PackageForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case SERVICE_TYPES.ROOM:
        return (
          <RoomForm 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return <div>Unsupported service type</div>;
    }
  };

  return (
    <div className={styles.serviceContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.drawerHeader}>
          <h2>{getFormTitle()}</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.serviceForm}>
          {renderServiceForm()}
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={closeDrawer}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create {serviceType === SERVICE_TYPES.TREATMENT ? 'Treatment' : 
                     serviceType === SERVICE_TYPES.PACKAGE ? 'Package' : 'Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService; 