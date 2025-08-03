import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';

const PatientFormFields = ({ 
  fields, 
  formData, 
  errors, 
  handleInputChange, 
  mode, 
  isLoading 
}) => {
  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const getInputClassName = (fieldName) => {
    const baseClass = styles.formInput;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const getSelectClassName = (fieldName) => {
    const baseClass = styles.formSelect;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const getTextareaClassName = (fieldName) => {
    const baseClass = styles.formTextarea;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const renderField = (field) => {
    const { name, type, label, placeholder, required, options = [], ...props } = field;
    const isRequired = required;
    const error = getFieldError(name);

    switch (type) {
      case 'select':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <select
              className={getSelectClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              disabled={mode === 'view' || isLoading}
              {...props}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <textarea
              className={getTextareaClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label}`}
              disabled={mode === 'view' || isLoading}
              {...props}
            />
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <input
              type={type}
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label}`}
              disabled={mode === 'view' || isLoading}
              {...props}
            />
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.formFields}>
      {fields.map(field => renderField(field))}
    </div>
  );
};

export default PatientFormFields;