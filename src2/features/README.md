# Features Directory Documentation

This directory contains the main feature modules of the CMS Frontend application, organized using a feature-based architecture. Each feature is self-contained with its own components, views, stores, and styles.

## Directory Structure

```
features/
├── 00-Drawers/          # Drawer components and AI Assistant
├── 01-Home/             # Main dashboard and timeline views
├── 02-Stocks/           # Inventory and stock management
├── 03-Invoices/         # Invoice management and billing
├── 04-Automations/      # Workflow automation and AI assistants
├── 05-Activities/       # History tracking and activity logs
├── 06-Admin/            # User management and administration
├── 07-Signin/           # Authentication and sign-in
└── README.md            # This documentation
```

## Feature Modules

### 00-Drawers
**Purpose**: Provides drawer functionality and AI Assistant chat interface

**Structure**:
- `agent/` - AI Assistant chat functionality with components, hooks, and utilities
- `forms/` - Form components for data entry
- `layout/` - Layout components for drawer positioning
- `store/` - State management for drawers and AI assistant

**Key Features**:
- AI Assistant chat with modern React patterns
- Drawer system for modal-like interactions
- Form components for data entry
- State management with Zustand

**Components**:
- `AIAssistantChat` - Main chat container
- `Chat` - Message display component
- `ChatInput` - Message input with auto-resize
- `Message` - Individual message component
- `Notifications` - Notification system

### 01-Home
**Purpose**: Main dashboard and business-specific timeline views

**Structure**:
- `components/` - Reusable UI components
- `views/` - Main view components
- `store/` - State management for timeline data

**Key Features**:
- Business-type specific timelines (Dental, Gym, Hotel)
- Dashboard overview components
- Timeline management for appointments and activities

**Views**:
- `TimelineView` - Main timeline interface
- `SalesView` - Sales and revenue tracking
- `ClientsView` - Client management interface
- `ServicesView` - Service management

### 02-Stocks
**Purpose**: Inventory and stock management system

**Structure**:
- `components/` - Stock-related UI components
- `views/` - Main stock management views

**Key Features**:
- Current inventory tracking
- Low stock alerts
- Add new stock items
- Print inventory reports
- Resizable panels for better UX

**Components**:
- `InventoryCard` - Individual inventory item display
- `LowStockCard` - Low stock warning cards
- `AddStockForm` - Form for adding new items
- `StockNavbar` - Navigation and actions

### 03-Invoices
**Purpose**: Invoice management and billing system

**Structure**:
- `components/` - Invoice-related UI components
- `views/` - Invoice management views

**Key Features**:
- Recent invoices display
- Billing suggestions
- Search and filter functionality
- Multi-business type support (Hotel, Restaurant, Apartment)

**Components**:
- `InvoiceCard` - Individual invoice display
- Search and filter controls
- Add new invoice functionality

### 04-Automations
**Purpose**: Workflow automation and AI assistant management

**Structure**:
- `components/` - Automation UI components
- `styles/` - CSS modules for styling
- `views/` - Automation management views

**Key Features**:
- Workflow management
- Trigger system
- AI assistant configuration
- Automation rules

**Views**:
- `AssistantsView` - AI assistant management
- `TriggersView` - Trigger configuration
- `AutomationSection` - Main automation interface

### 05-Activities
**Purpose**: History tracking and activity logging

**Structure**:
- `components/` - Activity-related UI components
- `views/` - History and activity views
- `store/` - State management for history data

**Key Features**:
- Activity history tracking
- Time-based filtering
- Activity type categorization
- User activity monitoring
- AI-generated activities

**Views**:
- `HistoryView` - Main history interface
- `ReportsView` - Activity reports
- `TimeframeView` - Time-based filtering

**Components**:
- `HistoryList` - Activity list display
- `TimeframeView` - Time range selection
- Report components for different activity types

### 06-Admin
**Purpose**: User management and system administration

**Structure**:
- `components/` - Admin UI components
- `views/` - Administration views

**Key Features**:
- User management
- Role-based access control
- Staff profile management
- Email management for different roles

**Views**:
- `AdminView` - Main administration interface

**Components**:
- `MembersTab` - User management interface
- `RolesTab` - Role and permission management
- `StaffProfileModal` - Staff profile editing

### 07-Signin
**Purpose**: Authentication and user sign-in

**Structure**:
- `store/` - Authentication state management

**Key Features**:
- User authentication
- Session management
- Sign-in state tracking

## Common Patterns

### State Management
Each feature uses Zustand for state management with dedicated stores:
- `drawerStore` - Drawer state management
- `aiAssistantStore` - AI assistant state
- `historyStore` - Activity history state
- Feature-specific stores for local state

### Component Structure
Features follow a consistent structure:
- `components/` - Reusable UI components
- `views/` - Main view components
- `store/` - State management (when needed)
- `styles/` - CSS modules (when needed)

### Business Type Support
The application supports multiple business types:
- Dental Clinic
- Gym
- Hotel
- Restaurant
- Apartment

Each business type has specific components and views tailored to their needs.

## Usage

To use a feature, import the main view component:

```javascript
// Import main views
import TimelineView from './features/01-Home/views/01-Timeline/TimelineView';
import StocksView from './features/02-Stocks/views/StocksView';
import InvoicesSection from './features/03-Invoices/views/InvoicesSection';
import AutomationSection from './features/04-Automations/views/AutomationSection';
import HistoryView from './features/05-Activities/views/01-History/HistoryView';
import AdminView from './features/06-Admin/views/AdminView';

// Import stores
import useDrawerStore from './features/00-Drawers/store/drawerStore';
import useHistoryStore from './features/05-Activities/store/historyStore';
```

## Development Guidelines

1. **Feature Isolation**: Each feature should be self-contained with minimal dependencies on other features
2. **State Management**: Use Zustand stores for feature-specific state
3. **Component Reusability**: Create reusable components within features
4. **Business Type Support**: Ensure components work across different business types
5. **CSS Modules**: Use CSS modules for styling to avoid conflicts
6. **Type Safety**: Use TypeScript interfaces for better development experience

## File Naming Conventions

- Components: PascalCase (e.g., `InventoryCard.jsx`)
- Views: PascalCase with "View" suffix (e.g., `StocksView.jsx`)
- Stores: camelCase with "Store" suffix (e.g., `drawerStore.js`)
- Styles: PascalCase with "module.css" suffix (e.g., `StocksView.module.css`)
- Utilities: camelCase (e.g., `messageUtils.js`)
- Hooks: camelCase with "use" prefix (e.g., `useAutoScroll.js`)
