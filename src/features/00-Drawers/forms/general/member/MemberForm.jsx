import React, { useState, useEffect } from 'react';
import { getBusinessTypeKey } from '../../../../../config/businessTypes';
import styles from '../../../styles/FormStyles.module.css';
import useRolesStore from '../../../06-Admin/store/rolesStore';

// Import actions
import { 
  getMemberFields, 
  validateMemberForm, 
  handleMemberSubmit, 
  handleMemberDelete 
} from './actions/memberActions';

// Import views
import MemberViewToggle from './views/MemberViewToggle';
import UpcomingAppointmentsView from './views/UpcomingAppointmentsView';

// Import form components
import MemberDetailsForm from './form/MemberDetailsForm';

const MemberForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessTypeKey = getBusinessTypeKey();
  const [activeView, setActiveView] = useState('details');
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use useRolesStore to get actual roles data
  const { roles } = useRolesStore();
  
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
    
    const validationErrors = validateMemberForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await handleMemberSubmit(formData, mode, onSubmit);
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
      await handleMemberDelete(formData, onDelete);
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
          <MemberDetailsForm
            fields={getMemberFields(roles || [])}
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
      case 'appointments':
        return <UpcomingAppointmentsView />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <MemberViewToggle 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      {renderFormContent()}
    </div>
  );
};

export default MemberForm;