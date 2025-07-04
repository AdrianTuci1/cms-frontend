import React, { useState } from 'react';
import { getBusinessType } from '../../../../src/config/businessTypes';
import { useDataSync } from '../../../design-patterns/hooks';
import BaseForm from './BaseForm';
import useDrawerStore, { DRAWER_TYPES } from '../store/drawerStore';

const TimelineForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessType = getBusinessType();
  const { openDrawer, getDrawerFields, getRequiredFields, getDrawerTitle } = useDrawerStore();
  
  // Use useDataSync for members and services
  const membersSync = useDataSync('members', {
    businessType: businessType.name,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const servicesSync = useDataSync('services', {
    businessType: businessType.name,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: membersData } = membersSync;
  const { data: servicesData } = servicesSync;

  // Extract items from data
  const members = membersData?.items || membersData || [];
  const services = servicesData?.items || servicesData || [];

  // State for search terms
  const [treatmentSearchTerm, setTreatmentSearchTerm] = useState('');
  const [medicSearchTerm, setMedicSearchTerm] = useState('');

  // Filter members and services based on search terms
  const filteredServices = services.filter(service => 
    service.name?.toLowerCase().includes(treatmentSearchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(treatmentSearchTerm.toLowerCase())
  ).slice(0, 5); // Show only first 5 results

  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(medicSearchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(medicSearchTerm.toLowerCase())
  ).slice(0, 5); // Show only first 5 results

  // Get fields configuration from store
  const baseFields = getDrawerFields('timeline', businessType.name);
  const requiredFields = getRequiredFields('timeline', businessType.name);
  const title = getDrawerTitle('timeline', businessType.name);

  // Debug logging
  console.log('TimelineForm Debug:', {
    businessType: businessType.name,
    baseFields,
    requiredFields,
    title,
    members: members.length,
    services: services.length
  });

  // Enhance fields with dynamic options from IndexedDB
  const getEnhancedFields = () => {
    return baseFields.map(field => {
      // Enhance treatmentId field for Dental Clinic
      if (businessType.name === 'Dental Clinic' && field.name === 'treatmentId') {
        return {
          ...field,
          type: 'searchable-select',
          options: filteredServices.map(service => ({
            value: service.id,
            label: service.name
          })),
          searchTerm: treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: 'Search treatments...',
          showInitialResults: true
        };
      }

      // Enhance medicId field for Dental Clinic
      if (businessType.name === 'Dental Clinic' && field.name === 'medicId') {
        return {
          ...field,
          type: 'searchable-select',
          options: filteredMembers
            .filter(member => member.role?.toLowerCase().includes('dentist') || member.role?.toLowerCase().includes('doctor'))
            .map(member => ({
              value: member.id,
              label: member.name
            })),
          searchTerm: medicSearchTerm,
          onSearchChange: setMedicSearchTerm,
          placeholder: 'Search dentists...',
          showInitialResults: true
        };
      }

      // Auto-fill displayTreatment when treatmentId is selected
      if (businessType.name === 'Dental Clinic' && field.name === 'displayTreatment') {
        return {
          ...field,
          disabled: true // Auto-filled based on treatmentId selection
        };
      }

      // Auto-fill medicName when medicId is selected
      if (businessType.name === 'Dental Clinic' && field.name === 'medicName') {
        return {
          ...field,
          disabled: true // Auto-filled based on medicId selection
        };
      }

      // Enhance sessionType field for Gym
      if (businessType.name === 'Gym' && field.name === 'sessionType') {
        return {
          ...field,
          type: 'searchable-select',
          options: filteredServices.map(service => ({
            value: service.id,
            label: service.name
          })),
          searchTerm: treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: 'Search session types...',
          showInitialResults: true
        };
      }

      // Enhance trainerId field for Gym
      if (businessType.name === 'Gym' && field.name === 'trainerId') {
        return {
          ...field,
          type: 'searchable-select',
          options: filteredMembers
            .filter(member => member.role?.toLowerCase().includes('trainer'))
            .map(member => ({
              value: member.id,
              label: member.name
            })),
          searchTerm: medicSearchTerm,
          onSearchChange: setMedicSearchTerm,
          placeholder: 'Search trainers...',
          showInitialResults: true
        };
      }

      // Enhance roomType field for Hotel
      if (businessType.name === 'Hotel' && field.name === 'roomType') {
        return {
          ...field,
          type: 'searchable-select',
          options: filteredServices.map(service => ({
            value: service.id,
            label: service.name
          })),
          searchTerm: treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: 'Search room types...',
          showInitialResults: true
        };
      }

      return field;
    });
  };

  const fields = getEnhancedFields();

  const handleSubmit = async (formData, mode) => {
    // Add business-specific data processing
    const processedData = {
      ...formData,
      businessType: businessType.name,
      status: mode === 'create' ? 'scheduled' : formData.status,
      createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      updatedAt: new Date().toISOString()
    };

    // Auto-fill displayTreatment and medicName if not set
    if (businessType.name === 'Dental Clinic') {
      if (formData.treatmentId && !formData.displayTreatment) {
        const selectedTreatment = services.find(service => service.id === formData.treatmentId);
        processedData.displayTreatment = selectedTreatment?.name || '';
      }
      
      if (formData.medicId && !formData.medicName) {
        const selectedMedic = members.find(member => member.id === formData.medicId);
        processedData.medicName = selectedMedic?.name || '';
      }
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

  const handleOpenMemberDrawer = (formData) => {
    // Extract member data from timeline data
    const memberData = {
      name: formData.clientName || formData.patientName || formData.guestName || '',
      phoneNumber: formData.phoneNumber || '',
      email: formData.email || '',
      // Add other relevant fields based on business type
    };

    openDrawer('edit', DRAWER_TYPES.MEMBER, memberData, {
      title: `Edit ${businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'}`,
      onSave: async (memberData) => {
        console.log('Member data saved:', memberData);
        // You could update the timeline data with the new member info
      }
    });
  };

  return (
    <BaseForm
      mode={mode}
      data={data}
      fields={fields}
      required={requiredFields}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onCancel={onCancel}
      isLoading={isLoading}
      title={`${businessType.name} ${mode === 'create' ? 'New' : 'Edit'} ${title}`}
      businessType={businessType.name}
    />
  );
};

export default TimelineForm; 