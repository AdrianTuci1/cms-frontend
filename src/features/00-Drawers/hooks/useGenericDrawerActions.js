// Updated imports - force cache refresh
import useDrawerStore, { DRAWER_TYPES } from '../store/drawerStore';
import { useBusinessLogic } from '../../../design-patterns/hooks/useBusinessLogic';

/**
 * Generic hook for handling drawer actions with optimistic updates
 * Can be used for any resource type and business type
 * Uses design-patterns validation system
 */
export const useGenericDrawerActions = (resourceSync, businessType, resourceType = 'timeline') => {
  const {
    create,
    update,
    remove,
    refresh
  } = resourceSync;

  // Get openDrawer from the drawer store
  const { openDrawer } = useDrawerStore();

  // Use design-patterns business logic for validation and permissions
  const businessLogic = useBusinessLogic(businessType);
  const { validateData, isOperationAllowed, processData } = businessLogic;

  // Get the appropriate drawer type based on resource type
  const getDrawerType = (resourceType) => {
    switch (resourceType) {
      case 'timeline':
        return DRAWER_TYPES.TIMELINE;
      case 'member':
      case 'client':
        return DRAWER_TYPES.MEMBER;
      case 'service':
      case 'package':
        return DRAWER_TYPES.SERVICE;
      case 'stock':
        return DRAWER_TYPES.STOCK;
      default:
        return DRAWER_TYPES.TIMELINE;
    }
  };

  // Get business type specific labels
  const getBusinessTypeLabels = (businessType) => {
    switch (businessType) {
      case 'dental':
        return {
          appointment: 'Dental Appointment',
          client: 'Patient',
          service: 'Treatment'
        };
      case 'gym':
        return {
          appointment: 'Gym Session',
          client: 'Member',
          service: 'Package'
        };
      case 'hotel':
        return {
          appointment: 'Hotel Reservation',
          client: 'Guest',
          service: 'Room'
        };
      default:
        return {
          appointment: 'Appointment',
          client: 'Client',
          service: 'Service'
        };
    }
  };

  const labels = getBusinessTypeLabels(businessType);
  const drawerType = getDrawerType(resourceType);

  /**
   * Handle adding a new resource
   */
  const handleAdd = (defaultData = {}) => {
    const newResource = {
      ...defaultData,
      businessType
    };

    openDrawer('create', drawerType, newResource, {
      title: `New ${labels[resourceType] || resourceType}`,
      onSave: async (data, mode) => {
        console.log(`Creating ${resourceType}:`, data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, resourceType);
          
          // Validate data using design-patterns validation system
          const validation = validateData(processedData, resourceType);
          if (!validation.isValid) {
            console.error('Validation errors:', validation.errors);
            alert(`Validation errors: ${validation.errors.join(', ')}`);
            return;
          }

          // Check permissions using design-patterns permission system
          const operationName = `create${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
          if (!isOperationAllowed(operationName, processedData)) {
            console.error('Create operation not allowed');
            alert(`You do not have permission to create ${resourceType}s`);
            return;
          }

          // Use optimistic update from useDataSync
          await create(processedData);
          console.log(`${resourceType} created successfully with optimistic update!`);
        } catch (error) {
          console.error(`Failed to create ${resourceType}:`, error);
          alert(`Failed to create ${resourceType}. Please try again.`);
        }
      },
      onCancel: () => {
        console.log(`${resourceType} creation cancelled`);
      }
    });
  };

  /**
   * Handle editing an existing resource
   */
  const handleEdit = (resourceData) => {
    const editData = {
      ...resourceData,
      businessType
    };

    openDrawer('edit', drawerType, editData, {
      title: `Edit ${labels[resourceType] || resourceType}`,
      onSave: async (data, mode) => {
        console.log(`Updating ${resourceType}:`, data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, resourceType);
          
          // Validate data using design-patterns validation system
          const validation = validateData(processedData, resourceType);
          if (!validation.isValid) {
            console.error('Validation errors:', validation.errors);
            alert(`Validation errors: ${validation.errors.join(', ')}`);
            return;
          }

          // Check permissions using design-patterns permission system
          const operationName = `update${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
          if (!isOperationAllowed(operationName, processedData)) {
            console.error('Update operation not allowed');
            alert(`You do not have permission to update ${resourceType}s`);
            return;
          }

          // Use optimistic update from useDataSync
          await update(processedData);
          console.log(`${resourceType} updated successfully with optimistic update!`);
        } catch (error) {
          console.error(`Failed to update ${resourceType}:`, error);
          alert(`Failed to update ${resourceType}. Please try again.`);
        }
      },
      onDelete: async (data) => {
        if (!confirm(`Are you sure you want to delete this ${resourceType}?`)) {
          return;
        }

        console.log(`Deleting ${resourceType}:`, data);
        
        try {
          // Process data using design-patterns business logic
          const processedData = processData(data, resourceType);
          
          // Check permissions using design-patterns permission system
          const operationName = `delete${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
          if (!isOperationAllowed(operationName, processedData)) {
            console.error('Delete operation not allowed');
            alert(`You do not have permission to delete ${resourceType}s`);
            return;
          }

          // Use optimistic update from useDataSync
          await remove(processedData);
          console.log(`${resourceType} deleted successfully with optimistic update!`);
        } catch (error) {
          console.error(`Failed to delete ${resourceType}:`, error);
          alert(`Failed to delete ${resourceType}. Please try again.`);
        }
      },
      onCancel: () => {
        console.log(`${resourceType} edit cancelled`);
      }
    });
  };

  return {
    handleAdd,
    handleEdit,
    labels,
    businessType,
    resourceType
  };
}; 