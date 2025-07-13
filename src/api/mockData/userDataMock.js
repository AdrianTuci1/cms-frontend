/**
 * User Data Mock Data - Date mock pentru date utilizator
 * Aceste date ar fi returnate de backend la autentificare și stocate în JWT token
 */

// Mock data pentru userData - structura returnată de backend la autentificare
export const userDataMock = {
  id: 'user-001',
  email: 'john.doe@example.com',
  name: 'John Doe',
  businessType: 'dental',
  roles: ['manager'],
  permissions: ['read:all', 'write:all', 'manage:users'],
  // Date suplimentare care ar putea fi returnate de /api/userData
  profile: {
    phone: '+40 123 456 789',
    avatar: null,
    location: 'Bucharest, Romania',
    department: 'Operations',
    lastLogin: '2024-01-15 09:30 AM',
    preferences: {
      theme: 'light',
      language: 'ro',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }
};

/**
 * Funcție pentru obținerea datelor utilizator
 * Simulează datele returnate de backend la autentificare
 */
export function getUserDataMock(businessType = null) {
  // Personalizează datele în funcție de business type
  if (businessType === 'dental') {
    return {
      ...userDataMock,
      businessType: 'dental',
      roles: ['dental_manager'],
      permissions: ['read:all', 'write:all', 'manage:appointments', 'manage:clients'],
      profile: {
        ...userDataMock.profile,
        department: 'Dental Operations',
        location: 'Bucharest, Romania'
      }
    };
  } else if (businessType === 'gym') {
    return {
      ...userDataMock,
      businessType: 'gym',
      roles: ['gym_manager'],
      permissions: ['read:all', 'write:all', 'manage:members', 'manage:packages'],
      profile: {
        ...userDataMock.profile,
        department: 'Fitness Operations',
        location: 'Bucharest, Romania'
      }
    };
  } else if (businessType === 'hotel') {
    return {
      ...userDataMock,
      businessType: 'hotel',
      roles: ['hotel_manager'],
      permissions: ['read:all', 'write:all', 'manage:bookings', 'manage:rooms'],
      profile: {
        ...userDataMock.profile,
        department: 'Hospitality Operations',
        location: 'Bucharest, Romania'
      }
    };
  }
  
  return userDataMock;
}

/**
 * Funcție pentru obținerea datelor de bază din JWT token
 * Acestea sunt datele minime returnate la autentificare
 */
export function getAuthUserInfo(businessType = null) {
  const userData = getUserDataMock(businessType);
  
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    businessType: userData.businessType,
    roles: userData.roles,
    permissions: userData.permissions
  };
}

export default {
  userDataMock,
  getUserDataMock,
  getAuthUserInfo
}; 