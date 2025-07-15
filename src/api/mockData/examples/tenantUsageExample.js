/**
 * Tenant Usage Example - Sharded Database Architecture
 * 
 * Demonstrates how to use the new tenant-based mock data system
 * Following sharded database architecture with composed keys
 */

import { getMockData, tenantUtils, getClientById, getClientsByLocation, getMockDataArray } from '../index.js';
import { tenantUtils as configTenantUtils, locationUtils, resourceUtils } from '../../config/tenant.js';

/**
 * Example 1: Basic tenant data fetching with sharded documents
 */
export function basicTenantExample() {
  console.log('=== Basic Tenant Example (Sharded Architecture) ===');
  
  // Get current tenant info
  const currentTenantId = tenantUtils.getTenantId();
  const currentBusinessType = tenantUtils.getBusinessType();
  const defaultLocation = tenantUtils.getDefaultLocationId();
  
  console.log('Current Tenant ID:', currentTenantId);
  console.log('Current Business Type:', currentBusinessType);
  console.log('Default Location:', defaultLocation);
  
  // Get business info for current tenant
  const businessInfo = getMockData('business-info');
  console.log('Business Info:', businessInfo.business.name);
  
  // Get clients for current tenant (returns sharded document)
  const clientsDocument = getMockData('clients');
  console.log('Sharded Document ID:', clientsDocument.id);
  console.log('Document Structure:', {
    tenantId: clientsDocument.tenantId,
    locationId: clientsDocument.locationId,
    resourceType: clientsDocument.resourceType,
    dateRange: clientsDocument.dateRange,
    dataLength: clientsDocument.data.length
  });
  
  // Access the actual client data
  const clients = clientsDocument.data;  // Direct array of clients
  const metadata = clientsDocument.metadata;
  console.log('Number of clients:', clients.length);
  console.log('Metadata:', metadata);
  
  // Get services for current tenant
  const servicesDocument = getMockData('services');
  console.log('Services Document ID:', servicesDocument.id);
}

/**
 * Example 2: Sharded document structure analysis
 */
export function shardedDocumentExample() {
  console.log('\n=== Sharded Document Structure Example ===');
  
  // Get a sharded document
  const document = getMockData('clients', 'T0001', 'T0001-01');
  
  console.log('Document ID:', document.id);
  console.log('Tenant ID:', document.tenantId);
  console.log('Location ID:', document.locationId);
  console.log('Resource Type:', document.resourceType);
  console.log('Date Range:', document.dateRange);
  console.log('Sync Timestamp:', document._syncTimestamp);
  console.log('Version:', document._version);
  console.log('Data Length:', document.data.length);
  console.log('Metadata:', document.metadata);
  
  // Check if it's a valid sharded document
  const isValid = resourceUtils.isShardedDocument(document);
  console.log('Is Valid Sharded Document:', isValid);
  
  // Extract just the data
  const extractedData = resourceUtils.extractDataFromDocument(document);
  console.log('Extracted Data Length:', extractedData.length);
}

/**
 * Example 3: ID generation and parsing for sharded architecture
 */
export function idManagementExample() {
  console.log('\n=== ID Management Example (Sharded Architecture) ===');
  
  // Generate location ID
  const locationId = locationUtils.generateLocationId('T0001', 1);
  console.log('Generated Location ID:', locationId);
  
  // Parse location ID
  const parsedLocation = locationUtils.parseLocationId(locationId);
  console.log('Parsed Location:', parsedLocation);
  
  // Generate resource document ID
  const documentId = resourceUtils.generateDocumentId('T0001', 'T0001-01', 'CLIENTS');
  console.log('Generated Document ID:', documentId);
  
  // Parse document ID
  const parsedDocument = resourceUtils.parseDocumentId(documentId);
  console.log('Parsed Document ID:', parsedDocument);
  
  // Generate resource item ID
  const clientId = resourceUtils.generateResourceId('T0001', 'T0001-01', 'CLIENT', 1);
  console.log('Generated Client ID:', clientId);
  
  // Parse resource ID
  const parsedClient = resourceUtils.parseResourceId(clientId);
  console.log('Parsed Client ID:', parsedClient);
  
  // Validate IDs
  const isValidLocation = locationUtils.isValidLocationId(locationId);
  const isValidDocument = resourceUtils.isValidDocumentId(documentId);
  const isValidClient = resourceUtils.isValidResourceId(clientId);
  console.log('Is Valid Location ID:', isValidLocation);
  console.log('Is Valid Document ID:', isValidDocument);
  console.log('Is Valid Client ID:', isValidClient);
}

