import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { getBusinessType } from '../../../../../config/businessTypes';
import styles from '../../../styles/FormStyles.module.css';

const StockForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  // Stock field configurations
  const getFields = () => {
    const baseFields = [
      { name: 'name', type: 'text', label: 'Item Name', required: true },
      { name: 'quantity', type: 'number', label: 'Current Quantity', required: true, min: 0 },
      { name: 'minQuantity', type: 'number', label: 'Minimum Quantity', required: true, min: 0 },
      { name: 'price', type: 'number', label: 'Unit Price ($)', required: true, min: 0, step: 0.01 },
      { name: 'category', type: 'text', label: 'Category', required: true, placeholder: 'e.g., Supplies, Equipment, Tools' }
    ];

    // Add business-specific fields
    switch (businessType.name) {
      case 'Dental Clinic':
        return baseFields;
        
      case 'Gym':
        return [
          ...baseFields,
          { 
            name: 'gymCategory', 
            type: 'select', 
            label: 'Gym Category',
            options: [
              { value: 'equipment', label: 'Equipment' },
              { value: 'supplements', label: 'Supplements' },
              { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
              { value: 'office_supplies', label: 'Office Supplies' },
              { value: 'maintenance', label: 'Maintenance' }
            ]
          },
          { name: 'brand', type: 'text', label: 'Brand' }
        ];
        
      case 'Hotel':
        return [
          ...baseFields,
          { 
            name: 'hotelCategory', 
            type: 'select', 
            label: 'Hotel Category',
            options: [
              { value: 'amenities', label: 'Amenities' },
              { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
              { value: 'linens', label: 'Linens' },
              { value: 'food_beverage', label: 'Food & Beverage' },
              { value: 'maintenance', label: 'Maintenance' }
            ]
          },
          { name: 'roomSpecific', type: 'text', label: 'Room Specific', placeholder: 'e.g., Suite 101, Pool Area' }
        ];
        
      default:
        return baseFields;
    }
  };

  const getRequiredFields = () => {
    const fields = getFields();
    return fields.filter(field => field.required).map(field => field.name);
  };

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
    const requiredFields = getRequiredFields();
    
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
      const processedData = {
        ...formData,
        businessType: businessType.name,
        status: 'active',
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        reorderPoint: formData.minQuantity
      };

      if (onSubmit) {
        await onSubmit(processedData, mode);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      setIsSubmitting(true);
      try {
        await onDelete(formData);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsSubmitting(false);
      }
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
            onClick={handleDelete}
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
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formFields}>
          {getFields().map(field => renderField(field))}
        </div>
        {renderFormActions()}
      </form>
    </div>
  );
};

export default StockForm;