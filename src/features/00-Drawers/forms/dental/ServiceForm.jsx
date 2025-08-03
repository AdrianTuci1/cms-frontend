import React from 'react';
import { getBusinessType } from '../../../../../src/config/businessTypes';
import BaseForm from '../BaseForm';

const ServiceForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  
  // Business-specific field configurations
  const getFields = () => {
    switch (businessType.name) {
      case 'Dental Clinic':
        return [
          { name: 'name', type: 'text', label: 'Treatment Name', required: true },
          { name: 'price', type: 'number', label: 'Price ($)', required: true, min: 0, step: 0.01 },
          { name: 'duration', type: 'number', label: 'Duration (minutes)', required: true, min: 15, max: 180 },
          { 
            name: 'category', 
            type: 'select', 
            label: 'Category', 
            required: true,
            options: [
              { value: 'preventive', label: 'Preventive' },
              { value: 'restorative', label: 'Restorative' },
              { value: 'cosmetic', label: 'Cosmetic' },
              { value: 'surgical', label: 'Surgical' },
              { value: 'emergency', label: 'Emergency' },
              { value: 'other', label: 'Other' }
            ]
          },
          { name: 'description', type: 'textarea', label: 'Description', required: true, placeholder: 'Describe the treatment procedure...' },
          { name: 'color', type: 'text', label: 'Color Code', placeholder: '#3B82F6' }
        ];
        
      case 'Gym':
        return [
          { name: 'name', type: 'text', label: 'Package Name', required: true },
          { name: 'price', type: 'number', label: 'Price ($)', required: true, min: 0, step: 0.01 },
          { name: 'duration', type: 'number', label: 'Duration (months)', required: true, min: 1, max: 24 },
          { 
            name: 'type', 
            type: 'select', 
            label: 'Package Type', 
            required: true,
            options: [
              { value: 'basic', label: 'Basic' },
              { value: 'standard', label: 'Standard' },
              { value: 'premium', label: 'Premium' },
              { value: 'vip', label: 'VIP' },
              { value: 'custom', label: 'Custom' }
            ]
          },
          { name: 'description', type: 'textarea', label: 'Description', required: true, placeholder: 'Describe the package features...' },
          { name: 'features', type: 'textarea', label: 'Features', placeholder: 'List package features (one per line)...' }
        ];
        
      case 'Hotel':
        return [
          { name: 'name', type: 'text', label: 'Room Name', required: true },
          { name: 'price', type: 'number', label: 'Price per Night ($)', required: true, min: 0, step: 0.01 },
          { name: 'capacity', type: 'number', label: 'Capacity (guests)', required: true, min: 1, max: 10 },
          { 
            name: 'type', 
            type: 'select', 
            label: 'Room Type', 
            required: true,
            options: [
              { value: 'standard', label: 'Standard' },
              { value: 'deluxe', label: 'Deluxe' },
              { value: 'suite', label: 'Suite' },
              { value: 'family', label: 'Family' },
              { value: 'presidential', label: 'Presidential' }
            ]
          },
          { name: 'description', type: 'textarea', label: 'Description', required: true, placeholder: 'Describe the room...' },
          { name: 'amenities', type: 'textarea', label: 'Amenities', placeholder: 'List room amenities (one per line)...' }
        ];
        
      default:
        return [
          { name: 'name', type: 'text', label: 'Service Name', required: true },
          { name: 'price', type: 'number', label: 'Price', required: true, min: 0 },
          { name: 'description', type: 'textarea', label: 'Description', required: true }
        ];
    }
  };

  const getRequiredFields = () => {
    const fields = getFields();
    return fields.filter(field => field.required).map(field => field.name);
  };

  const handleSubmit = async (formData, mode) => {
    // Add business-specific data processing
    const processedData = {
      ...formData,
      businessType: businessType.name,
      status: 'active',
      createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      updatedAt: new Date().toISOString()
    };

    // Process features/amenities if they exist
    if (formData.features) {
      processedData.features = formData.features.split('\n').filter(f => f.trim());
    }
    if (formData.amenities) {
      processedData.amenities = formData.amenities.split('\n').filter(a => a.trim());
    }

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  const handleDelete = async (formData) => {
    if (onDelete) {
      await onDelete(formData);
    }
  };

  const getServiceTypeName = () => {
    switch (businessType.name) {
      case 'Dental Clinic': return 'Treatment';
      case 'Gym': return 'Package';
      case 'Hotel': return 'Room';
      default: return 'Service';
    }
  };

  return (
    <BaseForm
      mode={mode}
      data={data}
      fields={getFields()}
      required={getRequiredFields()}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onCancel={onCancel}
      isLoading={isLoading}
      title={`${businessType.name} ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'} ${getServiceTypeName()}`}
      businessType={businessType.name}
    />
  );
};

export default ServiceForm; 