import React from 'react';
import useDrawerStore, { DRAWER_TYPES, DRAWER_MODES } from './store/drawerStore';
import DrawerLayout from './layout/DrawerLayout';
import TimelineForm from './forms/TimelineForm';
import ServiceForm from './forms/ServiceForm';
import StockForm from './forms/StockForm';
import MemberForm from './forms/MemberForm';
import PermissionsForm from './forms/PermissionsForm';
import UserDrawer from './forms/UserDrawer';

const DrawerManager = () => {
  const {
    drawers,
    activeDrawerId,
    isOpen,
    closeDrawer,
    isLoading
  } = useDrawerStore();

  const activeDrawer = drawers.find(d => d.id === activeDrawerId);

  if (!isOpen || !activeDrawer) {
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      if (activeDrawer.onSave) {
        await activeDrawer.onSave(formData, activeDrawer.mode);
      }
      closeDrawer(activeDrawer.id);
    } catch (error) {
      console.error('Error saving data:', error);
      // You could show a toast notification here
    }
  };

  const handleDelete = async (formData) => {
    try {
      if (activeDrawer.onDelete) {
        await activeDrawer.onDelete(formData);
      }
      closeDrawer(activeDrawer.id);
    } catch (error) {
      console.error('Error deleting data:', error);
      // You could show a toast notification here
    }
  };

  const handleCancel = () => {
    if (activeDrawer.onCancel) {
      activeDrawer.onCancel();
    }
    closeDrawer(activeDrawer.id);
  };

  const renderForm = () => {
    const formProps = {
      mode: activeDrawer.mode,
      data: activeDrawer.data || {},
      onSubmit: handleSubmit,
      onDelete: handleDelete,
      onCancel: handleCancel,
      isLoading
    };

    switch (activeDrawer.type) {
      case DRAWER_TYPES.TIMELINE:
        return <TimelineForm {...formProps} />;
        
      case DRAWER_TYPES.SERVICE:
        return <ServiceForm {...formProps} />;
        
      case DRAWER_TYPES.STOCK:
        return <StockForm {...formProps} />;
        
      case DRAWER_TYPES.MEMBER:
        return <MemberForm {...formProps} />;
        
      case DRAWER_TYPES.PERMISSIONS:
        return <PermissionsForm {...formProps} />;
        
      case DRAWER_TYPES.USER:
        return <UserDrawer onClose={() => closeDrawer(activeDrawer.id)} />;
        
      case DRAWER_TYPES.AI_ASSISTANT:
        // AI Assistant drawer - don't touch as requested
        return activeDrawer.data?.content || <div>AI Assistant Content</div>;
        
      default:
        return <div>Unsupported drawer type: {activeDrawer.type}</div>;
    }
  };

  return (
    <DrawerLayout
      isOpen={isOpen}
      onClose={() => closeDrawer(activeDrawer.id)}
      title={activeDrawer.title}
      isLoading={isLoading}
      size={activeDrawer.size || 'medium'}
    >
      {renderForm()}
    </DrawerLayout>
  );
};

export default DrawerManager; 