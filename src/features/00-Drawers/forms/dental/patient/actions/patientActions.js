import { getBusinessTypeKey } from '../../../../../../config/businessTypes';

// Patient field configuration
export const getPatientFields = () => {
  return [
    { name: 'fullName', type: 'text', label: 'Full Name', required: true },
    { name: 'birthYear', type: 'number', label: 'Birth Year', required: true, min: 1900, max: new Date().getFullYear() },
    { 
      name: 'gender', 
      type: 'select', 
      label: 'Gender', 
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
    { name: 'email', type: 'email', label: 'Email Address' },
    { name: 'address', type: 'textarea', label: 'Address', placeholder: 'Enter patient address...' },
    { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Additional notes about the patient...' },
    { name: 'tags', type: 'text', label: 'Tags', placeholder: 'Enter tags separated by commas...' }
  ];
};

export const getRequiredFields = () => {
  const fields = getPatientFields();
  return fields.filter(field => field.required).map(field => field.name);
};

// Validation functions
export const validatePatientForm = (formData) => {
  const newErrors = {};
  const requiredFields = getRequiredFields();
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  // Validate birth year
  if (formData.birthYear) {
    const year = parseInt(formData.birthYear);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      newErrors.birthYear = 'Birth year must be between 1900 and current year';
    }
  }

  // Validate phone number
  if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    newErrors.phone = 'Please enter a valid phone number';
  }

  // Validate email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  return newErrors;
};

// Data processing functions
export const processPatientData = (formData, mode) => {
  const businessTypeKey = getBusinessTypeKey();
  
  return {
    ...formData,
    businessType: businessTypeKey,
    type: 'patient',
    status: 'active',
    createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
    updatedAt: new Date().toISOString()
  };
};

// Form submission handler
export const handlePatientSubmit = async (formData, mode, onSubmit) => {
  const errors = validatePatientForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processPatientData(formData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

// Delete handler
export const handlePatientDelete = async (formData, onDelete) => {
  if (!onDelete) return;
  
  await onDelete(formData);
};