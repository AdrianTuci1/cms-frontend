import { getBusinessType } from '../../../../../../config/businessTypes';

// Service field configuration based on business type
export const getServiceFields = () => {
  const businessType = getBusinessType();
  
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

export const getRequiredFields = () => {
  const fields = getServiceFields();
  return fields.filter(field => field.required).map(field => field.name);
};

export const getServiceTypeName = () => {
  const businessType = getBusinessType();
  
  switch (businessType.name) {
    case 'Dental Clinic': return 'Treatment';
    case 'Gym': return 'Package';
    case 'Hotel': return 'Room';
    default: return 'Service';
  }
};

// Validation functions
export const validateServiceForm = (formData) => {
  const newErrors = {};
  const requiredFields = getRequiredFields();
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return newErrors;
};

// Data processing functions
export const processServiceData = (formData, mode) => {
  const businessType = getBusinessType();
  
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

  return processedData;
};

// Form submission handler
export const handleServiceSubmit = async (formData, mode, onSubmit) => {
  const errors = validateServiceForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processServiceData(formData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

// Delete handler
export const handleServiceDelete = async (formData, onDelete) => {
  if (!onDelete) return;
  
  if (window.confirm('Are you sure you want to delete this service?')) {
    await onDelete(formData);
  }
};