/**
 * Business Info Mock Data
 * 
 * Simplified mock data for business information with tenant and location management
 * Used for development and offline mode
 */

// Tenant configuration mapping
export const TENANT_CONFIG = {
  'T0001': {
    id: 'T0001',
    businessType: 'dental',
    name: 'Dental Clinic Mock',
    tenantId: 'T0001'
  },
  'T0002': {
    id: 'T0002', 
    businessType: 'gym',
    name: 'Fitness Center Mock',
    tenantId: 'T0002'
  },
  'T0003': {
    id: 'T0003',
    businessType: 'hotel', 
    name: 'Hotel Mock',
    tenantId: 'T0003'
  }
};

// Base business info structure
export const businessInfoMock = {
  id: 'business-info-001',
  business: {
    id: 'mock-business-001',
    name: 'Mock Business',
    type: 'dental',
    tenantId: 'T0001',
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
      id: 'T0001-01',
      name: 'Main Dental Clinic',
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
      capacity: 50,
      isDefault: true
    },
    {
      id: 'T0001-02',
      name: 'Dental Clinic Branch',
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
      capacity: 30,
      isDefault: false
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
  }
};

// Business info by tenant
export const businessInfoByTenant = {
  'T0001': {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'dental',
      name: 'Dental Clinic Mock',
      tenantId: 'T0001',
      specialties: ['General Dentistry', 'Orthodontics', 'Surgery']
    },
    locations: [
      {
        id: 'T0001-01',
        name: 'Main Dental Clinic',
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
        capacity: 50,
        isDefault: true
      },
      {
        id: 'T0001-02',
        name: 'Dental Clinic Branch',
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
        capacity: 30,
        isDefault: false
      }
    ],
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
  'T0002': {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'gym',
      name: 'Fitness Center Mock',
      tenantId: 'T0002',
      specialties: ['Cardio', 'Strength Training', 'Yoga', 'Swimming']
    },
    locations: [
      {
        id: 'T0002-01',
        name: 'Main Fitness Center',
        address: {
          street: 'Strada Fitness 789',
          city: 'București',
          county: 'București',
          postalCode: '010000',
          country: 'România'
        },
        phone: '+40 123 456 791',
        email: 'contact@fitnessmock.ro',
        businessHours: {
          monday: { open: '06:00', close: '23:00', closed: false },
          tuesday: { open: '06:00', close: '23:00', closed: false },
          wednesday: { open: '06:00', close: '23:00', closed: false },
          thursday: { open: '06:00', close: '23:00', closed: false },
          friday: { open: '06:00', close: '23:00', closed: false },
          saturday: { open: '08:00', close: '22:00', closed: false },
          sunday: { open: '08:00', close: '22:00', closed: false }
        },
        services: ['memberships', 'classes', 'personal_training'],
        capacity: 200,
        isDefault: true
      }
    ],
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
  'T0003': {
    ...businessInfoMock,
    business: {
      ...businessInfoMock.business,
      type: 'hotel',
      name: 'Hotel Mock',
      tenantId: 'T0003',
      specialties: ['Accommodation', 'Conference', 'Spa', 'Restaurant']
    },
    locations: [
      {
        id: 'T0003-01',
        name: 'Main Hotel',
        address: {
          street: 'Strada Hotel 321',
          city: 'București',
          county: 'București',
          postalCode: '010000',
          country: 'România'
        },
        phone: '+40 123 456 792',
        email: 'contact@hotelmock.ro',
        businessHours: {
          monday: { open: '00:00', close: '23:59', closed: false },
          tuesday: { open: '00:00', close: '23:59', closed: false },
          wednesday: { open: '00:00', close: '23:59', closed: false },
          thursday: { open: '00:00', close: '23:59', closed: false },
          friday: { open: '00:00', close: '23:59', closed: false },
          saturday: { open: '00:00', close: '23:59', closed: false },
          sunday: { open: '00:00', close: '23:59', closed: false }
        },
        services: ['accommodation', 'conference', 'spa', 'restaurant'],
        capacity: 150,
        isDefault: true
      }
    ],
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
 * Funcție pentru obținerea business info după tenant ID
 */
export function getBusinessInfo(tenantId = 'T0001') {
  return businessInfoByTenant[tenantId] || businessInfoMock;
}

/**
 * Funcție pentru obținerea business info după business type
 */
export function getBusinessInfoByType(businessType = 'dental') {
  const tenantId = Object.keys(TENANT_CONFIG).find(key => 
    TENANT_CONFIG[key].businessType === businessType
  );
  return getBusinessInfo(tenantId);
}

/**
 * Funcție pentru obținerea tenant ID după business type
 */
export function getTenantIdByType(businessType = 'dental') {
  const tenant = Object.values(TENANT_CONFIG).find(config => 
    config.businessType === businessType
  );
  return tenant ? tenant.tenantId : 'T0001';
}

/**
 * Funcție pentru obținerea business type după tenant ID
 */
export function getBusinessTypeByTenant(tenantId = 'T0001') {
  return TENANT_CONFIG[tenantId]?.businessType || 'dental';
}

/**
 * Funcție pentru obținerea locației implicite pentru un tenant
 */
export function getDefaultLocation(tenantId = 'T0001') {
  const businessInfo = getBusinessInfo(tenantId);
  return businessInfo.locations.find(location => location.isDefault) || businessInfo.locations[0];
}

/**
 * Funcție pentru actualizarea business info
 */
export function updateBusinessInfo(tenantId, updates) {
  if (businessInfoByTenant[tenantId]) {
    businessInfoByTenant[tenantId] = {
      ...businessInfoByTenant[tenantId],
      ...updates
    };
  }
}

export default {
  businessInfoMock,
  businessInfoByTenant,
  TENANT_CONFIG,
  getBusinessInfo,
  getBusinessInfoByType,
  getTenantIdByType,
  getBusinessTypeByTenant,
  getDefaultLocation,
  updateBusinessInfo
}; 