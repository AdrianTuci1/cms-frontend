// Updated imports - force cache refresh
import useDrawerStore, { DRAWER_TYPES } from '../store/drawerStore';
import { useBusinessLogic } from '../../../design-patterns/hooks/useBusinessLogic';

/**
 * Hook for handling timeline drawer actions with optimistic updates
 * Centralizes all drawer-related logic for timeline operations
 * Uses design-patterns validation system
 */
export const useTimelineDrawerActions = (timelineSync, businessType = 'dental') => {
  const {
    create,
    update,
    remove,
    refresh
  } = timelineSync;

  // Get openDrawer from the drawer store
  const { openDrawer } = useDrawerStore();

  // Use design-patterns business logic for validation and permissions
  const businessLogic = useBusinessLogic(businessType);
  const { validateData, isOperationAllowed, processData } = businessLogic;

  /**
   * Handle adding a new appointment
   */
  const handleAddAppointment = () => {
    // Create new appointment with default values
    const newAppointment = {
      clientId: null,
      clientName: '',
      phoneNumber: '',
      email: '',
      treatmentId: null,
      displayTreatment: '',
      medicId: null,
      medicName: '',
      date: new Date().toISOString().slice(0, 16), // Current date and time
      duration: 60,
      status: 'scheduled',
      color: '#1976d2',
      notes: '',
      businessType
    };

    openDrawer('create', DRAWER_TYPES.TIMELINE, newAppointment, {
      title: `New ${businessType === 'dental' ? 'Dental' : businessType === 'gym' ? 'Gym' : 'Hotel'} Appointment`,
      onSave: async (data, mode) => {
        console.log('Saving appointment:', data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, 'timeline');
          
          // Validate data using design-patterns validation system
          const validation = validateData(processedData, 'timeline');
          if (!validation.isValid) {
            console.error('Validation errors:', validation.errors);
            alert(`Validation errors: ${validation.errors.join(', ')}`);
            return;
          }

          // Check permissions using design-patterns permission system
          if (!isOperationAllowed('createTimeline', processedData)) {
            console.error('Create operation not allowed');
            alert('You do not have permission to create appointments');
            return;
          }

          // Use optimistic update from useDataSync
          await create(processedData);
          console.log('Appointment created successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to create appointment:', error);
          alert('Failed to create appointment. Please try again.');
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Appointment creation cancelled');
      }
    });
  };

  /**
   * Handle editing an existing appointment
   */
  const handleAppointmentClick = (appointment) => {
    // Edit existing appointment
    const appointmentData = {
      id: appointment.id,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      phoneNumber: appointment.phoneNumber || '',
      email: appointment.email || '',
      treatmentId: appointment.treatmentId,
      displayTreatment: appointment.displayTreatment,
      medicId: appointment.medicId,
      medicName: appointment.medicName,
      date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
      duration: appointment.duration,
      status: appointment.status,
      color: appointment.color,
      notes: appointment.notes || '',
      businessType
    };

    openDrawer('edit', DRAWER_TYPES.TIMELINE, appointmentData, {
      title: `Edit ${businessType === 'dental' ? 'Dental' : businessType === 'gym' ? 'Gym' : 'Hotel'} Appointment`,
      onSave: async (data, mode) => {
        console.log('Updating appointment:', data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, 'timeline');
          
          // Validate data using design-patterns validation system
          const validation = validateData(processedData, 'timeline');
          if (!validation.isValid) {
            console.error('Validation errors:', validation.errors);
            alert(`Validation errors: ${validation.errors.join(', ')}`);
            return;
          }

          // Check permissions using design-patterns permission system
          if (!isOperationAllowed('updateTimeline', processedData)) {
            console.error('Update operation not allowed');
            alert('You do not have permission to update appointments');
            return;
          }

          // Use optimistic update from useDataSync
          await update(processedData);
          console.log('Appointment updated successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to update appointment:', error);
          alert('Failed to update appointment. Please try again.');
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onDelete: async (data) => {
        if (!confirm(`Are you sure you want to delete this appointment for ${data.clientName}?`)) {
          return;
        }

        console.log('Deleting appointment:', data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, 'timeline');
          
          // Check permissions using design-patterns permission system
          if (!isOperationAllowed('deleteTimeline', processedData)) {
            console.error('Delete operation not allowed');
            alert('You do not have permission to delete appointments');
            return;
          }

          // Use optimistic update from useDataSync
          await remove(processedData);
          console.log('Appointment deleted successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to delete appointment:', error);
          alert('Failed to delete appointment. Please try again.');
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Appointment edit cancelled');
      }
    });
  };

  /**
   * Handle patient/member editing
   */
  const handlePatientClick = (appointment) => {
    // Open patient/member drawer for editing
    const patientData = {
      id: appointment.clientId,
      name: appointment.clientName,
      phoneNumber: appointment.phoneNumber || '',
      email: appointment.email || '',
      role: businessType === 'dental' ? 'patient' : businessType === 'gym' ? 'member' : 'guest',
      businessType
    };

    const patientTypeLabel = businessType === 'dental' ? 'Patient' : businessType === 'gym' ? 'Member' : 'Guest';

    openDrawer('edit', DRAWER_TYPES.MEMBER, patientData, {
      title: `Edit ${patientTypeLabel} Information`,
      onSave: async (data, mode) => {
        console.log(`Updating ${patientTypeLabel.toLowerCase()}:`, data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, 'member');
          
          // Validate data using design-patterns validation system
          const validation = validateData(processedData, 'member');
          if (!validation.isValid) {
            console.error(`${patientTypeLabel} validation errors:`, validation.errors);
            alert(`Validation errors: ${validation.errors.join(', ')}`);
            return;
          }

          // Check permissions using design-patterns permission system
          if (!isOperationAllowed('updateMember', processedData)) {
            console.error(`${patientTypeLabel} update operation not allowed`);
            alert(`You do not have permission to update ${patientTypeLabel.toLowerCase()} information`);
            return;
          }

          // Here you would typically update your API/database
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`${patientTypeLabel} updated successfully!`);
          
          // Refresh timeline data
          if (refresh) {
            refresh();
          }
        } catch (error) {
          console.error(`Failed to update ${patientTypeLabel.toLowerCase()}:`, error);
          alert(`Failed to update ${patientTypeLabel.toLowerCase()}. Please try again.`);
        }
      },
      onDelete: async (data) => {
        if (!confirm(`Are you sure you want to delete ${patientTypeLabel.toLowerCase()} ${data.name}?`)) {
          return;
        }

        console.log(`Deleting ${patientTypeLabel.toLowerCase()}:`, data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, 'member');
          
          // Check permissions using design-patterns permission system
          if (!isOperationAllowed('deleteMember', processedData)) {
            console.error(`${patientTypeLabel} delete operation not allowed`);
            alert(`You do not have permission to delete ${patientTypeLabel.toLowerCase()}s`);
            return;
          }

          // Here you would typically delete from your API/database
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`${patientTypeLabel} deleted successfully!`);
          
          // Refresh timeline data
          if (refresh) {
            refresh();
          }
        } catch (error) {
          console.error(`Failed to delete ${patientTypeLabel.toLowerCase()}:`, error);
          alert(`Failed to delete ${patientTypeLabel.toLowerCase()}. Please try again.`);
        }
      },
      onCancel: () => {
        console.log(`${patientTypeLabel} edit cancelled`);
      }
    });
  };

  return {
    handleAddAppointment,
    handleAppointmentClick,
    handlePatientClick
  };
}; 