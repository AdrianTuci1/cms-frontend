/**
 * Gym Clients Mock Data
 * 
 * Mock data for gym clients (members) with tenant and location management
 * Following sharded database architecture with composed keys
 */

// Import comprehensive test data from testData
import clientsTestData from '../../../testData/clients/clients-test-data.json';
import { resourceUtils } from '../../../config/tenant.js';

// Base clients data
const baseClientsData = clientsTestData.response.data;

// Gym clients (members) with sharded document structure
export const gymClientsMock = resourceUtils.generateShardedDocument(
  'T0002',
  'T0002-01',
  'CLIENTS',
  baseClientsData.clients.map((client, index) => ({
    ...client,
    id: `T0002-01-CLIENT-${String(index + 1).padStart(3, '0')}`,
    tenantId: 'T0002',
    locationId: 'T0002-01', // Default location
    type: 'member',
    membershipType: client.membershipType || 'Basic',
    membershipStartDate: client.membershipStartDate || '2024-01-01',
    membershipEndDate: client.membershipEndDate || null,
    fitnessGoals: client.fitnessGoals || [],
    healthConditions: client.healthConditions || [],
    emergencyContact: client.emergencyContact || null,
    gymProfile: {
      membershipNumber: `GYM-${String(index + 1).padStart(4, '0')}`,
      membershipStatus: 'active',
      lastCheckIn: client.lastCheckIn || null,
      preferredClasses: client.preferredClasses || [],
      personalTrainer: client.personalTrainer || null,
      fitnessLevel: client.fitnessLevel || 'beginner',
      workoutHistory: client.workoutHistory || []
    }
  })),
  {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
);

// Add metadata to the document
gymClientsMock.metadata = {
  totalCount: baseClientsData.clients.length,
  activeMembers: baseClientsData.clients.filter(c => c.status === 'active').length,
  premiumMembers: baseClientsData.clients.filter(c => c.membershipType === 'Premium').length,
  lastUpdated: new Date().toISOString()
};

/**
 * Funcție pentru obținerea datelor clienți gym (sharded document)
 */
export function getGymClientsMock(tenantId = 'T0002', locationId = 'T0002-01') {
  // Generate new sharded document with updated tenant/location
  const clients = gymClientsMock.data.map(client => ({
    ...client,
    tenantId,
    locationId
  }));
  
  return resourceUtils.generateShardedDocument(
    tenantId,
    locationId,
    'CLIENTS',
    clients,
    gymClientsMock.dateRange
  );
}

/**
 * Funcție pentru obținerea unui client specific după ID
 */
export function getGymClientById(clientId, tenantId = 'T0002') {
  return gymClientsMock.data.find(client => 
    client.id === clientId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea clienților după locație
 */
export function getGymClientsByLocation(locationId, tenantId = 'T0002') {
  return gymClientsMock.data.filter(client => 
    client.locationId === locationId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea membrilor după tipul de membership
 */
export function getGymClientsByMembershipType(membershipType, tenantId = 'T0002') {
  return gymClientsMock.data.filter(client => 
    client.membershipType === membershipType && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea datelor clienți ca array simplu (legacy compatibility)
 */
export function getGymClientsArray(tenantId = 'T0002', locationId = 'T0002-01') {
  const document = getGymClientsMock(tenantId, locationId);
  return document.data;
}

export default {
  gymClientsMock,
  getGymClientsMock,
  getGymClientById,
  getGymClientsByLocation,
  getGymClientsByMembershipType,
  getGymClientsArray
}; 