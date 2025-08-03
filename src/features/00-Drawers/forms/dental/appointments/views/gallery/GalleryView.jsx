import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import styles from '../../../../../styles/FormStyles.module.css';
import { 
  getGalleryFields, 
  validateGalleryForm, 
  handleGallerySubmit 
} from '../../actions/galleryActions';

const GalleryView = ({ mode, data, onSubmit, onDelete, onCancel, isLoading, hideActions = false }) => {
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState(data?.images || []);

  useEffect(() => {
    setFormData(data || {});
    setImages(data?.images || []);
  }, [data]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateGalleryForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await handleGallerySubmit(formData, images, mode, onSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this gallery?')) {
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
    <div className={styles.form}>
      <div className={styles.formFields}>
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>
            <FaUpload />
            Upload Images
          </h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.formInput}
            disabled={mode === 'view' || isLoading}
          />
          <p style={{ fontSize: '0.75rem', color: 'hsl(215.4 16.3% 46.9%)', marginTop: '0.5rem' }}>
            Select multiple images to upload
          </p>
        </div>

        {images.length > 0 && (
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Gallery Images</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '1rem' 
            }}>
              {images.map((image) => (
                <div key={image.id} style={{ position: 'relative' }}>
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '0.375rem',
                      border: '1px solid hsl(214.3 31.8% 91.4%)'
                    }} 
                  />
                  {mode !== 'view' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'hsl(0 84.2% 60.2%)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  )}
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'hsl(215.4 16.3% 46.9%)', 
                    marginTop: '0.25rem',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {getGalleryFields().filter(field => field.name !== 'images').map(field => renderField(field))}
      </div>
      {!hideActions && renderFormActions()}
    </div>
  );
};

export default GalleryView;