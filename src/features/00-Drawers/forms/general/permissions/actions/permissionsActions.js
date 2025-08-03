// Available resources for permissions
export const getPermissionResources = () => [
  { id: 'clients', name: 'Clienți', description: 'Gestionare clienți', icon: 'FaShieldAlt' },
  { id: 'appointments', name: 'Programări', description: 'Gestionare programări', icon: 'FaShieldAlt' },
  { id: 'services', name: 'Servicii', description: 'Gestionare servicii', icon: 'FaShieldAlt' },
  { id: 'invoices', name: 'Facturi', description: 'Gestionare facturi', icon: 'FaShieldAlt' },
  { id: 'reports', name: 'Rapoarte', description: 'Vizualizare rapoarte', icon: 'FaShieldAlt' },
  { id: 'settings', name: 'Setări', description: 'Configurare sistem', icon: 'FaCog' },
  { id: 'users', name: 'Utilizatori', description: 'Gestionare utilizatori', icon: 'FaShieldAlt' },
  { id: 'roles', name: 'Roluri', description: 'Gestionare roluri', icon: 'FaShieldAlt' }
];

// Available permissions with icons
export const getAvailablePermissions = () => [
  { id: 'read', name: 'Citire', description: 'Vizualizare date', icon: 'FaEye' },
  { id: 'write', name: 'Scriere', description: 'Creare și editare', icon: 'FaEdit' },
  { id: 'delete', name: 'Ștergere', description: 'Eliminare date', icon: 'FaTrash' },
  { id: 'admin', name: 'Administrare', description: 'Acces complet', icon: 'FaCog' }
];

// Validation functions
export const validatePermissionsForm = (roleData) => {
  const newErrors = {};
  
  if (!roleData.name || !roleData.name.trim()) {
    newErrors.name = 'Numele rolului este obligatoriu';
  }
  
  return newErrors;
};

// Data processing functions
export const processPermissionsData = (roleData, mode) => {
  return {
    ...roleData,
    id: mode === 'create' ? Date.now() : roleData.id,
    createdAt: mode === 'create' ? new Date().toISOString() : roleData.createdAt,
    updatedAt: new Date().toISOString(),
    accountsCount: roleData.accountsCount || 0
  };
};

// Form submission handler
export const handlePermissionsSubmit = async (roleData, mode, onSubmit) => {
  const errors = validatePermissionsForm(roleData);
  
  if (Object.keys(errors).length > 0) {
    throw new Error('Validation failed');
  }
  
  const processedData = processPermissionsData(roleData, mode);
  
  if (onSubmit) {
    await onSubmit(processedData, mode);
  }
  
  return processedData;
};

// Delete handler
export const handlePermissionsDelete = async (roleData, onDelete) => {
  if (!onDelete) return;
  
  if (window.confirm('Are you sure you want to delete this role?')) {
    await onDelete(roleData);
  }
};