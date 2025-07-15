/**
 * Mock Data Module - Date mock pentru development și offline mode
 * Centralizează toate datele mock într-un singur loc pentru ușurință de gestionare
 * Updated to use tenant-based organization with business type directories
 * Following sharded database architecture with composed keys
 */

// Import business info mock
import { 
  businessInfoMock, 
  getBusinessInfo, 
  getBusinessInfoByType,
  getTenantIdByType,
  getBusinessTypeByTenant,
  getDefaultLocation,
  TENANT_CONFIG 
} from './businessInfoMock.js';

// Import business type specific mock data
import { 
  getDentalClientsMock, 
  getDentalClientById, 
  getDentalClientsByLocation,
  getDentalClientsArray
} from './dental/clientsMock.js';

import { 
  getDentalServicesMock,
  getDentalServiceById,
  getDentalServicesByLocation,
  getDentalServicesByCategory,
  getDentalServicesByInsurance
} from './dental/servicesMock.js';

import { 
  getGymClientsMock, 
  getGymClientById, 
  getGymClientsByLocation,
  getGymClientsByMembershipType,
  getGymClientsArray
} from './gym/clientsMock.js';

import { 
  getHotelClientsMock, 
  getHotelClientById, 
  getHotelClientsByLocation,
  getHotelClientsByRoomType,
  getHotelClientsByLoyaltyTier,
  getHotelClientsArray
} from './hotel/clientsMock.js';

// Import legacy mock data (to be migrated)
import { getTimelineMock, dentalTimelineMock, gymTimelineMock, hotelTimelineMock } from './timelineMock.js';
import { getServicesMock, servicesMock, dentalServicesMock, gymServicesMock, hotelServicesMock } from './servicesMock.js';
import { getSalesMock, salesMock } from './salesMock.js';
import { getInvoicesMock, invoicesMock } from './invoicesMock.js';
import { getStocksMock, stocksMock } from './stocksMock.js';
import { getMembersMock, membersMock, dentalMembersMock, gymMembersMock, hotelMembersMock } from './membersMock.js';
import { getAgentMock, agentMock } from './agentMock.js';
import { getHistoryMock, historyMock } from './historyMock.js';
import { getWorkflowsMock, workflowsMock } from './workflowsMock.js';
import { getReportsMock, reportsMock } from './reportsMock.js';
import { getRolesMock, rolesMock } from './rolesMock.js';
import { getPermissionsMock, permissionsMock } from './permissionsMock.js';
import { getUserDataMock, userDataMock } from './userDataMock.js';

// Import tenant utilities
import { resourceUtils } from '../../config/tenant.js';

/**
 * Utilitare pentru gestionarea tenant ID-ului
 */
export const tenantUtils = {
  /**
   * Obține tenant ID-ul din environment variables
   */
  getTenantId() {
    return import.meta.env.VITE_TENANT_ID || 'T0001';
  },

  /**
   * Obține business type-ul din environment variables
   */
  getBusinessType() {
    return import.meta.env.VITE_BUSINESS_TYPE || 'dental';
  },

  /**
   * Obține tenant ID-ul din cookie (fallback)
   */
  getTenantIdFromCookie() {
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
  },

  /**
   * Obține locația implicită pentru tenant
   */
  getDefaultLocationId(tenantId = null) {
    const currentTenantId = tenantId || this.getTenantId();
    const businessInfo = getBusinessInfo(currentTenantId);
    const defaultLocation = businessInfo.locations.find(location => location.isDefault);
    return defaultLocation ? defaultLocation.id : businessInfo.locations[0]?.id;
  },

  /**
   * Validează dacă un tenant ID este valid
   */
  isValidTenantId(tenantId) {
    return Object.keys(TENANT_CONFIG).includes(tenantId);
  },

  /**
   * Obține toate locațiile pentru un tenant
   */
  getLocations(tenantId = null) {
    const currentTenantId = tenantId || this.getTenantId();
    const businessInfo = getBusinessInfo(currentTenantId);
    return businessInfo.locations || [];
  }
};

/**
 * Funcția principală pentru obținerea datelor mock cu tenant management
 * Returns sharded documents following the database architecture
 */
