import React from 'react';
import useDrawerStore, { DRAWER_TYPES, DRAWER_MODES } from './store/drawerStore';
import DrawerLayout from './layout/DrawerLayout';
import styles from './DrawerManager.module.css';

// General forms
import UserDrawer from './forms/general/UserDrawer';
import MemberForm from './forms/general/MemberForm';
import PermissionsForm from './forms/general/PermissionsForm';
import StockForm from './forms/general/StockForm';

// Business-specific forms (using dental as default)
import TimelineForm from './forms/dental/TimelineForm';
import ServiceForm from './forms/dental/ServiceForm';
import PatientForm from './forms/dental/PatientForm';
import OperativeDetailsForm from './forms/dental/OperativeDetailsForm';
import GalleryForm from './forms/dental/GalleryForm';



const DrawerManager = () => {
  const {
    drawers,
    isOpen,
    closeDrawer,
    isLoading,
    getTotalDrawers,
    getDrawerIndex,
    isTopDrawer,
    getActiveDrawerSize
  } = useDrawerStore();

  if (!isOpen || drawers.length === 0) {
    return null;
  }

  // Get the active drawer size for container styling
  const activeDrawerSize = getActiveDrawerSize();
  const containerSizeClass = `drawerContainer${activeDrawerSize.charAt(0).toUpperCase() + activeDrawerSize.slice(1)}`;

  const handleSubmit = async (formData, drawerId) => {
    const drawer = drawers.find(d => d.id === drawerId);
    try {
      if (drawer?.onSave) {
        await drawer.onSave(formData, drawer.mode);
      }
      closeDrawer(drawerId);
    } catch (error) {
      console.error('Error saving data:', error);
      // You could show a toast notification here
    }
  };

  const handleDelete = async (formData, drawerId) => {
    const drawer = drawers.find(d => d.id === drawerId);
    try {
      if (drawer?.onDelete) {
        await drawer.onDelete(formData);
      }
      closeDrawer(drawerId);
    } catch (error) {
      console.error('Error deleting data:', error);
      // You could show a toast notification here
    }
  };

  const handleCancel = (drawerId) => {
    const drawer = drawers.find(d => d.id === drawerId);
    if (drawer?.onCancel) {
      drawer.onCancel();
    }
    closeDrawer(drawerId);
  };

  const renderForm = (drawer) => {
    const formProps = {
      mode: drawer.mode,
      data: drawer.data || {},
      onSubmit: (formData) => handleSubmit(formData, drawer.id),
      onDelete: (formData) => handleDelete(formData, drawer.id),
      onCancel: () => handleCancel(drawer.id),
      isLoading
    };

    switch (drawer.type) {
      // General forms (same for all business types)
      case DRAWER_TYPES.STOCK:
        return <StockForm {...formProps} />;
        
      case DRAWER_TYPES.MEMBER:
        return <MemberForm {...formProps} />;
        
      case DRAWER_TYPES.PERMISSIONS:
        return <PermissionsForm {...formProps} />;
        
      case DRAWER_TYPES.USER:
        return <UserDrawer onClose={() => closeDrawer(drawer.id)} />;
        
      // Business-specific forms - using dental as default
      case DRAWER_TYPES.TIMELINE:
        return <TimelineForm {...formProps} />;
        
      case DRAWER_TYPES.SERVICE:
        return <ServiceForm {...formProps} />;
        
      case DRAWER_TYPES.PATIENT:
        return <PatientForm {...formProps} />;
        
      case DRAWER_TYPES.OPERATIVE_DETAILS:
        return <OperativeDetailsForm {...formProps} />;
        
      case DRAWER_TYPES.GALLERY:
        return <GalleryForm {...formProps} />;
        
      case DRAWER_TYPES.AI_ASSISTANT:
        // AI Assistant drawer - don't touch as requested
        return drawer.data?.content || <div>AI Assistant Content</div>;
        
      default:
        return <div>Unsupported drawer type: {drawer.type}</div>;
    }
  };

  return (
    <div className={`${styles.drawerContainer} ${styles[containerSizeClass]}`}>
      {drawers.map((drawer, index) => {
        const drawerIndex = getDrawerIndex(drawer.id);
        const isActive = isTopDrawer(drawer.id);
        
        return (
          <DrawerLayout
            key={drawer.id}
            isOpen={true}
            onClose={() => closeDrawer(drawer.id)}
            title={drawer.title}
            isLoading={isLoading}
            drawerIndex={drawerIndex}
            totalDrawers={getTotalDrawers()}
            isActive={isActive}
          >
            {renderForm(drawer)}
          </DrawerLayout>
        );
      })}
    </div>
  );
};

export default DrawerManager; 