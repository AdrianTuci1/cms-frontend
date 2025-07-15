/**
 * Clients Mock Data - Date mock pentru clienți
 */

// Import comprehensive test data from testData
import clientsTestData from '../../testData/clients/clients-test-data.json';

// Base clients data
const baseClientsData = clientsTestData.response.data;

// Dental clinic clients (patients)
export const dentalClientsMock = {
  id: 'dental-clients-001',
  businessType: 'dental',
  clients: baseClientsData.clients.map(client => ({
    ...client,
    type: 'patient',
    medicalHistory: client.medicalHistory || [],
    lastVisit: client.lastVisit || null,
    nextAppointment: client.nextAppointment || null,
    insuranceProvider: client.insuranceProvider || 'none',
    emergencyContact: client.emergencyContact || null
  }))
};

// Gym clients (members)
export const gymClientsMock = {
  id: 'gym-clients-001',
  businessType: 'gym',
  clients: baseClientsData.clients.map(client => ({
    ...client,
    type: 'member',
    membershipType: client.membershipType || 'Basic',
    membershipStartDate: client.membershipStartDate || '2024-01-01',
    membershipEndDate: client.membershipEndDate || null,
    fitnessGoals: client.fitnessGoals || [],
    healthConditions: client.healthConditions || [],
    emergencyContact: client.emergencyContact || null
  }))
};

// Hotel clients (guests)
export const hotelClientsMock = {
  id: 'hotel-clients-001',
  businessType: 'hotel',
  clients: baseClientsData.clients.map(client => ({
    ...client,
    type: 'guest',
    guestType: client.guestType || 'individual',
    preferredRoomType: client.preferredRoomType || 'standard',
    loyaltyNumber: client.loyaltyNumber || null,
    specialRequests: client.specialRequests || [],
    preferences: client.preferences || []
  }))
};

/**
 * Funcție pentru obținerea datelor clienți în funcție de tipul de business
 */
export function getClientsMock(businessType = 'dental') {
  switch (businessType) {
    case 'dental':
      return dentalClientsMock;
    case 'gym':
      return gymClientsMock;
    case 'hotel':
      return hotelClientsMock;
    default:
      return dentalClientsMock; // default
  }
}

// Legacy export for backward compatibility
export const clientsMock = dentalClientsMock;

export default {
  clientsMock,
  dentalClientsMock,
  gymClientsMock,
  hotelClientsMock,
  getClientsMock
}; 