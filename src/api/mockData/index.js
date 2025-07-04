/**
 * Mock Data Module - Date mock pentru development și offline mode
 * Centralizează toate datele mock într-un singur loc pentru ușurință de gestionare
 * Updated to use separate files for better organization
 */

// Import business info mock
import { businessInfoMock, getBusinessInfo } from './businessInfoMock.js';

// Import timeline mock data
import { getTimelineMock, dentalTimelineMock, gymTimelineMock, hotelTimelineMock } from './timelineMock.js';

// Import other mock data
import { getClientsMock, clientsMock } from './clientsMock.js';
import { getServicesMock, servicesMock } from './servicesMock.js';
import { getSalesMock, salesMock } from './salesMock.js';
import { getInvoicesMock, invoicesMock } from './invoicesMock.js';
import { getStocksMock, stocksMock } from './stocksMock.js';
import { getMembersMock, membersMock } from './membersMock.js';
import { getAgentMock, agentMock } from './agentMock.js';
import { getHistoryMock, historyMock } from './historyMock.js';
import { getWorkflowsMock, workflowsMock } from './workflowsMock.js';
import { getReportsMock, reportsMock } from './reportsMock.js';
import { getRolesMock, rolesMock } from './rolesMock.js';
import { getPermissionsMock, permissionsMock } from './permissionsMock.js';
import { getUserDataMock, userDataMock } from './userDataMock.js';

/**
 * Utilitare pentru gestionarea tenant ID-ului
 */
export const tenantUtils = {
  /**
   * Obține tenant ID-ul din cookie
   */
  getTenantId() {
    const cookies = document.cookie.split(';');
    const tenantCookie = cookies.find(cookie => cookie.trim().startsWith('tenantId='));
    return tenantCookie ? tenantCookie.split('=')[1] : null;
  },

  /**
   * Setează tenant ID-ul în cookie
   */
  setTenantId(tenantId) {
    document.cookie = `tenantId=${tenantId}; path=/; max-age=86400`; // 24 ore
  },

  /**
   * Șterge tenant ID-ul din cookie
   */
  clearTenantId() {
    document.cookie = 'tenantId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

/**
 * Funcția principală pentru obținerea datelor mock
 */
export function getMockData(resource, businessType = null) {
  switch (resource) {
    case 'business-info':
      return getBusinessInfo(businessType || 'dental');
    
    case 'timeline':
      return getTimelineMock(businessType);
    
    case 'clients':
      return getClientsMock(businessType);
    
    case 'services':
    case 'packages':
      return getServicesMock(businessType);
    
    case 'invoices':
      return getInvoicesMock(businessType);
    
    case 'stocks':
      return getStocksMock(businessType);
    
    case 'members':
      return getMembersMock(businessType);
    
    case 'sales':
      return getSalesMock(businessType);
    
    case 'agent':
      return getAgentMock(businessType);
    
    case 'history':
      return getHistoryMock(businessType);
    
    case 'workflows':
      return getWorkflowsMock(businessType);
    
    case 'reports':
      return getReportsMock(businessType);
    
    case 'roles':
      return getRolesMock(businessType);
    
    case 'permissions':
      return getPermissionsMock(businessType);
    
    case 'userData':
      return getUserDataMock(businessType);
    
    default:
      console.warn(`No mock data available for resource: ${resource}`);
      return null;
  }
}

/**
 * Funcție pentru obținerea datelor mock cu tenant ID
 */
export function getMockDataWithTenant(resource, businessType = null) {
  const data = getMockData(resource, businessType);
  
  // Adaugă tenant ID dacă nu există
  if (data && typeof data === 'object' && !data.tenantId) {
    const tenantId = tenantUtils.getTenantId() || businessInfoMock.business.tenantId;
    return {
      ...data,
      tenantId
    };
  }
  
  return data;
}

export default {
  getMockData,
  getMockDataWithTenant,
  tenantUtils,
  businessInfoMock,
  dentalTimelineMock,
  gymTimelineMock,
  hotelTimelineMock,
  clientsMock,
  servicesMock,
  invoicesMock,
  stocksMock,
  membersMock,
  salesMock,
  agentMock,
  historyMock,
  workflowsMock,
  reportsMock,
  rolesMock,
  permissionsMock,
  userDataMock
}; 