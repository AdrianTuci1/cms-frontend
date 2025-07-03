/**
 * User Data Mock Data - Date mock pentru date utilizator
 */

// Mock data pentru userData
export const userDataMock = {
  id: 'user-001',
  name: 'User Mock',
  email: 'user@mockbusiness.ro',
  role: 'admin',
  profile: {
    avatar: null,
    preferences: {
      theme: 'light',
      language: 'ro'
    }
  }
};

/**
 * Funcție pentru obținerea datelor utilizator
 */
export function getUserDataMock(businessType = null) {
  return userDataMock;
}

export default {
  userDataMock,
  getUserDataMock
}; 