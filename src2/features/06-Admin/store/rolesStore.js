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

  const [roles] = useState([
    {
      id: 1,
      name: 'Administrator',
      description: 'Acces complet la toate funcționalitățile sistemului',
      accountsCount: 2
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Gestionare operațională și raportare',
      accountsCount: 3
    },
    {
      id: 3,
      name: 'Receptioner',
      description: 'Gestionare rezervări și relație cu clienții',
      accountsCount: 5
    },
    {
      id: 4,
      name: 'Cameristă',
      description: 'Gestionare camere și curățenie',
      accountsCount: 8
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
    
    // Actions
    addEmail,
    removeEmail,
    viewProfile,
    getEmailsForRole,
    getAllRoles
  };
};

export default useRolesStore; 