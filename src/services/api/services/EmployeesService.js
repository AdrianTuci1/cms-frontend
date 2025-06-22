import BaseApiService from './BaseApiService.js';
import { employeesSectionGeneral, availableRolesGeneral, employeesRolesSectionGeneral } from '../../../data/dataModel/employeesSectionData.js';

/**
 * Employees Service
 * Handles employee-related API operations
 */
class EmployeesService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
  }

  /**
   * Get all employees with pagination and optional search
   * @param {Object} pagination - Pagination parameters (page, limit, search)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated employees
   */
  async getEmployees(pagination = {}, options = {}) {
    return this.getPaginated('employees', pagination, options);
  }

  /**
   * Get employee by ID
   * @param {number} employeeId - Employee ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Employee data
   */
  async getEmployee(employeeId, options = {}) {
    return this.getById('employees', employeeId, options);
  }

  /**
   * Create a new employee
   * @param {Object} employeeData - Employee data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created employee
   */
  async createEmployee(employeeData, options = {}) {
    return this.create('employees', employeeData, options);
  }

  /**
   * Update an existing employee
   * @param {number} employeeId - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated employee
   */
  async updateEmployee(employeeId, employeeData, options = {}) {
    return this.update('employees', employeeId, employeeData, options);
  }

  /**
   * Delete an employee
   * @param {number} employeeId - Employee ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEmployee(employeeId, options = {}) {
    return this.remove('employees', employeeId, options);
  }

  /**
   * Search employees by name or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchEmployees(searchTerm, options = {}) {
    return this.search('employees', searchTerm, options);
  }

  /**
   * Get available roles (permissions)
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Roles data
   */
  async getAvailableRoles(options = {}) {
    return this.get('employees/roles', options);
  }

  /**
   * Get employees roles section (roles + permissions by role)
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Roles section data
   */
  async getEmployeesRolesSection(options = {}) {
    return this.get('employees/roles-section', options);
  }

  /**
   * Get demo data for employees endpoints
   * @param {string} endpointKey - Endpoint key
   * @returns {*} Demo data
   */
  getDemoData(endpointKey) {
    switch (endpointKey) {
      case 'employees':
        return employeesSectionGeneral;
      case 'employees/roles':
        return availableRolesGeneral;
      case 'employees/roles-section':
        return employeesRolesSectionGeneral;
      default:
        return employeesSectionGeneral;
    }
  }
}

export default EmployeesService; 