/**
 * Example 4: Creating sharded documents
 */
export function createShardedDocumentExample() {
  console.log('\n=== Create Sharded Document Example ===');
  
  // Sample data
  const sampleData = [
    {
      id: 'T0001-01-CLIENT-999',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active'
    },
    {
      id: 'T0001-01-CLIENT-998',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active'
    }
  ];
  
  // Create sharded document
  const document = resourceUtils.generateShardedDocument(
    'T0001',
    'T0001-01',
    'CLIENTS',
    sampleData,
    {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  );
  
  console.log('Created Document:', {
    id: document.id,
    tenantId: document.tenantId,
    locationId: document.locationId,
    resourceType: document.resourceType,
    dateRange: document.dateRange,
    dataLength: document.data.length
  });
}

/**
 * Example 5: Legacy compatibility with sharded architecture
 */
export function legacyCompatibilityExample() {
  console.log('\n=== Legacy Compatibility Example ===');
  
  // Get sharded document (new way)
  const shardedDocument = getMockData('clients', 'T0001');
  console.log('Sharded Document:', shardedDocument.id);
  
  // Get just the data array (legacy way)
  const clientsArray = getMockDataArray('clients', 'T0001');
  console.log('Clients Array Length:', clientsArray.length);
  
  // Get clients array directly (legacy function)
  const clients = getClientsArray('T0001');
  console.log('Direct Clients Array Length:', clients.length);
  
  // Both should contain the same data
  const sameData = JSON.stringify(shardedDocument.data) === JSON.stringify(clients);
  console.log('Data is identical:', sameData);
}

/**
 * Example 6: Multi-tenant data isolation
 */
export function multiTenantExample() {
  console.log('\n=== Multi-Tenant Data Isolation Example ===');
  
  // Get clients for different tenants
  const dentalClients = getMockData('clients', 'T0001');
  const gymClients = getMockData('clients', 'T0002');
  const hotelClients = getMockData('clients', 'T0003');
  
  console.log('Dental Document ID:', dentalClients.id);
  console.log('Gym Document ID:', gymClients.id);
  console.log('Hotel Document ID:', hotelClients.id);
  
  // Verify data isolation
  const dentalClientIds = dentalClients.data.map(c => c.id);
  const gymClientIds = gymClients.data.map(c => c.id);
  const hotelClientIds = hotelClients.data.map(c => c.id);
  
  console.log('Dental Client IDs start with:', dentalClientIds[0]?.substring(0, 8));
  console.log('Gym Client IDs start with:', gymClientIds[0]?.substring(0, 8));
  console.log('Hotel Client IDs start with:', hotelClientIds[0]?.substring(0, 8));
  
  // Verify no overlap
  const allIds = [...dentalClientIds, ...gymClientIds, ...hotelClientIds];
  const uniqueIds = new Set(allIds);
  console.log('Total IDs:', allIds.length);
  console.log('Unique IDs:', uniqueIds.size);
  console.log('No ID overlap:', allIds.length === uniqueIds.size);
}

/**
 * Example 7: Date range sharding
 */
export function dateRangeShardingExample() {
  console.log('\n=== Date Range Sharding Example ===');
  
  // Get document with date range
  const document = getMockData('clients', 'T0001');
  
  console.log('Date Range:', document.dateRange);
  console.log('Start Date:', document.dateRange.startDate);
  console.log('End Date:', document.dateRange.endDate);
  
  // Calculate shard period
  const startDate = new Date(document.dateRange.startDate);
  const endDate = new Date(document.dateRange.endDate);
  const daysInShard = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  console.log('Days in this shard:', daysInShard);
  console.log('Shard covers year:', startDate.getFullYear());
}

/**
 * Run all examples
 */
export function runAllExamples() {
  basicTenantExample();
  shardedDocumentExample();
  idManagementExample();
  createShardedDocumentExample();
  legacyCompatibilityExample();
  multiTenantExample();
  dateRangeShardingExample();
} 