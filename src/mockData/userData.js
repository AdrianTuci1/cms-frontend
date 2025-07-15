/**
 * User Data Mock
 * 
 * Date despre utilizatorul curent pentru demo mode
 * Include informații de profil, permisiuni și preferințe
 */

export const DEMO_USERS = {
  dental: {
    id: 'user-001',
    name: 'Dr. Elena Popescu',
    email: 'elena.popescu@demodental.ro',
    role: 'doctor',
    avatar: null,
    businessType: 'dental',
    tenantId: 'T0001',
    locationId: 'T0001-01',
    profile: {
      firstName: 'Elena',
      lastName: 'Popescu',
      title: 'Dr.',
      specialization: 'General Dentistry',
      phone: '+40 123 456 789',
      department: 'Dental Operations',
      employeeId: 'EMP-001',
      hireDate: '2020-03-15',
      licenseNumber: 'MD-12345',
      emergencyContact: {
        name: 'Ion Popescu',
        phone: '+40 123 456 700',
        relationship: 'spouse'
      }
    },
    permissions: [
      'read:all',
      'write:appointments',
      'write:treatments',
      'write:clients',
      'read:reports',
      'manage:timeline',
      'access:aiAssistant'
    ],
    roles: ['doctor', 'staff'],
    preferences: {
      theme: 'light',
      language: 'ro',
      timezone: 'Europe/Bucharest',
      notifications: {
        email: true,
        sms: false,
        push: true,
        appointmentReminders: true,
        systemUpdates: false
      },
      dashboard: {
        defaultView: 'timeline',
        showPatientPhotos: true,
        compactMode: false
      }
    },
    workSchedule: {
      monday: { start: '08:00', end: '18:00', break: '12:00-13:00' },
      tuesday: { start: '08:00', end: '18:00', break: '12:00-13:00' },
      wednesday: { start: '08:00', end: '18:00', break: '12:00-13:00' },
      thursday: { start: '08:00', end: '18:00', break: '12:00-13:00' },
      friday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
      saturday: { start: '09:00', end: '13:00', break: null },
      sunday: { start: null, end: null, break: null }
    },
    statistics: {
      totalPatients: 156,
      appointmentsThisMonth: 78,
      completedTreatments: 234,
      patientSatisfaction: 4.8
    }
  },

  gym: {
    id: 'user-002',
    name: 'Alex Ionescu',
    email: 'alex.ionescu@demofitness.ro',
    role: 'trainer',
    avatar: null,
    businessType: 'gym',
    tenantId: 'T0002',
    locationId: 'T0002-01',
    profile: {
      firstName: 'Alex',
      lastName: 'Ionescu',
      title: 'Personal Trainer',
      specialization: 'Strength Training',
      phone: '+40 123 456 788',
      department: 'Fitness Operations',
      employeeId: 'EMP-002',
      hireDate: '2021-06-10',
      certifications: ['NASM-CPT', 'ACSM', 'Nutrition Specialist'],
      emergencyContact: {
        name: 'Maria Ionescu',
        phone: '+40 123 456 701',
        relationship: 'sister'
      }
    },
    permissions: [
      'read:all',
      'write:members',
      'write:classes',
      'write:workouts',
      'read:reports',
      'manage:timeline'
    ],
    roles: ['trainer', 'staff'],
    preferences: {
      theme: 'dark',
      language: 'ro',
      timezone: 'Europe/Bucharest',
      notifications: {
        email: true,
        sms: true,
        push: true,
        classReminders: true,
        memberUpdates: true
      },
      dashboard: {
        defaultView: 'classes',
        showMemberProgress: true,
        compactMode: true
      }
    },
    workSchedule: {
      monday: { start: '06:00', end: '14:00', break: '10:00-10:30' },
      tuesday: { start: '14:00', end: '22:00', break: '18:00-18:30' },
      wednesday: { start: '06:00', end: '14:00', break: '10:00-10:30' },
      thursday: { start: '14:00', end: '22:00', break: '18:00-18:30' },
      friday: { start: '06:00', end: '14:00', break: '10:00-10:30' },
      saturday: { start: '08:00', end: '16:00', break: '12:00-12:30' },
      sunday: { start: null, end: null, break: null }
    },
    statistics: {
      totalMembers: 89,
      classesThisMonth: 45,
      personalSessions: 124,
      memberRetention: 92
    }
  },

  hotel: {
    id: 'user-003',
    name: 'Andreea Dumitrescu',
    email: 'andreea.dumitrescu@demohotel.ro',
    role: 'manager',
    avatar: null,
    businessType: 'hotel',
    tenantId: 'T0003',
    locationId: 'T0003-01',
    profile: {
      firstName: 'Andreea',
      lastName: 'Dumitrescu',
      title: 'Front Desk Manager',
      specialization: 'Hotel Operations',
      phone: '+40 123 456 787',
      department: 'Hotel Operations',
      employeeId: 'EMP-003',
      hireDate: '2019-09-20',
      languages: ['Romanian', 'English', 'French'],
      emergencyContact: {
        name: 'Radu Dumitrescu',
        phone: '+40 123 456 702',
        relationship: 'husband'
      }
    },
    permissions: [
      'read:all',
      'write:all',
      'manage:reservations',
      'manage:rooms',
      'manage:staff',
      'read:reports',
      'manage:timeline'
    ],
    roles: ['manager', 'staff'],
    preferences: {
      theme: 'light',
      language: 'ro',
      timezone: 'Europe/Bucharest',
      notifications: {
        email: true,
        sms: true,
        push: true,
        reservationAlerts: true,
        guestRequests: true,
        systemUpdates: true
      },
      dashboard: {
        defaultView: 'reservations',
        showOccupancyRate: true,
        compactMode: false
      }
    },
    workSchedule: {
      monday: { start: '07:00', end: '15:00', break: '11:00-11:30' },
      tuesday: { start: '15:00', end: '23:00', break: '19:00-19:30' },
      wednesday: { start: '07:00', end: '15:00', break: '11:00-11:30' },
      thursday: { start: '15:00', end: '23:00', break: '19:00-19:30' },
      friday: { start: '07:00', end: '15:00', break: '11:00-11:30' },
      saturday: { start: '09:00', end: '17:00', break: '13:00-13:30' },
      sunday: { start: null, end: null, break: null }
    },
    statistics: {
      totalGuests: 234,
      averageStay: 2.3,
      occupancyRate: 78,
      guestSatisfaction: 4.6
    }
  }
};

