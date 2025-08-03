import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import styles from '../../../../../styles/FormStyles.module.css';
import { 
  validateOperativeDetailsForm, 
  handleOperativeDetailsSubmit 
} from '../../actions/operativeDetailsActions';

const OperativeDetailsView = ({ mode, data, onSubmit, onDelete, onCancel, isLoading, hideActions = false }) => {
  const [formData, setFormData] = useState({
    postOperativeNotes: '',
    prescription: '',
    price: '',
    paid: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        postOperativeNotes: data.postOperativeNotes || '',
        prescription: data.prescription || '',
        price: data.price || '',
        paid: data.paid || false
      });
    }
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
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateOperativeDetailsForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await handleOperativeDetailsSubmit(formData, mode, data, onSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this operative detail?')) {
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formFields}>
        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
            Post-Operative Notes
          </label>
          <textarea
            value={formData.postOperativeNotes}
            onChange={(e) => handleInputChange('postOperativeNotes', e.target.value)}
            className={`${styles.formTextarea} ${errors.postOperativeNotes ? styles.error : ''}`}
            placeholder="Enter post-operative notes and observations..."
            disabled={mode === 'view' || isLoading}
          />
          {errors.postOperativeNotes && (
            <div className={styles.errorMessage}>{errors.postOperativeNotes}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Prescription
          </label>
          <textarea
            value={formData.prescription}
            onChange={(e) => handleInputChange('prescription', e.target.value)}
            className={styles.formTextarea}
            placeholder="Enter prescription details..."
            disabled={mode === 'view' || isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className={`${styles.formInput} ${errors.price ? styles.error : ''}`}
            placeholder="Enter treatment price..."
            min="0"
            step="0.01"
            disabled={mode === 'view' || isLoading}
          />
          {errors.price && (
            <div className={styles.errorMessage}>{errors.price}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.paid}
              onChange={(e) => handleInputChange('paid', e.target.checked)}
              className={styles.formCheckbox}
              disabled={mode === 'view' || isLoading}
            />
            <span className={styles.checkboxText}>Paid</span>
          </label>
          <p style={{ fontSize: '0.75rem', color: 'hsl(215.4 16.3% 46.9%)', marginTop: '0.25rem' }}>
            Mark if the treatment has been paid for
          </p>
        </div>
      </div>
      {!hideActions && renderFormActions()}
    </form>
  );
};

export default OperativeDetailsView;