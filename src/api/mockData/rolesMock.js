/**
 * Roles Mock Data - Date mock pentru roluri
 */

// Mock data pentru roles
export const rolesMock = {
  id: 'roles-001',
  roles: [
    {
      id: 'role-001',
      name: 'Admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      active: true
    },
    {
      id: 'role-002',
      name: 'User',
      permissions: ['read', 'write'],
      active: true
    }
  ]
};

/**
 * Funcție pentru obținerea datelor roluri
 */
export function getRolesMock(businessType = null) {
  return rolesMock;
}

export default {
  rolesMock,
  getRolesMock
}; 