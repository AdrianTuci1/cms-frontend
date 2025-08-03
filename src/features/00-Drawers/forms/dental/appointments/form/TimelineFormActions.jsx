import React from 'react';
import { FaSpinner, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';

const TimelineFormActions = ({ 
  mode, 
  isSubmitting, 
  onCancel, 
  onDelete, 
  handleDelete,
  handleManualSave,
  isCreateMode
}) => {
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
      
      {/* Manual save button for create mode */}
      {isCreateMode && (
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
    </div>
  );
};

export default TimelineFormActions;