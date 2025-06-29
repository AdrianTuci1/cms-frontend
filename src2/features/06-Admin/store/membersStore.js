/**
 * Members Store - Store pentru gestionarea membrilor staff
 * Gestionează informațiile despre membrii staff și operațiunile asociate
 */

import { useState, useCallback } from 'react';

/**
 * Hook principal pentru Members Store
 * @returns {Object} State-ul și funcțiile pentru gestionarea membrilor
 */
const useMembersStore = () => {
  // State pentru membri
  const [members, setMembers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '0712 345 678',
      role: 'Manager', 
      workDays: [0, 1, 2, 3, 4], // Monday to Friday
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '0723 456 789',
      role: 'Receptioner', 
      workDays: [1, 3, 5, 6], // Tuesday, Thursday, Saturday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      phone: '0734 567 890',
      role: 'Camerista', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
  ]);

  /**
   * Adaugă un nou membru
   */
  const addMember = useCallback((member) => {
    const newMember = {
      ...member,
      id: Date.now(), // Simple ID generation
      photoUrl: member.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    setMembers(prev => [...prev, newMember]);
  }, []);

  /**
   * Actualizează un membru existent
   */
  const updateMember = useCallback((id, updates) => {
    setMembers(prev => prev.map(member =>
      member.id === id ? { ...member, ...updates } : member
    ));
  }, []);

  /**
   * Elimină un membru
   */
  const removeMember = useCallback((id) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  }, []);

  /**
   * Obține un membru după ID
   */
  const getMemberById = useCallback((id) => {
    return members.find(member => member.id === id);
  }, [members]);

  /**
   * Obține toți membrii
   */
  const getAllMembers = useCallback(() => {
    return members;
  }, [members]);

  /**
   * Obține membrii după rol
   */
  const getMembersByRole = useCallback((role) => {
    return members.filter(member => member.role === role);
  }, [members]);

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
    const errors = [];
    
    if (!member.name || member.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      errors.push('Valid email is required');
    }
    
    if (!member.phone || member.phone.trim().length < 10) {
      errors.push('Valid phone number is required');
    }
    
    if (!member.role) {
      errors.push('Role is required');
    }
    
    if (!member.workDays || member.workDays.length === 0) {
      errors.push('At least one work day must be selected');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    // State
    members,
    
    // Actions
    addMember,
    updateMember,
    removeMember,
    getMemberById,
    getAllMembers,
    getMembersByRole,
    getDayPill,
    validateMember
  };
};

export default useMembersStore;
