import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import styles from './PermissionsForm.module.css';

const PermissionsForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const [roleData, setRoleData] = useState({
    name: '',
    description: '',
    permissions: {},
    ...data
  });

  // Available resources for permissions
  const resources = [
    { id: 'clients', name: 'Clienți', description: 'Gestionare clienți' },
    { id: 'appointments', name: 'Programări', description: 'Gestionare programări' },
    { id: 'services', name: 'Servicii', description: 'Gestionare servicii' },
    { id: 'invoices', name: 'Facturi', description: 'Gestionare facturi' },
    { id: 'reports', name: 'Rapoarte', description: 'Vizualizare rapoarte' },
    { id: 'settings', name: 'Setări', description: 'Configurare sistem' },
    { id: 'users', name: 'Utilizatori', description: 'Gestionare utilizatori' },
    { id: 'roles', name: 'Roluri', description: 'Gestionare roluri' }
  ];

  // Available permissions
  const permissions = [
    { id: 'read', name: 'Citire', description: 'Vizualizare date' },
    { id: 'write', name: 'Scriere', description: 'Creare și editare' },
    { id: 'delete', name: 'Ștergere', description: 'Eliminare date' },
    { id: 'admin', name: 'Administrare', description: 'Acces complet' }
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

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Role Information */}
        <div className={styles.basicInfo}>
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
        </div>

        {/* Permissions Section */}
        <div className={styles.permissionsSection}>
          <h3>Permisiuni</h3>
          <p className={styles.permissionsDescription}>
            Selectați permisiunile pe care le va avea acest rol pentru fiecare resursă
          </p>

          <div className={styles.permissionsGrid}>
            <div className={styles.permissionsHeader}>
              <div className={styles.resourceHeader}>Resursă</div>
              {permissions.map(permission => (
                <div key={permission.id} className={styles.permissionHeader}>
                  <span className={styles.permissionName}>{permission.name}</span>
                  <span className={styles.permissionTooltip}>{permission.description}</span>
                </div>
              ))}
            </div>
            
            {resources.map(resource => (
              <div key={resource.id} className={styles.permissionRow}>
                <div className={styles.resourceName}>
                  <span className={styles.resourceTitle}>{resource.name}</span>
                  <span className={styles.resourceDescription}>{resource.description}</span>
                  {getPermissionCount(resource.id) > 0 && (
                    <span className={styles.permissionCount}>
                      {getPermissionCount(resource.id)} permisiuni
                    </span>
                  )}
                </div>
                {permissions.map(permission => (
                  <div key={permission.id} className={styles.permissionCell}>
                    <input
                      type="checkbox"
                      checked={hasPermission(resource.id, permission.id)}
                      onChange={(e) => handlePermissionChange(resource.id, permission.id, e.target.checked)}
                      className={styles.permissionCheckbox}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
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
            className={styles.submitButton}
            disabled={isLoading}
          >
            <FaCheck /> {mode === 'create' ? 'Creează Rol' : 'Salvează Modificările'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PermissionsForm; 