/**
 * Mock Data Module - Date mock pentru development și offline mode
 * Centralizează toate datele mock într-un singur loc pentru ușurință de gestionare
 */

// Import comprehensive test data for dental timeline
import dentalTimelineData from '../../testData/dentalTimeline/dental-timeline-week.json';

// Mock data pentru business-info
const businessInfoMock = {
  id: 'business-info-001',
  business: {
    id: 'mock-business-001',
    name: 'Mock Business',
    type: 'dental',
    tenantId: 'mock-tenant-123',
    settings: {
      timezone: 'Europe/Bucharest',
      currency: 'RON',
      language: 'ro'
    }
  },
  locations: [
    {
      id: 'mock-location-001',
      name: 'Mock Location 1',
      address: 'Strada Mock 123, București',
      phone: '+40 123 456 789',
      email: 'contact@mockbusiness.ro',
      businessHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { open: null, close: null }
      }
    }
  ],
  features: {
    appointments: true,
    sales: true,
    invoices: true,
    stocks: true,
    reports: true,
    automations: true
  }
};

// Mock data pentru timeline (dental) - Updated to use comprehensive test data
const dentalTimelineMock = dentalTimelineData.response.data;

// Mock data pentru timeline (gym)
const gymTimelineMock = {
  id: 'gym-timeline-001',
  businessType: 'gym',
  members: [
    {
      id: 'member-001',
      name: 'Alexandru Vasilescu',
      membershipType: 'Premium',
      checkIn: '2024-01-15T08:30:00Z',
      checkOut: null,
      status: 'active'
    },
    {
      id: 'member-002',
      name: 'Elena Dumitrescu',
      membershipType: 'Basic',
      checkIn: '2024-01-15T09:15:00Z',
      checkOut: '2024-01-15T10:45:00Z',
      status: 'completed'
    }
  ],
  occupancy: {
    current: 12,
    maxCapacity: 50,
    percentage: 24
  }
};

// Mock data pentru timeline (hotel)
const hotelTimelineMock = {
  id: 'hotel-timeline-001',
  businessType: 'hotel',
  reservations: [
    {
      id: 'res-001',
      guestName: 'Petru Marin',
      roomNumber: '101',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      status: 'confirmed',
      guests: 2
    },
    {
      id: 'res-002',
      guestName: 'Ana Stoica',
      roomNumber: '205',
      checkIn: '2024-01-15',
      checkOut: '2024-01-16',
      status: 'checked-in',
      guests: 1
    }
  ],
  occupancy: {
    occupied: 15,
    total: 30,
    percentage: 50
  }
};

// Mock data pentru clients
const clientsMock = {
  dental: {
    id: 'clients-dental-001',
    businessType: 'dental',
    clients: [
      {
        id: 'client-001',
        name: 'Maria Popescu',
        email: 'maria.popescu@email.com',
        phone: '+40 123 456 789',
        lastVisit: '2024-01-10',
        totalVisits: 5,
        status: 'active'
      },
      {
        id: 'client-002',
        name: 'Ion Ionescu',
        email: 'ion.ionescu@email.com',
        phone: '+40 987 654 321',
        lastVisit: '2024-01-12',
        totalVisits: 3,
        status: 'active'
      }
    ]
  },
  gym: {
    id: 'clients-gym-001',
    businessType: 'gym',
    members: [
      {
        id: 'member-001',
        name: 'Alexandru Vasilescu',
        email: 'alex.vasilescu@email.com',
        membershipType: 'Premium',
        joinDate: '2023-06-15',
        status: 'active'
      },
      {
        id: 'member-002',
        name: 'Elena Dumitrescu',
        email: 'elena.dumitrescu@email.com',
        membershipType: 'Basic',
        joinDate: '2023-08-20',
        status: 'active'
      }
    ]
  },
  hotel: {
    id: 'clients-hotel-001',
    businessType: 'hotel',
    guests: [
      {
        id: 'guest-001',
        name: 'Petru Marin',
        email: 'petru.marin@email.com',
        phone: '+40 555 123 456',
        lastStay: '2024-01-10',
        totalStays: 3,
        status: 'active'
      },
      {
        id: 'guest-002',
        name: 'Ana Stoica',
        email: 'ana.stoica@email.com',
        phone: '+40 555 789 012',
        lastStay: '2024-01-12',
        totalStays: 1,
        status: 'active'
      }
    ]
  }
};

// Mock data pentru services
const servicesMock = {
  dental: {
    id: 'services-dental-001',
    businessType: 'dental',
    services: [
      {
        id: 'service-001',
        name: 'Consultare',
        price: 50,
        duration: 60,
        category: 'consultation'
      },
      {
        id: 'service-002',
        name: 'Tratament',
        price: 150,
        duration: 90,
        category: 'treatment'
      }
    ]
  },
  gym: {
    id: 'services-gym-001',
    businessType: 'gym',
    packages: [
      {
        id: 'package-001',
        name: 'Basic Membership',
        price: 100,
        duration: 30,
        features: ['Access to gym', 'Basic equipment']
      },
      {
        id: 'package-002',
        name: 'Premium Membership',
        price: 200,
        duration: 30,
        features: ['Access to gym', 'All equipment', 'Personal trainer']
      }
    ]
  },
  hotel: {
    id: 'services-hotel-001',
    businessType: 'hotel',
    rooms: [
      {
        id: 'room-001',
        name: 'Camera Standard',
        price: 200,
        capacity: 2,
        available: true
      },
      {
        id: 'room-002',
        name: 'Camera Deluxe',
        price: 350,
        capacity: 4,
        available: true
      }
    ]
  }
};

