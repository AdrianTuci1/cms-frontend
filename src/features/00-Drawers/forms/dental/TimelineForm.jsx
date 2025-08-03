import React, { useState } from 'react';
import { FaSpinner, FaTrash, FaSave } from 'react-icons/fa';
import AppointmentsForm from './AppointmentsForm';
import OperativeDetailsForm from './OperativeDetailsForm';
import useDrawerStore, { DRAWER_TYPES } from '../../store/drawerStore';
import styles from './TimelineForm.module.css';

const TimelineForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { openDrawer, hasPendingChanges, isCreateMode, saveDrawer } = useDrawerStore();
  const [activeMenu, setActiveMenu] = useState('form'); // 'form', 'operative', 'gallery'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData, mode) => {
    try {
      // Add data processing
      const processedData = {
        ...formData,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(processedData, mode);
        console.log(`Timeline ${mode === 'create' ? 'created' : 'updated'} successfully`);
      }
    } catch (error) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} timeline:`, error);
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} timeline. Please try again.`);
    }
  };

  const handleDelete = async (formData) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) {
      return;
    }

    try {
      if (onDelete) {
        await onDelete(formData);
        console.log('Timeline entry deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete timeline:', error);
      alert('Failed to delete timeline entry. Please try again.');
    }
  };

  const handleManualSave = async () => {
    setIsSubmitting(true);
    
    try {
      await saveDrawer();
      console.log('Manual save successful');
    } catch (error) {
      console.error('Manual save failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenOperativeDetails = () => {
    setActiveMenu('operative');
  };

  const handleOpenGallery = () => {
    openDrawer('view', DRAWER_TYPES.GALLERY, data, {
      title: 'Gallery',
      onSave: async (galleryData) => {
        console.log('Gallery data saved:', galleryData);
        // You could update the timeline data with the gallery data
      }
    });
  };

  const renderMenuButtons = () => {
    return (
      <div className={styles.menuButtons}>
        <button
          type="button"
          className={`${styles.menuButton} ${activeMenu === 'form' ? styles.active : ''}`}
          onClick={() => setActiveMenu('form')}
        >
          Appointments
        </button>
        <button
          type="button"
          className={`${styles.menuButton} ${activeMenu === 'operative' ? styles.active : ''}`}
          onClick={handleOpenOperativeDetails}
        >
          Operative Details
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleOpenGallery}
          >
            Gallery
          </button>
        )}
      </div>
    );
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

  const renderContent = () => {
    switch (activeMenu) {
      case 'operative':
        return (
          <OperativeDetailsForm
            mode={mode}
            data={data}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <AppointmentsForm
            mode={mode}
            data={data}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className={styles.timelineFormContainer}>
      {renderMenuButtons()}
      <div className={styles.formContent}>
        {renderContent()}
      </div>
      {renderActions()}
    </div>
  );
};

export default TimelineForm; 