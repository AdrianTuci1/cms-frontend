// Appointments field configuration
export const getAppointmentsFields = () => {
  return [
    { name: 'clientName', type: 'text', label: 'Client Name', required: true },
    { name: 'medicName', type: 'text', label: 'Medic Name', required: true },
    { name: 'displayTreatment', type: 'text', label: 'Treatment Name', required: true },
    { name: 'date', type: 'date', label: 'Date', required: true },
    { name: 'time', type: 'time', label: 'Time', required: true }
  ];
};

export const getRequiredFields = () => {
  return ['clientName', 'medicName', 'displayTreatment', 'date', 'time'];
};

// Validation functions
export const validateAppointmentsForm = (formData) => {
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
export const processAppointmentsData = (formData, mode) => {
  return {
    ...formData,
    type: 'appointment',
    status: 'scheduled',
    createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
    updatedAt: new Date().toISOString()
  };
};

// Form submission handler
export const handleAppointmentsSubmit = async (formData, mode, onSubmit) => {
  const errors = validateAppointmentsForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processAppointmentsData(formData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

// Delete handler
export const handleAppointmentsDelete = async (formData, onDelete) => {
  if (!onDelete) return;
  
  await onDelete(formData);
};

// Debounce utility function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};