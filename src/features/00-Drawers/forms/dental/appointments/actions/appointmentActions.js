// Timeline/Appointment actions
export const processTimelineData = (formData, mode) => {
  return {
    ...formData,
    createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
    updatedAt: new Date().toISOString()
  };
};

export const handleTimelineSubmit = async (formData, mode, onSubmit) => {
  const processedData = processTimelineData(formData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

export const handleTimelineDelete = async (formData, onDelete) => {
  if (!onDelete) return;
  
  if (window.confirm('Are you sure you want to delete this timeline entry?')) {
    await onDelete(formData);
  }
};

// Appointment form fields
export const getAppointmentFields = () => [
  { name: 'clientName', type: 'text', label: 'Client Name', required: true },
  { name: 'medicName', type: 'text', label: 'Medic Name', required: true },
  { name: 'displayTreatment', type: 'text', label: 'Treatment Name', required: true },
  { name: 'date', type: 'date', label: 'Date', required: true },
  { name: 'time', type: 'time', label: 'Time', required: true }
];

export const getAppointmentRequiredFields = () => [
  'clientName', 'medicName', 'displayTreatment', 'date', 'time'
];

export const validateAppointmentForm = (formData) => {
  const newErrors = {};
  const requiredFields = getAppointmentRequiredFields();
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return newErrors;
};