# CMS Frontend - Multi-Business Management System

A modern management system for different types of businesses (dental, gym, hotel, etc.) built with React and Vite.

## 🚀 Features

### 📊 Multi-Business Dashboard
- **Dental Clinic**: Appointment management, patients, dental services
- **Gym/Fitness**: Member management, classes, subscriptions
- **Hotel**: Reservations, rooms, clients
- **Sales**: Sales system and POS

### 🏗️ Advanced Architecture
- **Design Patterns**: Command, Strategy, Observer, Factory
- **Data Sync**: Automatic synchronization between API and local cache
- **Offline Support**: Offline functionality with IndexedDB
- **Multi-Tenant**: Support for multiple locations and tenants

### 🔐 Authentication and Security
- JWT Authentication with refresh tokens
- Role-based access control (RBAC)
- Multi-location support
- Secure API communication

### 📱 Modern Interface
- Drawer-based navigation
- Responsive design
- Real-time updates
- AI Assistant integration

## 🛠️ Technologies

- **Frontend**: React 18, Vite
- **State Management**: Zustand
- **Styling**: CSS Modules
- **API Client**: Custom HTTP client with interceptors
- **Database**: IndexedDB for local cache
- **Testing**: Vitest
- **Build Tool**: Vite

## 📁 Project Structure

```
cms-frontend/
├── src/
│   ├── api/                    # API client and services
│   │   ├── core/              # Main HTTP client
│   │   ├── services/          # Specific services
│   │   └── hooks/             # API hooks
│   ├── design-patterns/       # Design pattern implementations
│   │   ├── command/           # Command pattern
│   │   ├── data-sync/         # Data synchronization
│   │   ├── observer/          # Event system
│   │   └── strategy/          # Business logic strategies
│   ├── features/              # Main functionalities
│   │   ├── 00-Drawers/        # Drawer system
│   │   ├── 01-Home/           # Main dashboard
│   │   ├── 02-Stocks/         # Inventory management
│   │   ├── 03-Invoices/       # Invoices
│   │   ├── 04-Automations/    # Workflows and automations
│   │   ├── 05-Activities/     # History and reports
│   │   ├── 06-Admin/          # Administration
│   │   └── 07-Signin/         # Authentication
│   ├── layout/                # Layouts and navigation
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities and helpers
│   └── socket/                # WebSocket integration
├── public/                    # Static assets
└── testData/                  # Test data
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cms-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Configuration

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_TENANT_ID=your-tenant-id

# WebSocket
VITE_WEBSOCKET_URL=ws://localhost:3001

# Feature Flags
VITE_ENABLE_AI_ASSISTANT=true
VITE_ENABLE_OFFLINE_MODE=true
```

### Start Development Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run tests
npm run test
```

## 🏗️ Architecture

### Implemented Design Patterns

#### 1. Command Pattern
```javascript
import { Command } from '@/design-patterns/command/base/Command';

// Example command for creating an appointment
class CreateAppointmentCommand extends Command {
  execute(data) {
    return this.apiClient.post('/api/dental/timeline', data);
  }
}
```

#### 2. Data Sync Pattern
```javascript
import { useDataSync } from '@/design-patterns/hooks/useDataSync';

// Automatic synchronization with local cache
const { data: appointments, create, update } = useDataSync('timeline', {
  businessType: 'dental'
});
```

#### 3. Observer Pattern
```javascript
import { EventBus } from '@/design-patterns/observer/base/EventBus';

// Listen for events
EventBus.subscribe('appointment:created', (data) => {
  console.log('New appointment:', data);
});
```

### API Client Architecture

```javascript
import apiClient from '@/api/core/client/ApiClient';

