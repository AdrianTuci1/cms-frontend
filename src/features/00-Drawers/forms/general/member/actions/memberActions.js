import { getBusinessTypeKey } from '../../../../../../config/businessTypes';

// Member field configuration
export const getMemberFields = (roles = []) => {
  // Get role options from the roles store
  const roleOptions = roles.map(role => ({
    value: role.id.toString(),
    label: role.name
  }));

  return [
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email Address', required: true },
    { 
      name: 'role', 
      type: 'select', 
      label: 'Role', 
      required: true,
      options: roleOptions
    },
    { name: 'dutyDays', type: 'textarea', label: 'Duty Days', placeholder: 'Enter duty days...' }
  ];
};

export const getRequiredFields = () => {
  return ['name', 'email', 'role'];
};

// Validation functions
export const validateMemberForm = (formData) => {
  const newErrors = {};
  const requiredFields = getRequiredFields();
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  // Validate email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  return newErrors;
};

// Data processing functions
export const processMemberData = (formData, mode) => {
  const businessTypeKey = getBusinessTypeKey();
  
  return {
    ...formData,
    businessType: businessTypeKey,
    status: 'active',
    createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
    updatedAt: new Date().toISOString()
  };
};

// Form submission handler
export const handleMemberSubmit = async (formData, mode, onSubmit) => {
  const errors = validateMemberForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processMemberData(formData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

// Delete handler
export const handleMemberDelete = async (formData, onDelete) => {
  if (!onDelete) return;
  
  await onDelete(formData);
};