# Drawer Styles

This directory contains unified styling for all drawer components.

## FormStyles.module.css

Unified form styling based on shadcn light theme. All drawer forms should use these styles instead of individual CSS files.

### Usage

```jsx
import styles from '../../styles/FormStyles.module.css';

// Basic form structure
<div className={styles.formContainer}>
  <div className={styles.viewToggle}>
    <button className={`${styles.toggleBtn} ${styles.active}`}>
      Tab 1
    </button>
  </div>
  
  <div className={styles.formContent}>
    <form className={styles.form}>
      <div className={styles.formFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Label</label>
          <input className={styles.formInput} />
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  </div>
</div>
```

### Available Classes

#### Layout
- `formContainer` - Main container for the entire form
- `form` - Form element wrapper
- `formFields` - Container for form fields
- `formContent`, `notesContent`, `historyContent` - Content areas for different views

#### Form Elements
- `formGroup` - Individual field container
- `formLabel` - Field labels (add `requiredLabel` for required fields)
- `formInput` - Text inputs
- `formSelect` - Select dropdowns
- `formTextarea` - Textarea elements
- `formCheckbox` - Checkbox inputs
- `checkboxLabel` - Checkbox label wrapper

#### States
- `error` - Error state for inputs
- `success` - Success state for inputs
- `disabled` - Disabled state

#### Actions
- `formActions` - Action buttons container
- `cancelButton` - Cancel/Close buttons
- `submitButton` - Submit/Save buttons
- `deleteButton` - Delete buttons

#### View Toggle
- `viewToggle` - Tab container
- `toggleBtn` - Individual tab button
- `active` - Active tab state
- `disabled` - Disabled tab state
- `toggleIcon` - Icon within tab

#### Utilities
- `errorMessage` - Error message display
- `spinner` - Loading spinner animation

### Responsive Design

The styles include responsive breakpoints:
- Mobile (≤768px): Single column layout, full-width buttons
- Small mobile (≤480px): Reduced padding and spacing

### Color Scheme (shadcn light theme)

- Background: `hsl(0 0% 100%)` (white)
- Borders: `hsl(214.3 31.8% 91.4%)` (light gray)
- Text: `hsl(222.2 84% 4.9%)` (dark)
- Muted text: `hsl(215.4 16.3% 46.9%)` (gray)
- Primary: `hsl(221.2 83.2% 53.3%)` (blue)
- Destructive: `hsl(0 84.2% 60.2%)` (red)
- Success: `hsl(142.1 76.2% 36.3%)` (green)

## Migration Guide

To migrate existing forms:

1. Replace individual CSS imports with `FormStyles.module.css`
2. Update class names to use the unified naming convention
3. Remove BaseForm dependency and implement form logic directly
4. Use the standard form structure shown above

## Forms Using This System

### ✅ Migrated Forms
- ✅ PatientForm (dental)
- ✅ MemberForm (general)
- ✅ AppointmentsForm (dental)
- ✅ GalleryForm (dental)
- ✅ OperativeDetailsForm (dental)
- ✅ ServiceForm (dental)
- ✅ TimelineForm (dental)
- ✅ PermissionsForm (general)
- ✅ StockForm (general)
- ✅ UserDrawer (general)

### 🗑️ Removed Files
- ❌ BaseForm.jsx - Eliminated, logic moved to individual forms
- ❌ BaseForm.module.css - Replaced with unified FormStyles.module.css
- ❌ All individual form CSS files - Consolidated into FormStyles.module.css

All forms now use the unified styling system with shadcn light theme!