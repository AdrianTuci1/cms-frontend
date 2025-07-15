/**
 * Hotel Clients Mock Data
 * 
 * Mock data for hotel clients (guests) with tenant and location management
 * Following sharded database architecture with composed keys
 */

// Import comprehensive test data from testData
import clientsTestData from '../../../testData/clients/clients-test-data.json';
import { resourceUtils } from '../../../config/tenant.js';

// Base clients data
const baseClientsData = clientsTestData.response.data;

// Hotel clients (guests) with sharded document structure
export const hotelClientsMock = resourceUtils.generateShardedDocument(
  'T0003',
  'T0003-01',
  'CLIENTS',
  baseClientsData.clients.map((client, index) => ({
    ...client,
    id: `T0003-01-CLIENT-${String(index + 1).padStart(3, '0')}`,
    tenantId: 'T0003',
    locationId: 'T0003-01', // Default location
    type: 'guest',
    guestType: client.guestType || 'individual',
    preferredRoomType: client.preferredRoomType || 'standard',
    loyaltyNumber: client.loyaltyNumber || null,
    specialRequests: client.specialRequests || [],
    preferences: client.preferences || [],
    hotelProfile: {
      guestNumber: `HOTEL-${String(index + 1).padStart(4, '0')}`,
      loyaltyPoints: client.loyaltyPoints || 0,
      loyaltyTier: client.loyaltyTier || 'bronze',
      lastStay: client.lastStay || null,
      totalStays: client.totalStays || 0,
      preferredAmenities: client.preferredAmenities || [],
      dietaryRestrictions: client.dietaryRestrictions || [],
      roomPreferences: {
        floor: client.floor || 'any',
        view: client.view || 'any',
        bedType: client.bedType || 'queen',
        smoking: client.smoking || false
      }
    }
  })),
  {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
);

// Add metadata to the document
hotelClientsMock.metadata = {
  totalCount: baseClientsData.clients.length,
  activeGuests: baseClientsData.clients.filter(c => c.status === 'checked-in').length,
  loyaltyMembers: baseClientsData.clients.filter(c => c.loyaltyNumber).length,
  lastUpdated: new Date().toISOString()
};

/**
 * Funcție pentru obținerea datelor clienți hotel (sharded document)
 */
export function getHotelClientsMock(tenantId = 'T0003', locationId = 'T0003-01') {
  // Generate new sharded document with updated tenant/location
  const clients = hotelClientsMock.data.map(client => ({
    ...client,
    tenantId,
    locationId
  }));
  
  return resourceUtils.generateShardedDocument(
    tenantId,
    locationId,
    'CLIENTS',
    clients,
    hotelClientsMock.dateRange
  );
}

/**
 * Funcție pentru obținerea unui client specific după ID
 */
export function getHotelClientById(clientId, tenantId = 'T0003') {
  return hotelClientsMock.data.find(client => 
    client.id === clientId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea clienților după locație
 */
export function getHotelClientsByLocation(locationId, tenantId = 'T0003') {
  return hotelClientsMock.data.filter(client => 
    client.locationId === locationId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea gueștilor după tipul de cameră preferată
 */
export function getHotelClientsByRoomType(roomType, tenantId = 'T0003') {
  return hotelClientsMock.data.filter(client => 
    client.preferredRoomType === roomType && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea gueștilor după nivelul de loialitate
 */
export function getHotelClientsByLoyaltyTier(loyaltyTier, tenantId = 'T0003') {
  return hotelClientsMock.data.filter(client => 
    client.hotelProfile.loyaltyTier === loyaltyTier && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea datelor clienți ca array simplu (legacy compatibility)
 */
export function getHotelClientsArray(tenantId = 'T0003', locationId = 'T0003-01') {
  const document = getHotelClientsMock(tenantId, locationId);
  return document.data;
}

export default {
  hotelClientsMock,
  getHotelClientsMock,
  getHotelClientById,
  getHotelClientsByLocation,
  getHotelClientsByRoomType,
  getHotelClientsByLoyaltyTier,
  getHotelClientsArray
}; 