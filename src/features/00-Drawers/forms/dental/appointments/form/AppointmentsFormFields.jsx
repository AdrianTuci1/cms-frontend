import React from 'react';
import { FaSpinner, FaUser } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';
import useDrawerStore, { DRAWER_TYPES } from '../../../store/drawerStore';

const AppointmentsFormFields = ({ 
  fields, 
  formData, 
  errors, 
  handleInputChange, 
  mode, 
  isLoading,
  queryingFields,
  showQueryResults,
  getQueryResults,
  handleQueryResultClick
}) => {
  const { openDrawer } = useDrawerStore();

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
    <div className={styles.formFields}>
      {fields.map(field => renderField(field))}
    </div>
  );
};

export default AppointmentsFormFields;