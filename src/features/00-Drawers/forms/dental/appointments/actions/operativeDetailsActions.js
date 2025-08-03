// Operative Details actions
export const validateOperativeDetailsForm = (formData) => {
  const newErrors = {};
  
  if (!formData.postOperativeNotes || !formData.postOperativeNotes.trim()) {
    newErrors.postOperativeNotes = 'Post-operative notes are required';
  }
  
  if (!formData.price || formData.price <= 0) {
    newErrors.price = 'Price is required and must be greater than 0';
  }

  return newErrors;
};

export const processOperativeDetailsData = (formData, mode, data) => {
  return {
    ...formData,
    price: parseFloat(formData.price),
    createdAt: mode === 'create' ? new Date().toISOString() : data?.createdAt,
    updatedAt: new Date().toISOString()
  };
};

export const handleOperativeDetailsSubmit = async (formData, mode, data, onSubmit) => {
  const errors = validateOperativeDetailsForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processOperativeDetailsData(formData, mode, data);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};