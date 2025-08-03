import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaSave, FaUser, FaTimes } from 'react-icons/fa';
import useDrawerStore, { DRAWER_TYPES } from '../../../../store/drawerStore';
import styles from '../../../../styles/FormStyles.module.css';
import { 
  getAppointmentFields, 
  validateAppointmentForm 
} from '../actions/appointmentActions';

const AppointmentForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { 
    updateCurrentData, 
    queryField,
    getQueryResults,
    clearFieldResults,
    openDrawer
  } = useDrawerStore();
  
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryingFields, setQueryingFields] = useState(new Set());
  const [showQueryResults, setShowQueryResults] = useState({});

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  // Debounced query function
  const debouncedQuery = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedQueryField = debouncedQuery(async (fieldName, value) => {
    if (!value || value.length < 2) {
      clearFieldResults(fieldName);
      setShowQueryResults(prev => ({ ...prev, [fieldName]: false }));
      return;
    }

    setQueryingFields(prev => new Set(prev).add(fieldName));
    try {
      await queryField(fieldName, value);
      setShowQueryResults(prev => ({ ...prev, [fieldName]: true }));
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setQueryingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  }, 500);

  const handleInputChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(newFormData);
    
    // Update store for auto-save (only for edit mode)
    if (mode === 'edit') {
      updateCurrentData(newFormData);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Handle database querying for specific fields
    const queryFields = ['phone', 'email'];
    if (queryFields.includes(field)) {
      debouncedQueryField(field, value);
    }
  };

  const handleQueryResultClick = (field, result) => {
    // Auto-fill form with query result
    const newFormData = {
      ...formData,
      clientName: result.name || formData.clientName,
      phone: result.phone || formData.phone,
      email: result.email || formData.email
    };
    
    setFormData(newFormData);
    
    // Update store for auto-save (only for edit mode)
    if (mode === 'edit') {
      updateCurrentData(newFormData);
    }
    
    // Hide query results
    setShowQueryResults(prev => ({ ...prev, [field]: false }));
    clearFieldResults(field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateAppointmentForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData, mode);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const getInputClassName = (fieldName) => {
    const baseClass = styles.formInput;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const renderField = (field) => {
    const { name, type, label, placeholder, required } = field;
    const isRequired = required;
    const error = getFieldError(name);
    const isQuerying = queryingFields.has(name);
    const showQuery = showQueryResults[name];
    const queryResults = getQueryResults(name);

    // Special handling for clientName field with "Add patient" button
    if (name === 'clientName') {
      return (
        <div className={styles.formGroup} key={name}>
          <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
            {label || name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
          
          <div className={styles.inputWithButtonContainer}>
            <input
              type={type}
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label || name}`}
              disabled={mode === 'view' || isLoading}
            />
            
            <button
              type="button"
              className={styles.addPatientButton}
              onClick={() => {
                const drawerId = openDrawer('create', DRAWER_TYPES.PATIENT, {}, {
                  title: 'New Patient',
                  onSave: async (patientData) => {
                    handleInputChange('clientName', patientData.name || '');
                  }
                });
              }}
              disabled={mode === 'view' || isLoading}
            >
              Add Patient
            </button>
          </div>
          
          {/* Query indicator for database fields */}
          {isQuerying && (
            <div className={styles.queryIndicator}>
              <FaSpinner className={styles.spinner} />
            </div>
          )}
          
          {/* Query results dropdown */}
          {showQuery && queryResults.length > 0 && (
            <div className={styles.queryResults}>
              {queryResults.map((result, index) => (
                <div
                  key={index}
                  className={styles.queryResultItem}
                  onClick={() => handleQueryResultClick(name, result)}
                >
                  <FaUser className={styles.userIcon} />
                  <div className={styles.resultInfo}>
                    <div className={styles.resultName}>{result.name}</div>
                    <div className={styles.resultDetails}>
                      {result.phone && <span>📞 {result.phone}</span>}
                      {result.email && <span>📧 {result.email}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
      );
    }

    // Default field rendering
    return (
      <div className={styles.formGroup} key={name}>
        <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
          {label || name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
        
        <div className={styles.inputContainer}>
          <input
            type={type}
            className={getInputClassName(name)}
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            placeholder={placeholder || `Enter ${label || name}`}
            disabled={mode === 'view' || isLoading}
          />
          
          {/* Query indicator for database fields */}
          {isQuerying && (
            <div className={styles.queryIndicator}>
              <FaSpinner className={styles.spinner} />
            </div>
          )}
        </div>
        
        {/* Query results dropdown */}
        {showQuery && queryResults.length > 0 && (
          <div className={styles.queryResults}>
            {queryResults.map((result, index) => (
              <div
                key={index}
                className={styles.queryResultItem}
                onClick={() => handleQueryResultClick(name, result)}
              >
                <FaUser className={styles.userIcon} />
                <div className={styles.resultInfo}>
                  <div className={styles.resultName}>{result.name}</div>
                  <div className={styles.resultDetails}>
                    {result.phone && <span>📞 {result.phone}</span>}
                    {result.email && <span>📧 {result.email}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    );
  };

  const renderFormActions = () => {
    if (mode === 'view') {
      return (
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FaTimes />
            Close
          </button>
        </div>
      );
    }

    return (
      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelButton} 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <FaTimes />
          Cancel
        </button>
        
        {mode === 'edit' && onDelete && (
          <button 
            type="button" 
            className={styles.deleteButton} 
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this appointment?')) {
                setIsSubmitting(true);
                try {
                  await onDelete(formData);
                } catch (error) {
                  console.error('Delete error:', error);
                } finally {
                  setIsSubmitting(false);
                }
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className={styles.spinner} />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete
              </>
            )}
          </button>
        )}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className={styles.spinner} />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              <FaSave />
              {mode === 'create' ? 'Create' : 'Save'}
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formFields}>
        {getAppointmentFields().map(field => renderField(field))}
      </div>
      {renderFormActions()}
    </form>
  );
};

export default AppointmentForm;