// Mock data pentru invoices
const invoicesMock = {
  id: 'invoices-001',
  invoices: [
    {
      id: 'inv-001',
      clientId: 'client-001',
      clientName: 'Maria Popescu',
      amount: 150,
      status: 'paid',
      date: '2024-01-15',
      dueDate: '2024-01-30'
    },
    {
      id: 'inv-002',
      clientId: 'client-002',
      clientName: 'Ion Ionescu',
      amount: 200,
      status: 'pending',
      date: '2024-01-14',
      dueDate: '2024-01-29'
    }
  ]
};

// Mock data pentru stocks
const stocksMock = {
  id: 'stocks-001',
  items: [
    {
      id: 'stock-001',
      name: 'Produs 1',
      category: 'Categoria A',
      quantity: 50,
      minQuantity: 10,
      price: 25.50,
      status: 'in-stock'
    },
    {
      id: 'stock-002',
      name: 'Produs 2',
      category: 'Categoria B',
      quantity: 5,
      minQuantity: 10,
      price: 15.75,
      status: 'low-stock'
    }
  ]
};

// Mock data pentru sales
const salesMock = {
  id: 'sales-001',
  sales: [
    {
      id: 'sale-001',
      clientId: 'client-001',
      clientName: 'Maria Popescu',
      amount: 150,
      date: '2024-01-15',
      items: ['Produs 1', 'Produs 2']
    },
    {
      id: 'sale-002',
      clientId: 'client-002',
      clientName: 'Ion Ionescu',
      amount: 200,
      date: '2024-01-14',
      items: ['Produs 3']
    }
  ]
};

// Mock data pentru agent
const agentMock = {
  id: 'agent-001',
  name: 'Agent Mock',
  email: 'agent@mockbusiness.ro',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  stats: {
    appointments: 25,
    sales: 1500,
    clients: 50
  }
};

// Mock data pentru history
const historyMock = {
  id: 'history-001',
  events: [
    {
      id: 'hist-001',
      type: 'appointment',
      action: 'created',
      timestamp: '2024-01-15T10:00:00Z',
      details: 'Appointment created for Maria Popescu'
    },
    {
      id: 'hist-002',
      type: 'sale',
      action: 'completed',
      timestamp: '2024-01-15T09:30:00Z',
      details: 'Sale completed for Ion Ionescu'
    }
  ]
};

// Mock data pentru workflows
const workflowsMock = {
  id: 'workflows-001',
  workflows: [
    {
      id: 'wf-001',
      name: 'Workflow 1',
      status: 'active',
      steps: ['Step 1', 'Step 2', 'Step 3']
    },
    {
      id: 'wf-002',
      name: 'Workflow 2',
      status: 'inactive',
      steps: ['Step 1', 'Step 2']
    }
  ]
};

// Mock data pentru reports
const reportsMock = {
  id: 'reports-001',
  reports: [
    {
      id: 'rep-001',
      type: 'daily',
      date: '2024-01-15',
      data: {
        appointments: 10,
        sales: 1500,
        clients: 5
      }
    },
    {
      id: 'rep-002',
      type: 'monthly',
      date: '2024-01',
      data: {
        appointments: 250,
        sales: 45000,
        clients: 120
      }
    }
  ]
};

// Mock data pentru roles
const rolesMock = {
  id: 'roles-001',
  roles: [
    {
      id: 'role-001',
      name: 'Admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      active: true
    },
    {
      id: 'role-002',
      name: 'User',
      permissions: ['read', 'write'],
      active: true
    }
  ]
};

// Mock data pentru permissions
const permissionsMock = {
  id: 'permissions-001',
  permissions: [
    {
      id: 'perm-001',
      name: 'read',
      description: 'Can read data',
      roleId: 'role-001'
    },
    {
      id: 'perm-002',
      name: 'write',
      description: 'Can write data',
      roleId: 'role-001'
    }
  ]
};

// Mock data pentru userData
const userDataMock = {
  id: 'user-001',
  name: 'User Mock',
  email: 'user@mockbusiness.ro',
  role: 'admin',
  profile: {
    avatar: null,
    preferences: {
      theme: 'light',
      language: 'ro'
    }
  }
};

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
      return businessInfoMock;
    
    case 'timeline':
      switch (businessType) {
        case 'dental':
          return dentalTimelineMock;
        case 'gym':
          return gymTimelineMock;
        case 'hotel':
          return hotelTimelineMock;
        default:
          return dentalTimelineMock; // default
      }
    
    case 'clients':
      return businessType ? clientsMock[businessType] || [] : [];
    
    case 'services':
      return businessType ? servicesMock[businessType] || [] : [];
    
    case 'invoices':
      return invoicesMock;
    
    case 'stocks':
      return stocksMock;
    
    case 'sales':
      return salesMock;
    
    case 'agent':
      return agentMock;
    
    case 'history':
      return historyMock;
    
    case 'workflows':
      return workflowsMock;
    
    case 'reports':
      return reportsMock;
    
    case 'roles':
      return rolesMock;
    
    case 'permissions':
      return permissionsMock;
    
    case 'userData':
      return userDataMock;
    
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
  salesMock,
  agentMock,
  historyMock,
  workflowsMock,
  reportsMock,
  rolesMock,
  permissionsMock,
  userDataMock
}; 