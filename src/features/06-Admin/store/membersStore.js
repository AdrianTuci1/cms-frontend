/**
 * Members Store - Store pentru gestionarea membrilor staff
 * Gestionează logica de business pentru membrii staff și operațiunile asociate
 */

import { useCallback } from 'react';
import { useBusinessLogic } from '../../../design-patterns/hooks';
import { eventBus } from '../../../design-patterns/observer/base/EventBus';

/**
 * Hook principal pentru Members Store
 * @param {string} businessType - Tipul de business
 * @param {Array} memberItems - Lista de membri din useDataSync
 * @returns {Object} State-ul și funcțiile pentru gestionarea membrilor
 */
const useMembersStore = (businessType = 'hotel', memberItems = []) => {
  // Folosește business logic pentru validare și procesare
  const businessLogic = useBusinessLogic(businessType);

  /**
   * Adaugă un nou membru
   */
  const addMember = useCallback(async (member) => {
    try {
      // Validează datele folosind business logic
      const validation = businessLogic.validateData(member, 'members');
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('createMember', member)) {
        console.error('Operation not allowed');
        return;
      }

      // Procesează datele folosind business logic
      const processedData = businessLogic.processData(member, 'members');
      
      // Emite eveniment pentru crearea membru
      eventBus.emit('members:create', processedData);
      
      console.log('✅ Member created successfully');
      
    } catch (error) {
      console.error('❌ Failed to create member:', error.message);
    }
  }, [businessLogic]);

  /**
   * Actualizează un membru existent
   */
  const updateMember = useCallback(async (id, updates) => {
    try {
      // Validează datele folosind business logic
      const validation = businessLogic.validateData(updates, 'members');
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('updateMember', updates)) {
        console.error('Operation not allowed');
        return;
      }

      // Procesează datele folosind business logic
      const processedData = businessLogic.processData({ id, ...updates }, 'members');
      
      // Emite eveniment pentru actualizarea membru
      eventBus.emit('members:update', processedData);
      
      console.log('✅ Member updated successfully');

    } catch (error) {
      console.error('❌ Failed to update member:', error.message);
    }
  }, [businessLogic]);

  /**
   * Elimină un membru
   */
  const removeMember = useCallback(async (id) => {
    try {
      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('deleteMember', { id })) {
        console.error('Operation not allowed');
        return;
      }

      // Emite eveniment pentru ștergerea membru
      eventBus.emit('members:delete', { id });
      
      console.log('✅ Member deleted successfully');

    } catch (error) {
      console.error('❌ Failed to delete member:', error.message);
    }
  }, [businessLogic]);

  /**
   * Obține un membru după ID
   */
  const getMemberById = useCallback((id) => {
    return memberItems.find(member => member.id === id);
  }, [memberItems]);

  /**
   * Obține toți membrii
   */
  const getAllMembers = useCallback(() => {
    return memberItems;
  }, [memberItems]);

  /**
   * Obține membrii după rol
   */
  const getMembersByRole = useCallback((role) => {
    return memberItems.filter(member => member.role === role);
  }, [memberItems]);

  /**
   * Obține zilele de lucru ca string
   */
  const getDayPill = useCallback((day) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day];
  }, []);

  /**
   * Validează datele unui membru
   */
  const validateMember = useCallback((member) => {
    return businessLogic.validateData(member, 'members');
  }, [businessLogic]);

  return {
    // Data (from useDataSync)
    members: memberItems,
    
    // Actions
    addMember,
    updateMember,
    removeMember,
    getMemberById,
    getAllMembers,
    getMembersByRole,
    getDayPill,
    validateMember,
    
    // Business logic
    businessLogic
  };
};

export default useMembersStore;
