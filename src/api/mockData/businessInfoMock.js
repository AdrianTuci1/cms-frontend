/**
 * Business Info Mock Data
 * 
 * Comprehensive mock data for business information across different business types
 * Used for development and offline mode
 */

// Mock data pentru business-info
export const businessInfoMock = {
  id: 'business-info-001',
  business: {
    id: 'mock-business-001',
    name: 'Mock Business',
    type: 'dental',
    tenantId: 'mock-tenant-123',
    settings: {
      timezone: 'Europe/Bucharest',
      currency: 'RON',
      language: 'ro',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    },
    contact: {
      email: 'contact@mockbusiness.ro',
      phone: '+40 123 456 789',
      website: 'https://mockbusiness.ro'
    }
  },
  locations: [
    {
      id: 'mock-location-001',
      name: 'Mock Location 1',
      address: {
        street: 'Strada Mock 123',
        city: 'București',
        county: 'București',
        postalCode: '010000',
        country: 'România'
      },
      phone: '+40 123 456 789',
      email: 'contact@mockbusiness.ro',
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: null, close: null, closed: true }
      },
      services: ['appointments', 'consultations', 'treatments'],
      capacity: 50
    },
    {
      id: 'mock-location-002',
      name: 'Mock Location 2',
      address: {
        street: 'Strada Test 456',
        city: 'Cluj-Napoca',
        county: 'Cluj',
        postalCode: '400000',
        country: 'România'
      },
      phone: '+40 123 456 790',
      email: 'cluj@mockbusiness.ro',
      businessHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '15:00', closed: false },
        sunday: { open: null, close: null, closed: true }
      },
      services: ['appointments', 'consultations'],
      capacity: 30
    }
  ],
  features: {
    appointments: {
      enabled: true,
      maxDuration: 120,
      minInterval: 15,
      allowOverlap: false
    },
    sales: {
      enabled: true,
      allowDiscounts: true,
      requirePayment: true
    },
    invoices: {
      enabled: true,
      autoGenerate: false,
      requireApproval: true
    },
    stocks: {
      enabled: true,
      lowStockAlert: true,
      autoReorder: false
    },
    reports: {
      enabled: true,
      retentionDays: 365,
      exportFormats: ['PDF', 'Excel', 'CSV']
    },
    automations: {
      enabled: true,
      emailNotifications: true,
      smsNotifications: false
    },
    clients: {
      enabled: true,
      allowRegistration: true,
      requireApproval: false
    },
    services: {
      enabled: true,
      allowCustomPricing: true,
      requireDescription: true
    }
  },
  integrations: {
    payment: {
      stripe: { enabled: false, testMode: true },
      paypal: { enabled: false, testMode: true },
      local: { enabled: true, methods: ['cash', 'card', 'transfer'] }
    },
    communication: {
      email: { enabled: true, provider: 'smtp' },
      sms: { enabled: false, provider: null },
      whatsapp: { enabled: false, provider: null }
    },
    calendar: {
      google: { enabled: false },
      outlook: { enabled: false },
      local: { enabled: true }
    }
  },
  branding: {
    logo: null,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Roboto'
    }
  },
  notifications: {
    email: {
      appointmentReminders: true,
      invoiceNotifications: true,
      systemAlerts: true
    },
    sms: {
      appointmentReminders: false,
      invoiceNotifications: false,
      systemAlerts: false
    },
    push: {
      enabled: false
    }
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 3600,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    }
  },
  analytics: {
    enabled: true,
    tracking: {
      pageViews: true,
      userActions: true,
      performance: true
    },
    privacy: {
      anonymizeData: true,
      respectDNT: true
    }
  }
};

// Business info pentru diferite tipuri de business
export const businessInfoByType = {
  dental: {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'dental',
      name: 'Dental Clinic Mock',
      specialties: ['General Dentistry', 'Orthodontics', 'Surgery']
    },
    features: {
      ...businessInfoMock.features,
      appointments: {
        ...businessInfoMock.features.appointments,
        maxDuration: 180,
        allowEmergency: true
      },
      treatments: {
        enabled: true,
        categories: ['Preventive', 'Restorative', 'Surgical', 'Cosmetic']
      }
    }
  },
  gym: {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'gym',
      name: 'Fitness Center Mock',
      specialties: ['Cardio', 'Strength Training', 'Yoga', 'Swimming']
    },
    features: {
      ...businessInfoMock.features,
      memberships: {
        enabled: true,
        types: ['Basic', 'Premium', 'VIP']
      },
      classes: {
        enabled: true,
        maxParticipants: 20,
        allowDropIn: true
      }
    }
  },
  hotel: {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'hotel',
      name: 'Hotel Mock',
      specialties: ['Accommodation', 'Conference', 'Spa', 'Restaurant']
    },
    features: {
      ...businessInfoMock.features,
      reservations: {
        enabled: true,
        allowOverbooking: false,
        requireDeposit: true
      },
      rooms: {
        enabled: true,
        types: ['Standard', 'Deluxe', 'Suite', 'Family']
      }
    }
  }
};

/**
 * Funcție pentru obținerea business info după tip
 */
export function getBusinessInfo(businessType = 'dental') {
  return businessInfoByType[businessType] || businessInfoMock;
}

/**
 * Funcție pentru actualizarea business info
 */
export function updateBusinessInfo(businessType, updates) {
  if (businessInfoByType[businessType]) {
    businessInfoByType[businessType] = {
      ...businessInfoByType[businessType],
      ...updates
    };
  }
}

export default {
  businessInfoMock,
  businessInfoByType,
  getBusinessInfo,
  updateBusinessInfo
}; 