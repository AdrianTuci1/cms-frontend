import React from 'react';
import { getBusinessType } from '../../../../src/config/businessTypes';
import BaseForm from './BaseForm';

const StockForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  
  // Stock field configurations
  const getFields = () => {
    const baseFields = [
      { name: 'name', type: 'text', label: 'Item Name', required: true },
      { name: 'quantity', type: 'number', label: 'Current Quantity', required: true, min: 0 },
      { name: 'minQuantity', type: 'number', label: 'Minimum Quantity', required: true, min: 0 },
      { name: 'price', type: 'number', label: 'Unit Price ($)', required: true, min: 0, step: 0.01 },
      { 
        name: 'category', 
        type: 'select', 
        label: 'Category', 
        required: true,
        options: [
          { value: 'supplies', label: 'Supplies' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'consumables', label: 'Consumables' },
          { value: 'tools', label: 'Tools' },
          { value: 'other', label: 'Other' }
        ]
      },
      { name: 'supplier', type: 'text', label: 'Supplier' },
      { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Item description...' }
    ];

    // Add business-specific fields
    switch (businessType.name) {
      case 'Dental Clinic':
        return [
          ...baseFields,
          { 
            name: 'dentalCategory', 
            type: 'select', 
            label: 'Dental Category',
            options: [
              { value: 'dental_supplies', label: 'Dental Supplies' },
              { value: 'instruments', label: 'Instruments' },
              { value: 'medications', label: 'Medications' },
              { value: 'protective_gear', label: 'Protective Gear' },
              { value: 'cleaning_supplies', label: 'Cleaning Supplies' }
            ]
          },
          { name: 'expiryDate', type: 'date', label: 'Expiry Date' }
        ];
        
      case 'Gym':
        return [
          ...baseFields,
          { 
            name: 'gymCategory', 
            type: 'select', 
            label: 'Gym Category',
            options: [
              { value: 'equipment', label: 'Equipment' },
              { value: 'supplements', label: 'Supplements' },
              { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
              { value: 'office_supplies', label: 'Office Supplies' },
              { value: 'maintenance', label: 'Maintenance' }
            ]
          },
          { name: 'brand', type: 'text', label: 'Brand' }
        ];
        
      case 'Hotel':
        return [
          ...baseFields,
          { 
            name: 'hotelCategory', 
            type: 'select', 
            label: 'Hotel Category',
            options: [
              { value: 'amenities', label: 'Amenities' },
              { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
              { value: 'linens', label: 'Linens' },
              { value: 'food_beverage', label: 'Food & Beverage' },
              { value: 'maintenance', label: 'Maintenance' }
            ]
          },
          { name: 'roomSpecific', type: 'text', label: 'Room Specific', placeholder: 'e.g., Suite 101, Pool Area' }
        ];
        
      default:
        return baseFields;
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
      updatedAt: new Date().toISOString(),
      // Add stock-specific fields
      lastUpdated: new Date().toISOString(),
      reorderPoint: formData.minQuantity
    };

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  const handleDelete = async (formData) => {
    if (onDelete) {
      await onDelete(formData);
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
      title={`${businessType.name} ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'} Stock Item`}
      businessType={businessType.name}
    />
  );
};

export default StockForm; 