/**
 * Utilizator demo general (ca fallback)
 */
export const DEFAULT_DEMO_USER = {
  id: 'user-demo',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  avatar: null,
  businessType: 'general',
  tenantId: 'T0001',
  locationId: 'T0001-01',
  profile: {
    firstName: 'Demo',
    lastName: 'User',
    title: 'Staff',
    phone: '+40 123 456 000',
    department: 'General'
  },
  permissions: ['read:all'],
  roles: ['user'],
  preferences: {
    theme: 'light',
    language: 'ro',
    timezone: 'Europe/Bucharest',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  }
};

/**
 * Obține datele utilizatorului curent pentru demo mode
 * @param {string} businessType - Tipul de business
 * @returns {Object} Datele utilizatorului
 */
export function getCurrentDemoUser(businessType = 'dental') {
  return DEMO_USERS[businessType] || DEFAULT_DEMO_USER;
}

/**
 * Obține permisiunile utilizatorului curent
 * @param {string} businessType - Tipul de business
 * @returns {Array} Lista de permisiuni
 */
export function getCurrentUserPermissions(businessType = 'dental') {
  const user = getCurrentDemoUser(businessType);
  return user.permissions || [];
}

/**
 * Verifică dacă utilizatorul are o anumită permisiune
 * @param {string} permission - Permisiunea de verificat
 * @param {string} businessType - Tipul de business
 * @returns {boolean} True dacă are permisiunea
 */
export function hasPermission(permission, businessType = 'dental') {
  const permissions = getCurrentUserPermissions(businessType);
  return permissions.includes(permission) || permissions.includes('write:all') || permissions.includes('read:all');
}

/**
 * Obține rolurile utilizatorului curent
 * @param {string} businessType - Tipul de business
 * @returns {Array} Lista de roluri
 */
export function getCurrentUserRoles(businessType = 'dental') {
  const user = getCurrentDemoUser(businessType);
  return user.roles || [];
}

/**
 * Verifică dacă utilizatorul are un anumit rol
 * @param {string} role - Rolul de verificat
 * @param {string} businessType - Tipul de business
 * @returns {boolean} True dacă are rolul
 */
export function hasRole(role, businessType = 'dental') {
  const roles = getCurrentUserRoles(businessType);
  return roles.includes(role);
} 