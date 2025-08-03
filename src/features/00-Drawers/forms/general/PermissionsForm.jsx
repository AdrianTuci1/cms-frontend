import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheck, FaTimes, FaChevronDown, FaChevronRight, FaEye, FaEdit, FaTrash, FaCog } from 'react-icons/fa';
import styles from './PermissionsForm.module.css';

const PermissionsForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const [roleData, setRoleData] = useState({
    name: '',
    description: '',
    permissions: {},
    ...data
  });

  const [expandedResources, setExpandedResources] = useState(new Set());

  // Available resources for permissions
  const resources = [
    { id: 'clients', name: 'Clienți', description: 'Gestionare clienți', icon: FaShieldAlt },
    { id: 'appointments', name: 'Programări', description: 'Gestionare programări', icon: FaShieldAlt },
    { id: 'services', name: 'Servicii', description: 'Gestionare servicii', icon: FaShieldAlt },
    { id: 'invoices', name: 'Facturi', description: 'Gestionare facturi', icon: FaShieldAlt },
    { id: 'reports', name: 'Rapoarte', description: 'Vizualizare rapoarte', icon: FaShieldAlt },
    { id: 'settings', name: 'Setări', description: 'Configurare sistem', icon: FaCog },
    { id: 'users', name: 'Utilizatori', description: 'Gestionare utilizatori', icon: FaShieldAlt },
    { id: 'roles', name: 'Roluri', description: 'Gestionare roluri', icon: FaShieldAlt }
  ];

  // Available permissions with icons
  const permissions = [
    { id: 'read', name: 'Citire', description: 'Vizualizare date', icon: FaEye },
    { id: 'write', name: 'Scriere', description: 'Creare și editare', icon: FaEdit },
    { id: 'delete', name: 'Ștergere', description: 'Eliminare date', icon: FaTrash },
    { id: 'admin', name: 'Administrare', description: 'Acces complet', icon: FaCog }
  ];

  useEffect(() => {
    if (data) {
      setRoleData({
        name: data.name || '',
        description: data.description || '',
        permissions: data.permissions || {},
        ...data
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setRoleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (resourceId, permissionId, checked) => {
    setRoleData(prev => {
      const newPermissions = { ...prev.permissions };
      
      if (checked) {
        // Add permission if not already present
        if (!newPermissions[resourceId]) {
          newPermissions[resourceId] = [];
        }
        if (!newPermissions[resourceId].includes(permissionId)) {
          newPermissions[resourceId] = [...newPermissions[resourceId], permissionId];
        }
      } else {
        // Remove permission
        if (newPermissions[resourceId]) {
          newPermissions[resourceId] = newPermissions[resourceId].filter(p => p !== permissionId);
        }
      }
      
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  const hasPermission = (resourceId, permissionId) => {
    return roleData.permissions[resourceId]?.includes(permissionId) || false;
  };

  const toggleResource = (resourceId) => {
    setExpandedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roleData.name.trim()) {
      alert('Numele rolului este obligatoriu');
      return;
    }

    const processedData = {
      ...roleData,
      id: mode === 'create' ? Date.now() : roleData.id,
      createdAt: mode === 'create' ? new Date().toISOString() : roleData.createdAt,
      updatedAt: new Date().toISOString(),
      accountsCount: roleData.accountsCount || 0
    };

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(roleData);
    }
  };

  const getPermissionCount = (resourceId) => {
    return roleData.permissions[resourceId]?.length || 0;
  };

  return (
    <div className={styles.permissionsForm}>
      <div className={styles.scrollableContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Role Information */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nume Rol *</label>
            <input
              id="name"
              type="text"
              value={roleData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Introduceți numele rolului"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Descriere</label>
            <textarea
              id="description"
              value={roleData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrierea rolului și responsabilitățile acestuia"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Permissions Section */}
          <div className={styles.permissionsSection}>
            <h3>Permisiuni</h3>
            <p className={styles.permissionsDescription}>
              Selectați permisiunile pe care le va avea acest rol pentru fiecare resursă
            </p>

            <div className={styles.resourcesAccordion}>
              {resources.map(resource => {
                const ResourceIcon = resource.icon;
                const isExpanded = expandedResources.has(resource.id);
                const permissionCount = getPermissionCount(resource.id);
                
                return (
                  <div key={resource.id} className={styles.resourceAccordion}>
                    <div 
                      className={styles.resourceHeader}
                      onClick={() => toggleResource(resource.id)}
                    >
                      <div className={styles.resourceInfo}>
                        <ResourceIcon className={styles.resourceIcon} />
                        <div className={styles.resourceDetails}>
                          <span className={styles.resourceTitle}>{resource.name}</span>
                          <span className={styles.resourceDescription}>{resource.description}</span>
                        </div>
                      </div>
                      <div className={styles.resourceActions}>
                        {permissionCount > 0 && (
                          <span className={styles.permissionCount}>
                            {permissionCount} permisiuni
                          </span>
                        )}
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className={styles.permissionsCards}>
                        {permissions.map(permission => {
                          const PermissionIcon = permission.icon;
                          const isChecked = hasPermission(resource.id, permission.id);
                          
                          return (
                            <div 
                              key={permission.id} 
                              className={`${styles.permissionCard} ${isChecked ? styles.permissionCardActive : ''}`}
                              onClick={() => handlePermissionChange(resource.id, permission.id, !isChecked)}
                            >
                              <div className={styles.permissionCardHeader}>
                                <PermissionIcon className={styles.permissionIcon} />
                                <span className={styles.permissionName}>{permission.name}</span>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => handlePermissionChange(resource.id, permission.id, e.target.checked)}
                                  className={styles.permissionCheckbox}
                                  disabled={isLoading}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <p className={styles.permissionDescription}>{permission.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Form Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          <FaTimes /> Anulează
        </button>
        
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isLoading}
          >
            Șterge Rol
          </button>
        )}
        
        <button
          type="submit"
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isLoading}
        >
          <FaCheck /> {mode === 'create' ? 'Creează Rol' : 'Salvează Modificările'}
        </button>
      </div>
    </div>
  );
};

export default PermissionsForm; 