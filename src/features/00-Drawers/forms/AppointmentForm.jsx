import React from 'react';
import { getBusinessType } from '../../../../src/config/businessTypes';
import BaseForm from './BaseForm';
import useDrawerStore, { DRAWER_TYPES } from '../store/drawerStore';

const AppointmentForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  const { openDrawer } = useDrawerStore();
  
  // Business-specific field configurations
  const getFields = () => {
    switch (businessType.name) {
      case 'Dental Clinic':
        return [
          { name: 'patientName', type: 'text', label: 'Patient Name', required: true },
          { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'date', type: 'date', label: 'Appointment Date', required: true },
          { name: 'time', type: 'time', label: 'Appointment Time', required: true },
          { 
            name: 'treatmentType', 
            type: 'select', 
            label: 'Treatment Type', 
            required: true,
            options: [
              { value: 'cleaning', label: 'Dental Cleaning' },
              { value: 'checkup', label: 'Checkup' },
              { value: 'root_canal', label: 'Root Canal' },
              { value: 'filling', label: 'Filling' },
              { value: 'extraction', label: 'Extraction' },
              { value: 'whitening', label: 'Teeth Whitening' },
              { value: 'other', label: 'Other' }
            ]
          },
          { 
            name: 'medicId', 
            type: 'select', 
            label: 'Dentist', 
            required: true,
            options: [
              { value: '1', label: 'Dr. John Smith' },
              { value: '2', label: 'Dr. Sarah Johnson' },
              { value: '3', label: 'Dr. Michael Brown' }
            ]
          },
          { name: 'duration', type: 'number', label: 'Duration (minutes)', min: 15, max: 180 },
          { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Additional notes about the appointment...' }
        ];
        
      case 'Gym':
        return [
          { name: 'clientName', type: 'text', label: 'Client Name', required: true },
          { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'date', type: 'date', label: 'Session Date', required: true },
          { name: 'time', type: 'time', label: 'Session Time', required: true },
          { 
            name: 'sessionType', 
            type: 'select', 
            label: 'Session Type', 
            required: true,
            options: [
              { value: 'personal_training', label: 'Personal Training' },
              { value: 'group_class', label: 'Group Class' },
              { value: 'consultation', label: 'Consultation' },
              { value: 'assessment', label: 'Fitness Assessment' },
              { value: 'other', label: 'Other' }
            ]
          },
          { 
            name: 'trainerId', 
            type: 'select', 
            label: 'Trainer', 
            required: true,
            options: [
              { value: '1', label: 'Mike Johnson' },
              { value: '2', label: 'Lisa Chen' },
              { value: '3', label: 'David Wilson' }
            ]
          },
          { name: 'duration', type: 'number', label: 'Duration (minutes)', min: 30, max: 120 },
          { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Session goals or special requirements...' }
        ];
        
      case 'Hotel':
        return [
          { name: 'guestName', type: 'text', label: 'Guest Name', required: true },
          { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'checkIn', type: 'date', label: 'Check-in Date', required: true },
          { name: 'checkOut', type: 'date', label: 'Check-out Date', required: true },
          { 
            name: 'roomType', 
            type: 'select', 
            label: 'Room Type', 
            required: true,
            options: [
              { value: 'standard', label: 'Standard Room' },
              { value: 'deluxe', label: 'Deluxe Room' },
              { value: 'suite', label: 'Suite' },
              { value: 'family', label: 'Family Room' },
              { value: 'presidential', label: 'Presidential Suite' }
            ]
          },
          { name: 'guests', type: 'number', label: 'Number of Guests', min: 1, max: 6 },
          { name: 'specialRequests', type: 'textarea', label: 'Special Requests', placeholder: 'Any special requests or preferences...' }
        ];
        
      default:
        return [
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
          { name: 'date', type: 'date', label: 'Date', required: true },
          { name: 'time', type: 'time', label: 'Time', required: true },
          { name: 'notes', type: 'textarea', label: 'Notes' }
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
      status: mode === 'create' ? 'scheduled' : formData.status,
      createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      updatedAt: new Date().toISOString()
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

  const handleOpenMemberDrawer = (formData) => {
    // Extract member data from appointment data
    const memberData = {
      name: formData.patientName || formData.clientName || formData.guestName || '',
      phoneNumber: formData.phoneNumber || '',
      email: formData.email || '',
      // Add other relevant fields based on business type
    };

    openDrawer({
      type: DRAWER_TYPES.MEMBER,
      mode: 'edit',
      data: memberData,
      title: `Edit ${businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'}`,
      onSave: async (memberData) => {
        console.log('Member data saved:', memberData);
        // You could update the appointment data with the new member info
      },
      allowMultiple: true // Allow opening member drawer from appointment
    });
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
      title={`${businessType.name} ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'} ${businessType.name === 'Dental Clinic' ? 'Appointment' : businessType.name === 'Gym' ? 'Session' : 'Booking'}`}
      businessType={businessType.name}
    >
      {({ formData, mode, isLoading }) => {
        // Only show member button if we have a name
        const hasName = formData.patientName || formData.clientName || formData.guestName;
        
        return (
          <>
            {/* Default field rendering will be handled by BaseForm */}
            {/* Custom member management section */}
            {hasName && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                backgroundColor: 'var(--bg-secondary, #f9fafb)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color, #e5e7eb)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--text-primary, #111827)' 
                  }}>
                    {businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'} Management
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenMemberDrawer(formData)}
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--color-primary, #3b82f6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-primary-hover, #2563eb)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-primary, #3b82f6)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Edit {businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'} Details
                </button>
              </div>
            )}
          </>
        );
      }}
    </BaseForm>
  );
};

export default AppointmentForm; 