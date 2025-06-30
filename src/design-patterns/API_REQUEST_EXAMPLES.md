# API Request Examples

Această documentație conține exemple complete de request-uri către server, inclusiv structura URL-ului, header-ele și datele trimise.

## Autentificare (fără JWT)

### Login
```javascript
// POST /api/auth
const loginRequest = {
  url: '/api/auth',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'tenant-123'
  },
  data: {
    email: 'user@example.com',
    password: 'password123'
  }
};

// Răspuns
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "expiresIn": 3600,
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": ["admin"],
      "permissions": ["read", "write", "delete"]
    }
  }
}
```

### Refresh Token
```javascript
// POST /api/auth/refresh
const refreshRequest = {
  url: '/api/auth/refresh',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'tenant-123'
  },
  data: {
    refreshToken: 'refresh-token-here'
  }
};
```

### Logout
```javascript
// POST /api/auth/logout
const logoutRequest = {
  url: '/api/auth/logout',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  }
};
```

## Informații Business (fără JWT)

### Obține informații business
```javascript
// GET /api/business-info
const businessInfoRequest = {
  url: '/api/business-info',
  method: 'GET',
  headers: {
    'X-Tenant-ID': 'tenant-123'
  }
};

// Răspuns
{
  "success": true,
  "data": {
    "tenant": {
      "id": "tenant-123",
      "name": "Dental Clinic Network",
      "type": "dental"
    },
    "locations": [
      {
        "id": "location-456",
        "name": "Clinic Central",
        "address": "Strada Principală 123",
        "phone": "+40 123 456 789"
      },
      {
        "id": "location-789",
        "name": "Clinic Nord",
        "address": "Strada Nordului 456",
        "phone": "+40 987 654 321"
      }
    ]
  }
}
```

## Facturi (cu JWT)

### Obține toate facturile
```javascript
// GET /api/invoices
const getInvoicesRequest = {
  url: '/api/invoices',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    page: 1,
    limit: 20,
    status: 'pending',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31'
  }
};
```

### Creează factură nouă
```javascript
// POST /api/invoices
const createInvoiceRequest = {
  url: '/api/invoices',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    clientId: "client-123",
    items: [
      {
        serviceId: "service-456",
        quantity: 1,
        price: 150.00,
        description: "Consultare stomatologică"
      },
      {
        serviceId: "service-789",
        quantity: 2,
        price: 75.00,
        description: "Detartraj"
      }
    ],
    totalAmount: 300.00,
    dueDate: "2024-02-15",
    notes: "Factură pentru serviciile din ianuarie"
  }
};
```

### Actualizează factură
```javascript
// PUT /api/invoices/{id}
const updateInvoiceRequest = {
  url: '/api/invoices/invoice-123',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    status: 'paid',
    paidAmount: 300.00,
    paidDate: '2024-02-10',
    paymentMethod: 'card'
  }
};
```

### Șterge factură
```javascript
// DELETE /api/invoices/{id}
const deleteInvoiceRequest = {
  url: '/api/invoices/invoice-123',
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  }
};
```

## Stocuri (cu JWT)

### Obține toate stocurile
```javascript
// GET /api/stocks
const getStocksRequest = {
  url: '/api/stocks',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    category: 'dental_supplies',
    lowStock: true,
    search: 'pastă'
  }
};
```

### Adaugă produs în stoc
```javascript
// POST /api/stocks
const addStockRequest = {
  url: '/api/stocks',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    name: "Pastă de dinți Colgate",
    category: "dental_supplies",
    quantity: 50,
    unit: "buc",
    price: 15.50,
    supplier: "Dental Supplies Ltd",
    minQuantity: 10,
    expiryDate: "2025-12-31"
  }
};
```

### Actualizează cantitatea
```javascript
// PATCH /api/stocks/{id}/quantity
const updateStockQuantityRequest = {
  url: '/api/stocks/stock-123/quantity',
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    quantity: 45,
    operation: 'decrease', // 'increase' sau 'decrease'
    reason: 'consumed',
    notes: 'Folosit pentru pacienți'
  }
};
```

## Vânzări (cu JWT)

### Obține vânzările
```javascript
// GET /api/sales
const getSalesRequest = {
  url: '/api/sales',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    paymentMethod: 'card',
    employeeId: 'employee-123'
  }
};
```

### Creează vânzare
```javascript
// POST /api/sales
const createSaleRequest = {
  url: '/api/sales',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    items: [
      {
        productId: "product-123",
        quantity: 2,
        unitPrice: 25.00,
        totalPrice: 50.00
      }
    ],
    totalAmount: 50.00,
    paymentMethod: 'card',
    clientId: 'client-456',
    employeeId: 'employee-123',
    notes: 'Vânzare la ghișeu'
  }
};
```

