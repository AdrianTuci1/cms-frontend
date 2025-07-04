/**
 * Roles Store - Store pentru gestionarea rolurilor și emailurilor asociate
 * Gestionează rolurile de staff și emailurile asociate fiecărui rol
 */

import { useState, useCallback } from 'react';

/**
 * Hook principal pentru Roles Store
 * @returns {Object} State-ul și funcțiile pentru gestionarea rolurilor
 */
const useRolesStore = () => {
  // State pentru roluri și emailuri
  const [staffEmails, setStaffEmails] = useState({
    manager: ['manager@example.com'],
    receptioner: ['receptioner@example.com'],
    camerista: ['camerista@example.com']
  });

  // Available resources for permissions
  const [resources] = useState([
    { id: 'clients', name: 'Clienți', description: 'Gestionare clienți' },
    { id: 'appointments', name: 'Programări', description: 'Gestionare programări' },
    { id: 'services', name: 'Servicii', description: 'Gestionare servicii' },
    { id: 'invoices', name: 'Facturi', description: 'Gestionare facturi' },
    { id: 'reports', name: 'Rapoarte', description: 'Vizualizare rapoarte' },
    { id: 'settings', name: 'Setări', description: 'Configurare sistem' },
    { id: 'users', name: 'Utilizatori', description: 'Gestionare utilizatori' },
    { id: 'roles', name: 'Roluri', description: 'Gestionare roluri' }
  ]);

  // Available permissions
  const [permissions] = useState([
    { id: 'read', name: 'Citire', description: 'Vizualizare date' },
    { id: 'write', name: 'Scriere', description: 'Creare și editare' },
    { id: 'delete', name: 'Ștergere', description: 'Eliminare date' },
    { id: 'admin', name: 'Administrare', description: 'Acces complet' }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      description: 'Acces complet la toate funcționalitățile sistemului',
      accountsCount: 2,
      permissions: {
        clients: ['read', 'write', 'delete', 'admin'],
        appointments: ['read', 'write', 'delete', 'admin'],
        services: ['read', 'write', 'delete', 'admin'],
        invoices: ['read', 'write', 'delete', 'admin'],
        reports: ['read', 'write', 'delete', 'admin'],
        settings: ['read', 'write', 'delete', 'admin'],
        users: ['read', 'write', 'delete', 'admin'],
        roles: ['read', 'write', 'delete', 'admin']
      }
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Gestionare operațională și raportare',
      accountsCount: 3,
      permissions: {
        clients: ['read', 'write'],
        appointments: ['read', 'write'],
        services: ['read', 'write'],
        invoices: ['read', 'write'],
        reports: ['read', 'write'],
        settings: ['read'],
        users: ['read'],
        roles: ['read']
      }
    },
    {
      id: 3,
      name: 'Receptioner',
      description: 'Gestionare rezervări și relație cu clienții',
      accountsCount: 5,
      permissions: {
        clients: ['read', 'write'],
        appointments: ['read', 'write'],
        services: ['read'],
        invoices: ['read', 'write'],
        reports: ['read'],
        settings: ['read'],
        users: [],
        roles: []
      }
    },
    {
      id: 4,
      name: 'Cameristă',
      description: 'Gestionare camere și curățenie',
      accountsCount: 8,
      permissions: {
        clients: ['read'],
        appointments: ['read'],
        services: ['read'],
        invoices: ['read'],
        reports: ['read'],
        settings: ['read'],
        users: [],
        roles: []
      }
    }
  ]);

  /**
   * Adaugă un email la un rol specific
   */
  const addEmail = useCallback((role, email) => {
    setStaffEmails(prev => ({
      ...prev,
      [role]: [...prev[role], email]
    }));
  }, []);

  /**
   * Elimină un email de la un rol specific
   */
  const removeEmail = useCallback((role, email) => {
    setStaffEmails(prev => ({
      ...prev,
      [role]: prev[role].filter(e => e !== email)
    }));
  }, []);

  /**
   * Vizualizează profilul unui membru
   */
  const viewProfile = useCallback((email) => {
    // TODO: Implement view profile functionality
    console.log('View profile for:', email);
  }, []);

  /**
   * Actualizează permisiunile pentru un rol și resursă
   */
  const updateRolePermission = useCallback((roleId, resourceId, permissionId, checked) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = { ...role.permissions };
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
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  }, []);

  /**
   * Verifică dacă un rol are o anumită permisiune pentru o resursă
   */
  const hasPermission = useCallback((roleId, resourceId, permissionId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions[resourceId]?.includes(permissionId) || false;
  }, [roles]);

  /**
   * Obține toate emailurile pentru un rol specific
   */
  const getEmailsForRole = useCallback((role) => {
    return staffEmails[role] || [];
  }, [staffEmails]);

  /**
   * Obține toate rolurile
   */
  const getAllRoles = useCallback(() => {
    return roles;
  }, [roles]);

  return {
    // State
    staffEmails,
    roles,
    resources,
    permissions,
    
    // Actions
    addEmail,
    removeEmail,
    viewProfile,
    updateRolePermission,
    hasPermission,
    getEmailsForRole,
    getAllRoles
  };
};

export default useRolesStore; 