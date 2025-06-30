import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaTrash, FaEye, FaEdit, FaSave, FaSearch, FaUser } from 'react-icons/fa';
import styles from './BaseForm.module.css';
import useDrawerStore from '../store/drawerStore';

const BaseForm = ({
  mode = 'edit', // Default to edit mode
  data = {},
  fields = [],
  required = [],
  onSubmit,
  onDelete,
  onCancel,
  isLoading = false,
  title = '',
  businessType = '',
  children
}) => {
  const { 
    updateCurrentData, 
    hasPendingChanges, 
    isCreateMode,
    saveDrawer,
    queryField,
    searchOptions,
    getQueryResults,
    getSearchResults,
    clearFieldResults
  } = useDrawerStore();
  
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryingFields, setQueryingFields] = useState(new Set());
  const [searchingFields, setSearchingFields] = useState(new Set());
  const [showQueryResults, setShowQueryResults] = useState({});
  const [showSearchResults, setShowSearchResults] = useState({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Debounced query function
  const debouncedQuery = useCallback(
    debounce(async (fieldName, value) => {
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
    }, 500),
    [queryField, clearFieldResults]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (fieldName, searchTerm) => {
      if (!searchTerm || searchTerm.length < 1) {
        clearFieldResults(fieldName);
        setShowSearchResults(prev => ({ ...prev, [fieldName]: false }));
        return;
      }

      setSearchingFields(prev => new Set(prev).add(fieldName));
      try {
        await searchOptions(fieldName, searchTerm);
        setShowSearchResults(prev => ({ ...prev, [fieldName]: true }));
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setSearchingFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      }
    }, 300),
    [searchOptions, clearFieldResults]
  );

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
    const queryFields = ['phoneNumber', 'email'];
    if (queryFields.includes(field)) {
      debouncedQuery(field, value);
    }
  };

  const handleSelectChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(newFormData);
    
    // Update store for auto-save (only for edit mode)
    if (mode === 'edit') {
      updateCurrentData(newFormData);
    }
    
    // Clear search results when selection is made
    setShowSearchResults(prev => ({ ...prev, [field]: false }));
    clearFieldResults(field);
    
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSearchInput = (field, searchTerm) => {
    debouncedSearch(field, searchTerm);
  };

  const handleQueryResultClick = (field, result) => {
    // Auto-fill form with query result
    const newFormData = {
      ...formData,
      name: result.name || formData.name,
      patientName: result.name || formData.patientName,
      clientName: result.name || formData.clientName,
      guestName: result.name || formData.guestName,
      phoneNumber: result.phoneNumber || formData.phoneNumber,
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
    
    required.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Custom validation for specific fields
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Price must be a positive number';
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
      if (onSubmit) {
        await onSubmit(formData, mode);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // You could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await saveDrawer();
      console.log('Manual save successful');
    } catch (error) {
      console.error('Manual save failed:', error);
      // You could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
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
    const fieldConfig = fields.find(f => f.name === field) || { name: field, type: 'text' };
    const { name, type, label, placeholder, options = [], ...props } = fieldConfig;
    
    const isRequired = required.includes(name);
    const error = getFieldError(name);
    const isQuerying = queryingFields.has(name);
    const isSearching = searchingFields.has(name);
    const showQuery = showQueryResults[name];
    const showSearch = showSearchResults[name];
    const queryResults = getQueryResults(name);
    const searchResults = getSearchResults(name);

    switch (type) {
      case 'select':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            
            {/* Search input for select fields */}
            <input
              type="text"
              className={getInputClassName(name)}
              placeholder={`Search ${label || name}...`}
              onChange={(e) => handleSearchInput(name, e.target.value)}
              disabled={mode === 'view' || isLoading}
              style={{ marginBottom: '8px' }}
            />
            
            {/* Search results dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={styles.searchResultItem}
                    onClick={() => handleSelectChange(name, result.value)}
                  >
                    {result.label}
                  </div>
                ))}
              </div>
            )}
            
            <select
              className={getSelectClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleSelectChange(name, e.target.value)}
              disabled={mode === 'view' || isLoading}
              {...props}
            >
              <option value="">Select {label || name}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {isSearching && (
              <div className={styles.loadingIndicator}>
                <FaSpinner className={styles.spinner} />
                Searching...
              </div>
            )}
            
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
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <textarea
              className={getTextareaClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label || name}`}
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
        
      case 'date':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type="date"
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
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
        
      case 'time':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type="time"
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
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
        
      case 'number':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type="number"
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label || name}`}
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
                {...props}
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
                        {result.phoneNumber && <span>📞 {result.phoneNumber}</span>}
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
  };

  const renderActions = () => {
    const hasChanges = hasPendingChanges();
    const isCreate = isCreateMode();
    
    if (mode === 'view') {
      return (
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
        
        {/* Manual save button for create mode */}
        {isCreate && (
          <button 
            type="button" 
            className={styles.submitButton}
            onClick={handleManualSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className={styles.spinner} />
                Creating...
              </>
            ) : (
              <>
                <FaSave />
                Create
              </>
            )}
          </button>
        )}
        
        {/* Auto-save indicator for edit mode */}
        {!isCreate && hasChanges && (
          <div className={styles.autoSaveIndicator}>
            <FaSave />
            <span>Auto-save enabled</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Custom children (for complex forms) */}
        {children ? (
          children({
            formData,
            handleInputChange,
            getFieldError,
            getInputClassName,
            getSelectClassName,
            getTextareaClassName,
            mode,
            isLoading
          })
        ) : (
          /* Default field rendering */
          <div className={styles.formFields}>
            {fields.map(field => 
              typeof field === 'string' ? renderField(field) : renderField(field.name)
            )}
          </div>
        )}
        
        {renderActions()}
      </form>
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default BaseForm; 