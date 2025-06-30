import React from 'react';
import { getBusinessType } from '../../../../src/config/businessTypes';
import BaseForm from './BaseForm';

const MemberForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  
  // Member field configurations
  const getFields = () => {
    const baseFields = [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email Address', required: true },
      { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
      { name: 'address', type: 'textarea', label: 'Address', placeholder: 'Enter full address...' },
      { name: 'dateOfBirth', type: 'date', label: 'Date of Birth' }
    ];

    // Add business-specific fields
    switch (businessType.name) {
      case 'Dental Clinic':
        return [
          ...baseFields,
          { name: 'emergencyContact', type: 'text', label: 'Emergency Contact' },
          { name: 'emergencyPhone', type: 'tel', label: 'Emergency Phone' },
          { name: 'medicalHistory', type: 'textarea', label: 'Medical History', placeholder: 'Relevant medical history...' },
          { name: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'List any allergies...' },
          { 
            name: 'insuranceProvider', 
            type: 'select', 
            label: 'Insurance Provider',
            options: [
              { value: 'none', label: 'No Insurance' },
              { value: 'blue_cross', label: 'Blue Cross' },
              { value: 'aetna', label: 'Aetna' },
              { value: 'cigna', label: 'Cigna' },
              { value: 'other', label: 'Other' }
            ]
          },
          { name: 'insuranceNumber', type: 'text', label: 'Insurance Number' }
        ];
        
      case 'Gym':
        return [
          ...baseFields,
          { 
            name: 'membershipType', 
            type: 'select', 
            label: 'Membership Type',
            options: [
              { value: 'basic', label: 'Basic' },
              { value: 'premium', label: 'Premium' },
              { value: 'vip', label: 'VIP' },
              { value: 'student', label: 'Student' },
              { value: 'senior', label: 'Senior' }
            ]
          },
          { name: 'membershipStartDate', type: 'date', label: 'Membership Start Date' },
          { name: 'membershipEndDate', type: 'date', label: 'Membership End Date' },
          { name: 'emergencyContact', type: 'text', label: 'Emergency Contact' },
          { name: 'emergencyPhone', type: 'tel', label: 'Emergency Phone' },
          { name: 'fitnessGoals', type: 'textarea', label: 'Fitness Goals', placeholder: 'Member\'s fitness goals...' },
          { name: 'healthConditions', type: 'textarea', label: 'Health Conditions', placeholder: 'Any health conditions to be aware of...' }
        ];
        
      case 'Hotel':
        return [
          ...baseFields,
          { 
            name: 'guestType', 
            type: 'select', 
            label: 'Guest Type',
            options: [
              { value: 'individual', label: 'Individual' },
              { value: 'business', label: 'Business' },
              { value: 'family', label: 'Family' },
              { value: 'group', label: 'Group' },
              { value: 'vip', label: 'VIP' }
            ]
          },
          { name: 'preferredRoomType', type: 'text', label: 'Preferred Room Type' },
          { name: 'specialRequests', type: 'textarea', label: 'Special Requests', placeholder: 'Any special requests or preferences...' },
          { name: 'loyaltyNumber', type: 'text', label: 'Loyalty Number' },
          { name: 'preferences', type: 'textarea', label: 'Preferences', placeholder: 'Guest preferences (room location, amenities, etc.)...' }
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
      // Add member-specific fields
      memberSince: mode === 'create' ? new Date().toISOString() : formData.memberSince,
      lastVisit: mode === 'create' ? null : formData.lastVisit
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

  const getMemberTypeName = () => {
    switch (businessType.name) {
      case 'Dental Clinic': return 'Patient';
      case 'Gym': return 'Member';
      case 'Hotel': return 'Guest';
      default: return 'Member';
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
      title={`${businessType.name} ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'} ${getMemberTypeName()}`}
      businessType={businessType.name}
    />
  );
};

export default MemberForm; 