export function getMockData(resource, tenantId = null, locationId = null) {
  const currentTenantId = tenantId || tenantUtils.getTenantId();
  const currentLocationId = locationId || tenantUtils.getDefaultLocationId(currentTenantId);
  const businessType = getBusinessTypeByTenant(currentTenantId);

  switch (resource) {
    case 'business-info':
      return getBusinessInfo(currentTenantId);
    
    case 'clients':
      switch (businessType) {
        case 'dental':
          return getDentalClientsMock(currentTenantId, currentLocationId);
        case 'gym':
          return getGymClientsMock(currentTenantId, currentLocationId);
        case 'hotel':
          return getHotelClientsMock(currentTenantId, currentLocationId);
        default:
          return getDentalClientsMock(currentTenantId, currentLocationId);
      }
    
    case 'services':
    case 'packages':
      switch (businessType) {
        case 'dental':
          return getDentalServicesMock(currentTenantId, currentLocationId);
        case 'gym':
          return getServicesMock(businessType); // Legacy for now
        case 'hotel':
          return getServicesMock(businessType); // Legacy for now
        default:
          return getDentalServicesMock(currentTenantId, currentLocationId);
      }
    
    // Legacy resources (to be migrated to business type directories)
    case 'timeline':
      return getTimelineMock(businessType);
    
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
 * Funcție pentru obținerea datelor mock ca array simplu (legacy compatibility)
 * Returns just the data array from sharded documents
 */
export function getMockDataArray(resource, tenantId = null, locationId = null) {
  const document = getMockData(resource, tenantId, locationId);
  
  if (!document) {
    return null;
  }
  
  // If it's already a sharded document, extract the data
  if (resourceUtils.isShardedDocument(document)) {
    return document.data;
  }
  
  // For legacy resources, return as is
  return document;
}

/**
 * Funcție pentru obținerea datelor mock cu tenant ID (legacy compatibility)
 */
export function getMockDataWithTenant(resource, businessType = null) {
  const tenantId = businessType ? getTenantIdByType(businessType) : tenantUtils.getTenantId();
  return getMockData(resource, tenantId);
}

/**
 * Funcție pentru obținerea unui client specific după ID și tenant
 */
export function getClientById(clientId, tenantId = null) {
  const currentTenantId = tenantId || tenantUtils.getTenantId();
  const businessType = getBusinessTypeByTenant(currentTenantId);

  switch (businessType) {
    case 'dental':
      return getDentalClientById(clientId, currentTenantId);
    case 'gym':
      return getGymClientById(clientId, currentTenantId);
    case 'hotel':
      return getHotelClientById(clientId, currentTenantId);
    default:
      return getDentalClientById(clientId, currentTenantId);
  }
}

/**
 * Funcție pentru obținerea clienților după locație și tenant
 */
export function getClientsByLocation(locationId, tenantId = null) {
  const currentTenantId = tenantId || tenantUtils.getTenantId();
  const businessType = getBusinessTypeByTenant(currentTenantId);

  switch (businessType) {
    case 'dental':
      return getDentalClientsByLocation(locationId, currentTenantId);
    case 'gym':
      return getGymClientsByLocation(locationId, currentTenantId);
    case 'hotel':
      return getHotelClientsByLocation(locationId, currentTenantId);
    default:
      return getDentalClientsByLocation(locationId, currentTenantId);
  }
}

/**
 * Funcție pentru obținerea datelor mock ca array de clienți (legacy compatibility)
 */
export function getClientsArray(tenantId = null, locationId = null) {
  const currentTenantId = tenantId || tenantUtils.getTenantId();
  const businessType = getBusinessTypeByTenant(currentTenantId);

  switch (businessType) {
    case 'dental':
      return getDentalClientsArray(currentTenantId, locationId);
    case 'gym':
      return getGymClientsArray(currentTenantId, locationId);
    case 'hotel':
      return getHotelClientsArray(currentTenantId, locationId);
    default:
      return getDentalClientsArray(currentTenantId, locationId);
  }
}

// Export legacy functions for backward compatibility
export {
  getDentalClientsMock,
  getDentalClientById,
  getDentalClientsByLocation,
  getDentalClientsArray,
  getGymClientsMock,
  getGymClientById,
  getGymClientsByLocation,
  getGymClientsArray,
  getHotelClientsMock,
  getHotelClientById,
  getHotelClientsByLocation,
  getHotelClientsArray
}; 