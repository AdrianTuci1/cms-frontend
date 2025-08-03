// Gallery actions for appointments
export const getGalleryFields = () => [
  { name: 'title', type: 'text', label: 'Gallery Title', required: true },
  { name: 'description', type: 'textarea', label: 'Description' },
  { name: 'category', type: 'select', label: 'Category', options: [
    { value: 'before-after', label: 'Before & After' },
    { value: 'procedures', label: 'Procedures' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'team', label: 'Team' }
  ]}
];

export const getGalleryRequiredFields = () => ['title'];

export const validateGalleryForm = (formData) => {
  const newErrors = {};
  const requiredFields = getGalleryRequiredFields();
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return newErrors;
};

export const processGalleryData = (formData, images, mode) => {
  return {
    ...formData,
    images: images,
    createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
    updatedAt: new Date().toISOString()
  };
};

export const handleGallerySubmit = async (formData, images, mode, onSubmit) => {
  const errors = validateGalleryForm(formData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processGalleryData(formData, images, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};