import React from 'react';
import { FaSpinner, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';

const AppointmentsFormActions = ({ 
  mode, 
  isSubmitting, 
  onCancel, 
  onDelete, 
  handleDelete 
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

export default AppointmentsFormActions;