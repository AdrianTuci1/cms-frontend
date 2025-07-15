/**
 * Business Info Mock Data
 * 
 * Date de demo pentru informațiile despre business și locații
 * Folosite în TEST_MODE pentru demonstrații și testare
 */

export const DEMO_BUSINESS_INFO = {
  dental: {
    business: {
      id: 'T0001',
      name: 'Demo Dental Clinic',
      businessType: 'dental',
      tenantId: 'T0001',
      email: 'contact@demodental.ro',
      phone: '+40 123 456 789',
      website: 'https://demodental.ro',
      description: 'Demo dental clinic for presentations and testing',
      logo: null,
      industry: 'Healthcare',
      establishedYear: 2015,
      employees: 25,
      specialties: ['General Dentistry', 'Orthodontics', 'Oral Surgery', 'Cosmetic Dentistry']
    },
    location: {
      id: 'T0001-01',
      name: 'Demo Dental Clinic - Main Office',
      address: 'Strada Demo 123, București',
      phone: '+40 123 456 789',
      email: 'contact@demodental.ro',
      isActive: true,
      coordinates: {
        lat: 44.4268,
        lng: 26.1025
      },
      workingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-16:00',
        saturday: '09:00-13:00',
        sunday: 'closed'
      }
    },
    locations: [
      {
        id: 'T0001-01',
        name: 'Demo Dental Clinic - Main Office',
        address: 'Strada Demo 123, București',
        phone: '+40 123 456 789',
        email: 'contact@demodental.ro',
        isActive: true,
        coordinates: {
          lat: 44.4268,
          lng: 26.1025
        },
        workingHours: {
          monday: '08:00-18:00',
          tuesday: '08:00-18:00',
          wednesday: '08:00-18:00',
          thursday: '08:00-18:00',
          friday: '08:00-16:00',
          saturday: '09:00-13:00',
          sunday: 'closed'
        }
      },
      {
        id: 'T0001-02',
        name: 'Demo Dental Clinic - Sector 2',
        address: 'Bulevardul Demo 456, București',
        phone: '+40 123 456 790',
        email: 'sector2@demodental.ro',
        isActive: true,
        coordinates: {
          lat: 44.4378,
          lng: 26.1135
        },
        workingHours: {
          monday: '09:00-17:00',
          tuesday: '09:00-17:00',
          wednesday: '09:00-17:00',
          thursday: '09:00-17:00',
          friday: '09:00-15:00',
          saturday: 'closed',
          sunday: 'closed'
        }
      }
    ],
    features: {
      appointments: true,
      treatments: true,
      consultations: true,
      invoices: true,
      aiAssistant: true,
      timeline: true,
      reports: true,
      onlineBooking: true,
      patientPortal: true,
      insuranceBilling: true
    },
    settings: {
      currency: 'RON',
      timezone: 'Europe/Bucharest',
      language: 'ro',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  },

  gym: {
    business: {
      id: 'T0002',
      name: 'Demo Fitness Center',
      businessType: 'gym',
      tenantId: 'T0002',
      email: 'contact@demofitness.ro',
      phone: '+40 123 456 788',
      website: 'https://demofitness.ro',
      description: 'Demo fitness center for presentations and testing',
      logo: null,
      industry: 'Fitness & Wellness',
      establishedYear: 2018,
      employees: 15,
      specialties: ['Fitness Training', 'Personal Training', 'Group Classes', 'Nutrition Counseling']
    },
    location: {
      id: 'T0002-01',
      name: 'Demo Fitness Center - Main Gym',
      address: 'Strada Fitness 123, București',
      phone: '+40 123 456 788',
      email: 'contact@demofitness.ro',
      isActive: true,
      coordinates: {
        lat: 44.4368,
        lng: 26.1045
      },
      workingHours: {
        monday: '06:00-22:00',
        tuesday: '06:00-22:00',
        wednesday: '06:00-22:00',
        thursday: '06:00-22:00',
        friday: '06:00-22:00',
        saturday: '08:00-20:00',
        sunday: '08:00-18:00'
      }
    },
    locations: [
      {
        id: 'T0002-01',
        name: 'Demo Fitness Center - Main Gym',
        address: 'Strada Fitness 123, București',
        phone: '+40 123 456 788',
        email: 'contact@demofitness.ro',
        isActive: true,
        coordinates: {
          lat: 44.4368,
          lng: 26.1045
        },
        workingHours: {
          monday: '06:00-22:00',
          tuesday: '06:00-22:00',
          wednesday: '06:00-22:00',
          thursday: '06:00-22:00',
          friday: '06:00-22:00',
          saturday: '08:00-20:00',
          sunday: '08:00-18:00'
        }
      }
    ],
    features: {
      memberships: true,
      classes: true,
      personal_training: true,
      invoices: true,
      timeline: true,
      reports: true,
      memberPortal: true,
      classBooking: true,
      equipmentTracking: true
    },
    settings: {
      currency: 'RON',
      timezone: 'Europe/Bucharest',
      language: 'ro',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  },

  hotel: {
    business: {
      id: 'T0003',
      name: 'Demo Hotel',
      businessType: 'hotel',
      tenantId: 'T0003',
      email: 'contact@demohotel.ro',
      phone: '+40 123 456 787',
      website: 'https://demohotel.ro',
      description: 'Demo hotel for presentations and testing',
      logo: null,
      industry: 'Hospitality',
      establishedYear: 2010,
      employees: 45,
      specialties: ['Business Travel', 'Conferences', 'Spa & Wellness', 'Fine Dining'],
      starRating: 4
    },
    location: {
      id: 'T0003-01',
      name: 'Demo Hotel - Main Building',
      address: 'Bulevardul Hotelului 123, București',
      phone: '+40 123 456 787',
      email: 'contact@demohotel.ro',
      isActive: true,
      coordinates: {
        lat: 44.4468,
        lng: 26.1155
      },
      workingHours: {
        monday: '24/7',
        tuesday: '24/7',
        wednesday: '24/7',
        thursday: '24/7',
        friday: '24/7',
        saturday: '24/7',
        sunday: '24/7'
      }
    },
    locations: [
      {
        id: 'T0003-01',
        name: 'Demo Hotel - Main Building',
        address: 'Bulevardul Hotelului 123, București',
        phone: '+40 123 456 787',
        email: 'contact@demohotel.ro',
        isActive: true,
        coordinates: {
          lat: 44.4468,
          lng: 26.1155
        },
        workingHours: {
          monday: '24/7',
          tuesday: '24/7',
          wednesday: '24/7',
          thursday: '24/7',
          friday: '24/7',
          saturday: '24/7',
          sunday: '24/7'
        }
      }
    ],
    features: {
      reservations: true,
      rooms: true,
      conference: true,
      spa: true,
      timeline: true,
      reports: true,
      onlineBooking: true,
      guestPortal: true,
      roomService: true,
      concierge: true
    },
    settings: {
      currency: 'RON',
      timezone: 'Europe/Bucharest',
      language: 'ro',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      checkInTime: '15:00',
      checkOutTime: '11:00'
    }
  }
};

/**
 * Obține informațiile de business pentru demo mode
 * @param {string} businessType - Tipul de business (dental, gym, hotel)
 * @returns {Object} Datele de business
 */
export function getDemoBusinessInfo(businessType = 'dental') {
  return DEMO_BUSINESS_INFO[businessType] || DEMO_BUSINESS_INFO.dental;
}

/**
 * Obține lista de locații pentru demo mode
 * @param {string} businessType - Tipul de business
 * @returns {Array} Lista de locații
 */
export function getDemoLocations(businessType = 'dental') {
  const businessInfo = getDemoBusinessInfo(businessType);
  return businessInfo.locations || [];
}

/**
 * Obține locația principală pentru demo mode
 * @param {string} businessType - Tipul de business
 * @returns {Object} Locația principală
 */
export function getDemoMainLocation(businessType = 'dental') {
  const businessInfo = getDemoBusinessInfo(businessType);
  return businessInfo.location || businessInfo.locations[0];
} 