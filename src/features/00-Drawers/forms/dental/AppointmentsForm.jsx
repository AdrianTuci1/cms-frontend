import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaSave, FaUser } from 'react-icons/fa';
import useDrawerStore, { DRAWER_TYPES } from '../../store/drawerStore';
import styles from './AppointmentsForm.module.css';

const AppointmentsForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { 
    updateCurrentData, 
    hasPendingChanges, 
    isCreateMode,
    saveDrawer,
    queryField,
    searchOptions,
    getQueryResults,
    getSearchResults,
    clearFieldResults,
    openDrawer
  } = useDrawerStore();
  
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryingFields, setQueryingFields] = useState(new Set());
  const [searchingFields, setSearchingFields] = useState(new Set());
  const [showQueryResults, setShowQueryResults] = useState({});
  const [showSearchResults, setShowSearchResults] = useState({});

  // Get fields configuration from store
  const baseFields = [
    { name: 'clientName', type: 'text', label: 'Client Name', required: true },
    { name: 'medicName', type: 'text', label: 'Medic Name', required: true },
    { name: 'displayTreatment', type: 'text', label: 'Treatment Name', required: true },
    { name: 'date', type: 'date', label: 'Date', required: true },
    { name: 'time', type: 'time', label: 'Time', required: true }
  ];
  const requiredFields = ['clientName', 'medicName', 'displayTreatment', 'date', 'time'];

  useEffect(() => {
    setFormData(data);
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

  const validateForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
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
    const isRequired = requiredFields.includes(name);
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
                console.log('Opening patient drawer...');
                const drawerId = openDrawer('create', DRAWER_TYPES.PATIENT, {}, {
                  title: 'New Patient',
                  onSave: async (patientData) => {
                    console.log('New patient created:', patientData);
                    // Update the client field with the new patient's name
                    handleInputChange('clientName', patientData.name || '');
                  }
                });
                console.log('Patient drawer opened with ID:', drawerId);
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



  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formFields}>
          {baseFields.map(field => renderField(field))}
        </div>
      </form>
    </div>
  );
};

export default AppointmentsForm; 