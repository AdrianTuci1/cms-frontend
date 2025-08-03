import React, { useState } from 'react';
import useDrawerStore, { DRAWER_TYPES } from '../../../store/drawerStore';
import styles from '../../../styles/FormStyles.module.css';

// Import actions
import { handleTimelineSubmit, handleTimelineDelete } from './actions/appointmentActions';

// Import views
import AppointmentViewToggle from './views/AppointmentViewToggle';
import OperativeDetailsView from './views/operative-details/OperativeDetailsView';
import GalleryView from './views/gallery/GalleryView';

// Import form components
import AppointmentForm from './form/AppointmentForm';
import TimelineFormActions from './form/TimelineFormActions';

const TimelineForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { openDrawer, hasPendingChanges, isCreateMode, saveDrawer } = useDrawerStore();
  const [activeMenu, setActiveMenu] = useState('form'); // 'form', 'operative', 'gallery'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData, mode) => {
    try {
      await handleTimelineSubmit(formData, mode, onSubmit);
    } catch (error) {
      console.error('Timeline submission error:', error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSubmitting(true);
    try {
      await handleTimelineDelete(data, onDelete);
    } catch (error) {
      console.error('Timeline delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSave = async () => {
    setIsSubmitting(true);
    
    try {
      await saveDrawer();
    } catch (error) {
      console.error('Manual save failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const renderContent = () => {
    switch (activeMenu) {
      case 'operative':
        return (
          <OperativeDetailsView
            mode={mode}
            data={data}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            mode={mode}
            data={data}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <AppointmentForm
            mode={mode}
            data={data}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className={styles.formContainer}>
      <AppointmentViewToggle
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        mode={mode}
      />
      <div className={styles.formContent}>
        {renderContent()}
      </div>
      <TimelineFormActions
        mode={mode}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onDelete={onDelete}
        handleDelete={handleDelete}
        handleManualSave={handleManualSave}
        isCreateMode={isCreateMode()}
      />
    </div>
  );
};

export default TimelineForm;