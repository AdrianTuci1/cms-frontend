/**
 * Permissions Mock Data - Date mock pentru permisiuni
 */

// Mock data pentru permissions
export const permissionsMock = {
  id: 'permissions-001',
  permissions: [
    {
      id: 'perm-001',
      name: 'read',
      description: 'Can read data',
      roleId: 'role-001'
    },
    {
      id: 'perm-002',
      name: 'write',
      description: 'Can write data',
      roleId: 'role-001'
    }
  ]
};

/**
 * Funcție pentru obținerea datelor permisiuni
 */
export function getPermissionsMock(businessType = null) {
  return permissionsMock;
}

export default {
  permissionsMock,
  getPermissionsMock
}; 