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
  const [showSearchableSelects, setShowSearchableSelects] = useState({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchableSelects = document.querySelectorAll('[data-searchable-select]');
      let clickedInside = false;
      
      searchableSelects.forEach(select => {
        if (select.contains(event.target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        // Close all searchable selects
        setShowSearchableSelects({});
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowSearchableSelects({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

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
    const queryFields = ['phone', 'email'];
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
    setShowSearchableSelects(prev => ({ ...prev, [field]: false }));
    clearFieldResults(field);
    
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const closeSearchableSelect = (fieldName) => {
    setShowSearchableSelects(prev => ({ ...prev, [fieldName]: false }));
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
    
    required.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Custom validation for specific fields
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
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
    const { name, type, label, placeholder, options = [], searchTerm, onSearchChange, showInitialResults, ...props } = fieldConfig;
    
    const isRequired = required.includes(name);
    const error = getFieldError(name);
    const isQuerying = queryingFields.has(name);
    const isSearching = searchingFields.has(name);
    const showQuery = showQueryResults[name];
    const showSearch = showSearchResults[name];
    const queryResults = getQueryResults(name);
    const searchResults = getSearchResults(name);

    switch (type) {
      case 'searchable-select':
        return (
          <div className={styles.formGroup} key={name} data-searchable-select>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            
            {/* Search input with integrated selection */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className={getInputClassName(name)}
                placeholder={placeholder || `Search ${label || name}...`}
                value={searchTerm || formData[name] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // Clear the selected value when user starts typing
                  if (value !== formData[name]) {
                    handleSelectChange(name, '');
                  }
                  onSearchChange && onSearchChange(value);
                }}
                onFocus={() => {
                  setShowSearchableSelects(prev => ({ ...prev, [name]: true }));
                }}
                onBlur={() => {
                  // Delay closing to allow for clicks on dropdown items
                  setTimeout(() => {
                    setShowSearchableSelects(prev => ({ ...prev, [name]: false }));
                  }, 150);
                }}
                disabled={mode === 'view' || isLoading}
              />
              {!searchTerm && !formData[name] && options.length > 0 && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  pointerEvents: 'none'
                }}>
                  {options.length} available
                </div>
              )}
            </div>
            
            {/* Options dropdown */}
            {options.length > 0 && showSearchableSelects[name] && (
              <div className={styles.searchResults}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={styles.searchResultItem}
                    onClick={() => {
                      handleSelectChange(name, option.value);
                      onSearchChange && onSearchChange(option.label);
                    }}
                  >
                    {option.label}
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
        
      case 'select':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            
            {/* Only show search input if options are not predefined (for dynamic searches) */}
            {!options || options.length === 0 ? (
              <>
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
                
                {isSearching && (
                  <div className={styles.loadingIndicator}>
                    <FaSpinner className={styles.spinner} />
                    Searching...
                  </div>
                )}
              </>
            ) : null}
            
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
        
      case 'datetime-local':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type="datetime-local"
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
        
      case 'color':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type="color"
              className={getInputClassName(name)}
              value={formData[name] || '#1976d2'}
              onChange={(e) => handleInputChange(name, e.target.value)}
              disabled={mode === 'view' || isLoading}
              style={{ height: '44px', padding: '4px' }}
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
        
      case 'checkbox':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${styles.checkboxLabel}`}>
              <input
                type="checkbox"
                className={styles.formCheckbox}
                checked={formData[name] || false}
                onChange={(e) => handleInputChange(name, e.target.checked)}
                disabled={mode === 'view' || isLoading}
                {...props}
              />
              <span className={styles.checkboxText}>
                {label || name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            </label>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );
        
      case 'text-with-button':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label || name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            
            <div className={styles.inputContainer} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className={getInputClassName(name)}
                value={formData[name] || ''}
                onChange={(e) => handleInputChange(name, e.target.value)}
                placeholder={placeholder || `Enter ${label || name}`}
                disabled={mode === 'view' || isLoading}
                style={{ flex: 1 }}
                {...props}
              />
              
              <button
                type="button"
                className={styles.actionButton}
                onClick={fieldConfig.onButtonClick}
                disabled={mode === 'view' || isLoading}
                style={{ 
                  whiteSpace: 'nowrap',
                  padding: '8px 12px',
                  fontSize: '0.875rem'
                }}
              >
                {fieldConfig.buttonText}
              </button>
            </div>
            
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