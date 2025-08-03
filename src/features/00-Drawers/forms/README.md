# Forms Structure

This directory contains all drawer forms organized by business type and separated into logical components.

## Directory Structure

```
forms/
├── dental/
│   ├── patient/
│   │   ├── actions/          # Business logic and data processing
│   │   ├── views/           # UI components for different views
│   │   ├── form/            # Form-specific components
│   │   ├── PatientForm.jsx  # Main form component
│   │   └── index.js         # Export file
│   ├── appointments/        # Timeline/Appointments management
│   │   ├── actions/
│   │   │   ├── appointmentActions.js    # Main appointment logic
│   │   │   └── operativeDetailsActions.js # Operative details logic
│   │   ├── views/
│   │   │   ├── AppointmentViewToggle.jsx
│   │   │   └── operative-details/
│   │   │       └── OperativeDetailsView.jsx
│   │   ├── form/
│   │   │   ├── AppointmentForm.jsx
│   │   │   └── TimelineFormActions.jsx
│   │   ├── TimelineForm.jsx # Main timeline component
│   │   └── index.js
│   └── service/
└── general/
    ├── member/
    ├── permissions/
    ├── stock/
    └── user/
```

## Component Separation

Each form is separated into three main categories:

### 1. Actions (`/actions/`)
Contains business logic, validation, and data processing:
- `*Actions.js` - Main business logic functions
- `mockData.js` - Mock data for development/testing
- Validation functions
- Data transformation functions
- API interaction handlers

### 2. Views (`/views/`)
Contains UI components for different views:
- View-specific components (e.g., `AppointmentHistoryView.jsx`)
- Toggle components for switching between views
- Display-only components
- Sub-views for complex forms

### 3. Form (`/form/`)
Contains form-specific components:
- `*FormFields.jsx` - Field rendering components
- `*FormActions.jsx` - Action buttons (save, cancel, delete)
- `*DetailsForm.jsx` - Main form layout
- Input handling and validation display

## Usage Example

```jsx
// Import the main form component
import PatientForm from './dental/patient';

// Use in your component
<PatientForm 
  mode="create" 
  data={patientData}
  onSubmit={handleSubmit}
  onDelete={handleDelete}
  onCancel={handleCancel}
  isLoading={false}
/>
```

## Benefits of This Structure

1. **Separation of Concerns**: Business logic, UI, and form handling are clearly separated
2. **Reusability**: Components can be reused across different forms
3. **Maintainability**: Easy to find and modify specific functionality
4. **Testability**: Each component can be tested independently
5. **Scalability**: Easy to add new forms or extend existing ones

## Migrated Forms

### ✅ Completed - All Forms Migrated!
- `dental/patient/` - Patient management form with multiple views (details, notes, history)
- `dental/appointments/` - Timeline/Appointment management with sub-views:
  - Main appointment form
  - Operative details view
  - Gallery view with image upload
- `dental/service/` - Service/treatment management (business-type aware)
- `general/member/` - Team member management with role integration
- `general/permissions/` - Role and permissions management with interactive UI
- `general/stock/` - Inventory management (business-type specific fields)
- `general/user/` - User profile management with tabs (profile, notifications, notes)

## Adding New Forms

1. Create the directory structure:
   ```bash
   mkdir -p forms/[business-type]/[form-name]/{actions,views,form}
   ```

2. Create the action files:
   - `actions/[formName]Actions.js` - Business logic
   - `actions/mockData.js` - Mock data (if needed)

3. Create the view components:
   - `views/[ViewName]View.jsx` - Individual views
   - `views/[FormName]ViewToggle.jsx` - View switcher (if multiple views)

4. Create the form components:
   - `form/[FormName]FormFields.jsx` - Field rendering
   - `form/[FormName]FormActions.jsx` - Action buttons
   - `form/[FormName]DetailsForm.jsx` - Main form layout

5. Create the main component:
   - `[FormName]Form.jsx` - Main form component
   - `index.js` - Export file

6. Update imports in parent components to use the new structure

## Styling

All forms use the unified styling system from `../../styles/FormStyles.module.css` which implements the shadcn light theme.