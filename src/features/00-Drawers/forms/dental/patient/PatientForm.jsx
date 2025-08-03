import React, { useState, useEffect } from 'react';
import { getBusinessTypeKey } from '../../../../../config/businessTypes';
import styles from '../../../styles/FormStyles.module.css';

// Import actions
import { 
  getPatientFields, 
  validatePatientForm, 
  handlePatientSubmit, 
  handlePatientDelete 
} from './actions/patientActions';

// Import views
import ViewToggle from './views/ViewToggle';
import AppointmentHistoryView from './views/AppointmentHistoryView';
import DentalNotesView from './views/DentalNotesView';

// Import form components
import PatientDetailsForm from './form/PatientDetailsForm';

const PatientForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessTypeKey = getBusinessTypeKey();
  const [activeView, setActiveView] = useState('details');
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Only show for dental clinics
  if (businessTypeKey !== 'DENTAL') {
    return null;
  }

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePatientForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await handlePatientSubmit(formData, mode, onSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSubmitting(true);
    try {
      await handlePatientDelete(formData, onDelete);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormContent = () => {
    switch (activeView) {
      case 'details':
        return (
          <PatientDetailsForm
            fields={getPatientFields()}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            mode={mode}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        );
      case 'notes':
        return <DentalNotesView />;
      case 'history':
        return <AppointmentHistoryView />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <ViewToggle 
        activeView={activeView} 
        setActiveView={setActiveView} 
        mode={mode} 
      />
      {renderFormContent()}
    </div>
  );
};

export default PatientForm;