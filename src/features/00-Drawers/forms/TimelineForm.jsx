import React, { useState, useEffect } from 'react';
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

  const { 
    data: membersData, 
    loading: membersLoading,
    validateData: validateMemberData,
    isOperationAllowed: isMemberOperationAllowed
  } = membersSync;
  
  const { 
    data: servicesData, 
    loading: servicesLoading,
    validateData: validateServiceData,
    isOperationAllowed: isServiceOperationAllowed
  } = servicesSync;

  // Extract items from data - handle different data structures
  // useDataSync returns data directly, not data.items or data.packages
  const members = membersData?.items || (Array.isArray(membersData) ? membersData : []);
  const services = servicesData?.packages || (Array.isArray(servicesData) ? servicesData : []);
  


  // State for search terms
  const [treatmentSearchTerm, setTreatmentSearchTerm] = useState('');
  const [medicSearchTerm, setMedicSearchTerm] = useState('');

  // Helper function to get display value for selected option
  const getDisplayValue = (fieldName, selectedValue, options) => {
    if (!selectedValue) return '';
    const option = options.find(opt => opt.value === selectedValue);
    return option ? option.label : selectedValue;
  };

  // Filter members and services based on search terms and business type
  const getFilteredServices = (searchTerm) => {
    console.log('getFilteredServices called with:', { searchTerm, servicesCount: services.length });
    
    // Map business type names to match the data format
    const businessTypeMap = {
      'Dental Clinic': 'dental',
      'Gym': 'gym',
      'Hotel': 'hotel'
    };
    
    const targetBusinessType = businessTypeMap[businessType.name];
    console.log('Target business type:', targetBusinessType);
    
    // Filter services by business type first
    const businessServices = services.filter(service => 
      service.businessType?.toLowerCase() === targetBusinessType?.toLowerCase() ||
      !service.businessType // Include services without business type specified
    );
    
    console.log('After business type filter:', businessServices.length, 'services');
    
    if (!searchTerm) {
      const result = businessServices.slice(0, 15); // Show first 15 results when no search
      console.log('Returning first 15 services:', result.length);
      return result;
    }
    
    const result = businessServices.filter(service => 
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 15); // Show up to 15 results
    
    console.log('After search filter:', result.length, 'services');
    return result;
  };

  const getFilteredMembers = (searchTerm, roleFilter = null) => {
    console.log('getFilteredMembers called with:', { searchTerm, roleFilter, membersCount: members.length });
    console.log('All members:', members.map(m => ({ name: m.name, role: m.role, specialization: m.specialization })));
    
    let filtered = members;
    
    // Apply role filter if specified
    if (roleFilter) {
      // More flexible role filtering - include variations
      const roleVariations = {
        'dentist': ['dentist', 'doctor', 'dr', 'Dentist', 'Doctor', 'DR'],
        'trainer': ['trainer', 'coach', 'instructor', 'personal trainer', 'fitness trainer', 'yoga trainer', 'Trainer', 'Coach', 'Instructor']
      };
      
      const variations = roleVariations[roleFilter.toLowerCase()] || [roleFilter.toLowerCase()];
      console.log('Looking for role variations:', variations);
      
      filtered = filtered.filter(member => {
        const memberRole = member.role || '';
        const memberSpecialization = member.specialization || '';
        
        const matches = variations.some(variation => 
          memberRole.toLowerCase().includes(variation.toLowerCase()) ||
          memberSpecialization.toLowerCase().includes(variation.toLowerCase())
        );
        
        console.log(`Member ${member.name} (${memberRole}) matches:`, matches);
        return matches;
      });
      
      console.log('After role filter:', filtered.length, 'members');
    }
    
    if (!searchTerm) {
      const result = filtered.slice(0, 15); // Show first 15 results when no search
      console.log('Returning first 15 members:', result.length);
      return result;
    }
    
    const result = filtered.filter(member => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 15); // Show up to 15 results
    
    console.log('After search filter:', result.length, 'members');
    return result;
  };

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
    membersData: membersData,
    servicesData: servicesData,
    membersLoading,
    servicesLoading,
    members: members.length,
    services: services.length,
    sampleMembers: members.slice(0, 3),
    sampleServices: services.slice(0, 3),
    filteredServices: getFilteredServices(''),
    filteredMembers: getFilteredMembers('', 'dentist'),
    membersSync: membersSync,
    servicesSync: servicesSync,
    membersDataKeys: membersData ? Object.keys(membersData) : 'null',
    servicesDataKeys: servicesData ? Object.keys(servicesData) : 'null'
  });

  // Enhance fields with dynamic options from IndexedDB
  const getEnhancedFields = () => {
    // Ensure data is available before processing
    if (!members.length && !services.length) {
      console.log('No data available yet, returning base fields');
      console.log('Members loading:', membersLoading, 'Services loading:', servicesLoading);
      console.log('Members data:', membersData);
      console.log('Services data:', servicesData);
      return baseFields;
    }
    
    return baseFields.map(field => {
      // Enhance displayTreatment field for Dental Clinic
      if (businessType.name === 'Dental Clinic' && field.name === 'displayTreatment') {
        const filteredServices = getFilteredServices(treatmentSearchTerm);
        const options = filteredServices.map(service => ({
          value: service.name,
          label: service.name
        }));
        console.log('displayTreatment options:', options, 'from', filteredServices.length, 'services');
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: `Search treatments (${options.length} available)...`
        };
      }

      // Enhance medicName field for Dental Clinic
      if (businessType.name === 'Dental Clinic' && field.name === 'medicName') {
        console.log('Processing medicName field for Dental Clinic');
        console.log('Current members data:', members);
        console.log('Current medicSearchTerm:', medicSearchTerm);
        
        const filteredMembers = getFilteredMembers(medicSearchTerm, 'dentist');
        const options = filteredMembers.map(member => ({
          value: member.name,
          label: `${member.name} (${member.specialization || member.role})`
        }));
        console.log('medicName options:', options, 'from', filteredMembers.length, 'members');
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || medicSearchTerm,
          onSearchChange: setMedicSearchTerm,
          placeholder: `Search dentists (${options.length} available)...`
        };
      }

      // Enhance sessionType field for Gym
      if (businessType.name === 'Gym' && field.name === 'sessionType') {
        const options = getFilteredServices(treatmentSearchTerm).map(service => ({
          value: service.name,
          label: service.name
        }));
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: `Search session types...`
        };
      }

      // Enhance trainerId field for Gym
      if (businessType.name === 'Gym' && field.name === 'trainerId') {
        const options = getFilteredMembers(medicSearchTerm, 'trainer').map(member => ({
          value: member.id,
          label: `${member.name} (${member.specialization || member.role})`
        }));
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || medicSearchTerm,
          onSearchChange: setMedicSearchTerm,
          placeholder: `Search trainers (${options.length} available)...`
        };
      }

      // Enhance roomType field for Hotel
      if (businessType.name === 'Hotel' && field.name === 'roomType') {
        const options = getFilteredServices(treatmentSearchTerm).map(service => ({
          value: service.name,
          label: service.name
        }));
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: `Search room types (${options.length} available)...`
        };
      }

      return field;
    });
  };

  const fields = getEnhancedFields();

  const handleSubmit = async (formData, mode) => {
    try {
      // Add business-specific data processing
      const processedData = {
        ...formData,
        businessType: businessType.name,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Validate data before submitting (following cursor rules pattern)
      const validation = validateMemberData ? validateMemberData(processedData, 'timeline') : { isValid: true, errors: [] };
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        alert(`Validation errors: ${validation.errors.join(', ')}`);
        return;
      }

      // Check permissions before operation (following cursor rules pattern)
      const operationName = mode === 'create' ? 'createTimeline' : 'updateTimeline';
      const hasPermission = isMemberOperationAllowed ? isMemberOperationAllowed(operationName, processedData) : true;
      if (!hasPermission) {
        console.error('Operation not allowed:', operationName);
        alert(`You do not have permission to ${mode === 'create' ? 'create' : 'update'} timeline entries`);
        return;
      }

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
      // Check permissions before deletion (following cursor rules pattern)
      const hasPermission = isMemberOperationAllowed ? isMemberOperationAllowed('deleteTimeline', formData) : true;
      if (!hasPermission) {
        console.error('Delete operation not allowed');
        alert('You do not have permission to delete timeline entries');
        return;
      }

      if (onDelete) {
        await onDelete(formData);
        console.log('Timeline entry deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete timeline:', error);
      alert('Failed to delete timeline entry. Please try again.');
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

    // Use PATIENT drawer for dental clinics, MEMBER for others
    const drawerType = businessType.name === 'Dental Clinic' ? DRAWER_TYPES.PATIENT : DRAWER_TYPES.MEMBER;

    openDrawer('edit', drawerType, memberData, {
      title: `Edit ${businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'}`,
      onSave: async (memberData) => {
        console.log('Member data saved:', memberData);
        // You could update the timeline data with the new member info
      }
    });
  };

  // Show loading state if data is still loading (following cursor rules pattern)
  if (membersLoading || servicesLoading) {
    return (
      <div className="loading-container" style={{ padding: '20px', textAlign: 'center' }}>
        <div className="spinner" style={{ 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 10px'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p>Se încarcă datele pentru formulare...</p>
        <p>Members: {membersLoading ? 'Încărcare...' : 'Gata'} ({members.length} items)</p>
        <p>Services: {servicesLoading ? 'Încărcare...' : 'Gata'} ({services.length} items)</p>
        <p>Business Type: {businessType.name}</p>
      </div>
    );
  }

  // Show error state if there are critical errors (following cursor rules pattern)
  if (!membersData && !membersLoading) {
    return (
      <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error loading form data</h3>
        <p>Failed to load members data. Please try again.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

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