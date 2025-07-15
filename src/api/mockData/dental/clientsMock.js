/**
 * Dental Clients Mock Data
 * 
 * Mock data for dental clinic clients (patients) with tenant and location management
 * Following sharded database architecture with composed keys
 */

// Import comprehensive test data from testData
import clientsTestData from '../../../testData/clients/clients-test-data.json';
import { resourceUtils } from '../../../config/tenant.js';

// Base clients data
const baseClientsData = clientsTestData.response.data;

// Dental clinic clients (patients) with sharded document structure
export const dentalClientsMock = resourceUtils.generateShardedDocument(
  'T0001',
  'T0001-01',
  'CLIENTS',
  baseClientsData.clients.map((client, index) => ({
    ...client,
    id: `T0001-01-CLIENT-${String(index + 1).padStart(3, '0')}`,
    tenantId: 'T0001',
    locationId: 'T0001-01', // Default location
    type: 'patient',
    medicalHistory: client.medicalHistory || [],
    lastVisit: client.lastVisit || null,
    nextAppointment: client.nextAppointment || null,
    insuranceProvider: client.insuranceProvider || 'none',
    emergencyContact: client.emergencyContact || null,
    dentalRecords: {
      lastCleaning: client.lastCleaning || null,
      lastXRay: client.lastXRay || null,
      treatments: client.treatments || [],
      allergies: client.allergies || [],
      medications: client.medications || []
    }
  })),
  {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
);

// Add metadata to the document
dentalClientsMock.metadata = {
  totalCount: baseClientsData.clients.length,
  activePatients: baseClientsData.clients.filter(c => c.status === 'active').length,
  pendingPatients: baseClientsData.clients.filter(c => c.status === 'pending').length,
  lastUpdated: new Date().toISOString()
};

/**
 * Funcție pentru obținerea datelor clienți dental (sharded document)
 */
export function getDentalClientsMock(tenantId = 'T0001', locationId = 'T0001-01') {
  // Generate new sharded document with updated tenant/location
  const clients = dentalClientsMock.data.map(client => ({
    ...client,
    tenantId,
    locationId
  }));
  
  return resourceUtils.generateShardedDocument(
    tenantId,
    locationId,
    'CLIENTS',
    clients,
    dentalClientsMock.dateRange
  );
}

/**
 * Funcție pentru obținerea unui client specific după ID
 */
export function getDentalClientById(clientId, tenantId = 'T0001') {
  return dentalClientsMock.data.find(client => 
    client.id === clientId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea clienților după locație
 */
export function getDentalClientsByLocation(locationId, tenantId = 'T0001') {
  return dentalClientsMock.data.filter(client => 
    client.locationId === locationId && client.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea datelor clienți ca array simplu (legacy compatibility)
 */
export function getDentalClientsArray(tenantId = 'T0001', locationId = 'T0001-01') {
  const document = getDentalClientsMock(tenantId, locationId);
  return document.data;
}

export default {
  dentalClientsMock,
  getDentalClientsMock,
  getDentalClientById,
  getDentalClientsByLocation,
  getDentalClientsArray
}; 