## Timeline Business-Specific (cu JWT)

### Dental Timeline
```javascript
// GET /api/dental/timeline
const getDentalTimelineRequest = {
  url: '/api/dental/timeline',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    date: '2024-01-15',
    doctorId: 'doctor-123',
    status: 'confirmed'
  }
};

// POST /api/dental/timeline
const createDentalAppointmentRequest = {
  url: '/api/dental/timeline',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    clientId: 'client-123',
    doctorId: 'doctor-456',
    date: '2024-01-20',
    time: '14:30',
    duration: 60,
    service: 'consultation',
    notes: 'Prima consultație',
    status: 'confirmed'
  }
};
```

### Gym Timeline
```javascript
// GET /api/gym/timeline
const getGymTimelineRequest = {
  url: '/api/gym/timeline',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    date: '2024-01-15',
    classType: 'yoga',
    trainerId: 'trainer-123'
  }
};

// POST /api/gym/timeline
const createGymClassRequest = {
  url: '/api/gym/timeline',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    classType: 'yoga',
    trainerId: 'trainer-456',
    date: '2024-01-20',
    time: '18:00',
    duration: 90,
    maxParticipants: 20,
    room: 'Studio A',
    description: 'Yoga pentru începători'
  }
};
```

### Hotel Timeline
```javascript
// GET /api/hotel/timeline
const getHotelTimelineRequest = {
  url: '/api/hotel/timeline',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    date: '2024-01-15',
    roomType: 'double',
    status: 'occupied'
  }
};

// POST /api/hotel/timeline
const createHotelReservationRequest = {
  url: '/api/hotel/timeline',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    clientId: 'client-123',
    roomId: 'room-456',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    guests: 2,
    totalPrice: 500.00,
    status: 'confirmed',
    specialRequests: 'Late check-in'
  }
};
```

## Clienți Business-Specific (cu JWT)

### Dental Clients
```javascript
// GET /api/dental/clients
const getDentalClientsRequest = {
  url: '/api/dental/clients',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    search: 'Ion Popescu',
    status: 'active',
    lastVisitFrom: '2024-01-01'
  }
};

// POST /api/dental/clients
const createDentalClientRequest = {
  url: '/api/dental/clients',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    firstName: 'Ion',
    lastName: 'Popescu',
    email: 'ion.popescu@email.com',
    phone: '+40 123 456 789',
    birthDate: '1985-03-15',
    address: 'Strada Exemplu 123',
    medicalHistory: 'Alergie la penicilină',
    emergencyContact: {
      name: 'Maria Popescu',
      phone: '+40 987 654 321',
      relationship: 'soție'
    }
  }
};
```

### Gym Members
```javascript
// GET /api/gym/members
const getGymMembersRequest = {
  url: '/api/gym/members',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    membershipType: 'premium',
    status: 'active',
    joinDateFrom: '2024-01-01'
  }
};

// POST /api/gym/members
const createGymMemberRequest = {
  url: '/api/gym/members',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    firstName: 'Ana',
    lastName: 'Ionescu',
    email: 'ana.ionescu@email.com',
    phone: '+40 123 456 789',
    birthDate: '1990-07-22',
    membershipType: 'premium',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    emergencyContact: {
      name: 'Mihai Ionescu',
      phone: '+40 987 654 321',
      relationship: 'soț'
    }
  }
};
```

## Pachete Business-Specific (cu JWT)

### Dental Packages
```javascript
// GET /api/dental/packages
const getDentalPackagesRequest = {
  url: '/api/dental/packages',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    category: 'preventive',
    active: true
  }
};

// POST /api/dental/packages
const createDentalPackageRequest = {
  url: '/api/dental/packages',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    name: 'Pachet Igienă Orală',
    description: 'Consultare + Detartraj + Fluorizare',
    price: 200.00,
    duration: 90,
    services: [
      'consultation',
      'cleaning',
      'fluoridation'
    ],
    validFor: 365,
    category: 'preventive'
  }
};
```

### Gym Packages
```javascript
// GET /api/gym/packages
const getGymPackagesRequest = {
  url: '/api/gym/packages',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    type: 'membership',
    active: true
  }
};

// POST /api/gym/packages
const createGymPackageRequest = {
  url: '/api/gym/packages',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    name: 'Abonament Premium',
    description: 'Acces nelimitat + Clase de grup + Personal trainer',
    price: 150.00,
    duration: 30,
    type: 'membership',
    features: [
      'unlimited_access',
      'group_classes',
      'personal_trainer',
      'locker_room'
    ],
    maxVisits: -1 // nelimitat
  }
};
```

