import React, { useState } from 'react';
import { useDataSync } from '../../../../design-patterns/hooks';
import BaseForm from '../BaseForm';
import useDrawerStore, { DRAWER_TYPES } from '../../store/drawerStore';

const TimelineForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { openDrawer, getDrawerFields, getRequiredFields, getDrawerTitle } = useDrawerStore();
  
  // Use useDataSync for members and services
  const membersSync = useDataSync('members', {
    enableValidation: true,
    enableBusinessLogic: true
  });

  const servicesSync = useDataSync('services', {
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

  // Filter services based on search terms
  const getFilteredServices = (searchTerm) => {
    if (!searchTerm) {
      return services.slice(0, 15); // Show first 15 results when no search
    }
    
    return services.filter(service => 
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 15); // Show up to 15 results
  };

  const getFilteredMembers = (searchTerm, roleFilter = null) => {
    let filtered = members;
    
    // Apply role filter if specified
    if (roleFilter) {
      const roleVariations = {
        'dentist': ['dentist', 'doctor', 'dr', 'Dentist', 'Doctor', 'DR'],
        'trainer': ['trainer', 'coach', 'instructor', 'personal trainer', 'fitness trainer', 'yoga trainer', 'Trainer', 'Coach', 'Instructor']
      };
      
      const variations = roleVariations[roleFilter.toLowerCase()] || [roleFilter.toLowerCase()];
      
      filtered = filtered.filter(member => {
        const memberRole = member.role || '';
        const memberSpecialization = member.specialization || '';
        
        return variations.some(variation => 
          memberRole.toLowerCase().includes(variation.toLowerCase()) ||
          memberSpecialization.toLowerCase().includes(variation.toLowerCase())
        );
      });
    }
    
    if (!searchTerm) {
      return filtered.slice(0, 15);
    }
    
    return filtered.filter(member => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 15);
  };

  // Get fields configuration from store
  const baseFields = getDrawerFields('timeline');
  const requiredFields = getRequiredFields('timeline');
  const title = getDrawerTitle('timeline');

  // Enhance fields with dynamic options from IndexedDB
  const getEnhancedFields = () => {
    // Ensure data is available before processing
    if (!members.length && !services.length) {
      return baseFields;
    }
    
    return baseFields.map(field => {
      // Enhance displayTreatment field
      if (field.name === 'displayTreatment') {
        const filteredServices = getFilteredServices(treatmentSearchTerm);
        const options = filteredServices.map(service => ({
          value: service.name,
          label: service.name
        }));
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || treatmentSearchTerm,
          onSearchChange: setTreatmentSearchTerm,
          placeholder: `Search treatments (${options.length} available)...`
        };
      }

      // Enhance medicName field
      if (field.name === 'medicName') {
        const filteredMembers = getFilteredMembers(medicSearchTerm, 'dentist');
        const options = filteredMembers.map(member => ({
          value: member.name,
          label: `${member.name} (${member.specialization || member.role})`
        }));
        return {
          ...field,
          type: 'searchable-select',
          options,
          searchTerm: getDisplayValue(field.name, data[field.name], options) || medicSearchTerm,
          onSearchChange: setMedicSearchTerm,
          placeholder: `Search dentists (${options.length} available)...`
        };
      }

      return field;
    });
  };

  const fields = getEnhancedFields();

  const handleSubmit = async (formData, mode) => {
    try {
      // Add data processing
      const processedData = {
        ...formData,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Validate data before submitting
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
    };

    // Use PATIENT drawer for dental clinics
    const drawerType = DRAWER_TYPES.PATIENT;

    openDrawer('edit', drawerType, memberData, {
      title: 'Edit Patient',
      onSave: async (memberData) => {
        console.log('Member data saved:', memberData);
        // You could update the timeline data with the new member info
      }
    });
  };

  // Show loading state if data is still loading
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
      </div>
    );
  }

  // Show error state if there are critical errors
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
      title={`${mode === 'create' ? 'New' : 'Edit'} ${title}`}
    />
  );
};

export default TimelineForm; 