// Request with automatic authentication
const response = await apiClient.post('/api/dental/timeline', {
  clientId: 'client-123',
  doctorId: 'doctor-456',
  date: '2024-01-20',
  time: '14:30'
});
```

## 📊 Main Features

### Multi-Business Dashboard

#### Dental Clinic
- **Timeline**: Weekly appointments with doctor view
- **Clients**: Patient management with medical history
- **Services**: Treatment packages and pricing
- **Reports**: Consultation statistics and revenue

#### Gym/Fitness
- **Members**: Subscription and access management
- **Classes**: Class schedule and bookings
- **Occupancy**: Real-time monitoring
- **Packages**: Subscription types

#### Hotel
- **Reservations**: Room calendar and availability
- **Clients**: Guest management
- **Rooms**: Types and status
- **Check-in/out**: Automated processes

### Inventory System
- **Inventory**: Product and quantity tracking
- **Alerts**: Low stock notifications
- **Suppliers**: Relationship management
- **Reports**: Consumption and costs

### Invoices and Sales
- **Invoices**: Generation and management
- **POS**: Sales system
- **Payments**: Multiple payment methods
- **Reports**: Revenue and analytics

### Automations
- **Workflows**: Automated processes
- **AI Assistant**: Intelligent assistant
- **Notifications**: SMS, email, push
- **Triggers**: Events and actions

## 🔧 Business Type Configuration

```javascript
// Configuration for dental clinic
import { businessTypes } from '@/config/businessTypes';

const dentalConfig = {
  type: 'dental',
  features: ['timeline', 'clients', 'services', 'invoices'],
  timeline: {
    duration: 30, // minutes
    workingHours: { start: '08:00', end: '18:00' }
  }
};
```

## 📱 Custom Hooks

### useDataSync
```javascript
import { useDataSync } from '@/design-patterns/hooks/useDataSync';

function AppointmentsList() {
  const { data, loading, error, create, update, remove } = useDataSync('timeline', {
    businessType: 'dental',
    params: { date: '2024-01-15' }
  });

  return (
    <div>
      {data.map(appointment => (
        <AppointmentCard key={appointment.id} data={appointment} />
      ))}
    </div>
  );
}
```

### useBusinessLogic
```javascript
import { useBusinessLogic } from '@/design-patterns/hooks/useBusinessLogic';

function AppointmentForm() {
  const businessLogic = useBusinessLogic('dental');
  
  const handleSubmit = (formData) => {
    const validation = businessLogic.validateData(formData, 'timeline');
    if (validation.isValid) {
      // Submit data
    }
  };
}
```

## 🔐 Authentication and Permissions

### Login
```javascript
import { authStore } from '@/features/07-Signin/store/authStore';

const login = async (email, password) => {
  const response = await apiClient.post('/api/auth', { email, password });
  authStore.setTokens(response.data.token, response.data.refreshToken);
};
```

### Permission Check
```javascript
import { useHasPermissions } from '@/hooks/useHasPermissions';

function AdminPanel() {
  const canManageUsers = useHasPermissions(['manage:users']);
  
  return canManageUsers ? <UserManagement /> : <AccessDenied />;
}
```

## 📊 Reports and Analytics

### Generate Report
```javascript
import { reportsStore } from '@/features/05-Activities/store/reportsStore';

const generateReport = async () => {
  const report = await reportsStore.generateReport({
    type: 'monthly_sales',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    format: 'pdf'
  });
};
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Examples
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimelineView from '@/features/01-Home/views/01-Timeline/TimelineView';

describe('TimelineView', () => {
  it('should render timeline correctly', () => {
    render(<TimelineView />);
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Server Configuration
```bash
# Serve static files
npm run preview

# Or with nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📚 API Documentation

For complete API request examples, see:
- [API Request Examples](./API_REQUEST_EXAMPLES.md)
- [API Architecture](./src/api/ARCHITECTURE.md)
- [Design Patterns](./src/design-patterns/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🆘 Support

For questions and support:
- Open an issue on GitHub
- Contact the development team
- Consult the technical documentation

---

**CMS Frontend** - A modern system for business management 🚀