## Istoric (cu JWT)

### Obține istoricul
```javascript
// GET /api/history
const getHistoryRequest = {
  url: '/api/history',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    type: 'appointment',
    userId: 'user-123'
  }
};
```

## Workflow-uri (cu JWT)

### Obține workflow-urile
```javascript
// GET /api/workflows
const getWorkflowsRequest = {
  url: '/api/workflows',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  params: {
    status: 'active',
    type: 'automation'
  }
};

// POST /api/workflows
const createWorkflowRequest = {
  url: '/api/workflows',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    name: 'Reminder Programări',
    description: 'Trimite SMS cu 24h înainte de programare',
    type: 'automation',
    trigger: {
      type: 'appointment_created',
      conditions: {
        timeBefore: 24
      }
    },
    actions: [
      {
        type: 'send_sms',
        template: 'Reminder: Aveți programare mâine la {{time}}',
        recipients: ['{{client.phone}}']
      }
    ],
    active: true
  }
};
```

## Rapoarte (cu JWT)

### Generează raport
```javascript
// POST /api/reports
const generateReportRequest = {
  url: '/api/reports',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    type: 'monthly_sales',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    format: 'pdf',
    includeCharts: true,
    filters: {
      paymentMethod: 'card',
      employeeId: 'employee-123'
    }
  }
};
```

## Roluri și Permisiuni (cu JWT)

### Obține rolurile
```javascript
// GET /api/roles
const getRolesRequest = {
  url: '/api/roles',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  }
};

// POST /api/roles
const createRoleRequest = {
  url: '/api/roles',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    name: 'Manager',
    description: 'Manager cu acces complet',
    permissions: [
      'read:all',
      'write:all',
      'delete:all',
      'manage:users',
      'manage:settings'
    ]
  }
};
```

### Obține permisiunile
```javascript
// GET /api/permissions
const getPermissionsRequest = {
  url: '/api/permissions',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  }
};
```

## Date Utilizator (cu JWT)

### Obține datele utilizatorului
```javascript
// GET /api/userData
const getUserDataRequest = {
  url: '/api/userData',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  }
};

// PUT /api/userData
const updateUserDataRequest = {
  url: '/api/userData',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456',
    'Content-Type': 'application/json'
  },
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+40 123 456 789',
    preferences: {
      language: 'ro',
      theme: 'dark',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }
};
```

## Upload și Download

### Upload fișier
```javascript
// POST /api/upload
const uploadFileRequest = {
  url: '/api/upload',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  data: new FormData(), // Conține fișierul
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Upload progress: ${percentCompleted}%`);
  }
};
```

### Download fișier
```javascript
// GET /api/download/{fileId}
const downloadFileRequest = {
  url: '/api/download/file-123',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Tenant-ID': 'tenant-123',
    'X-Location-ID': 'location-456'
  },
  responseType: 'blob'
};
```

## Headers Comuni

### Headers pentru toate request-urile autentificate:
```javascript
const commonHeaders = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'X-Tenant-ID': 'tenant-123',
  'X-Location-ID': 'location-456',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Request-ID': 'unique-request-id',
  'X-Client-Version': '1.0.0'
};
```

### Headers pentru request-uri fără autentificare:
```javascript
const publicHeaders = {
  'X-Tenant-ID': 'tenant-123',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

## Răspunsuri de Eroare

### Eroare de autentificare (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "Token invalid sau expirat",
    "details": "Token-ul JWT a expirat"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Eroare de validare (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Date invalide",
    "details": {
      "email": "Adresa de email este obligatorie",
      "phone": "Numărul de telefon este invalid"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Eroare de server (500)
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Eroare internă de server",
    "details": "Contactați administratorul"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Utilizarea cu ApiClient

Toate aceste exemple pot fi folosite cu `ApiClient`:

```javascript
import apiClient from '@/api/core/client/ApiClient';

// Exemplu de utilizare
const response = await apiClient.post('/api/dental/timeline', {
  clientId: 'client-123',
  doctorId: 'doctor-456',
  date: '2024-01-20',
  time: '14:30',
  duration: 60,
  service: 'consultation'
});

// Sau cu parametri
const response = await apiClient.get('/api/invoices', {
  params: {
    page: 1,
    limit: 20,
    status: 'pending'
  }
});
``` 