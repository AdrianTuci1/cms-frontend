import React from 'react';
import useDrawer from '../hooks/useDrawer';
import { DRAWER_MODES } from '../store/drawerStore';

const DrawerExample = () => {
  const {
    openAppointmentDrawer,
    openStockDrawer,
    openMemberDrawer,
    openServiceDrawer,
    openAIAssistantDrawer,
    closeDrawer,
    closeAllDrawers,
    isDrawerOpen,
    hasUnsavedChanges,
    autoSaveEnabled,
    toggleAutoSave
  } = useDrawer();

  const handleOpenAppointment = () => {
    openAppointmentDrawer({
      data: {
        patientName: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        date: '2024-01-15',
        time: '10:00',
        treatmentType: 'cleaning',
        medicId: '1',
        notes: 'Regular checkup'
      },
      onSave: async (data) => {
        console.log('Appointment saved:', data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      onDelete: async (data) => {
        console.log('Appointment deleted:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleCreateAppointment = () => {
    openAppointmentDrawer({
      mode: DRAWER_MODES.CREATE,
      data: {
        date: '2024-01-20',
        time: '14:30'
      },
      onSave: async (data) => {
        console.log('New appointment created:', data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleOpenStock = () => {
    openStockDrawer({
      data: {
        name: 'Premium Widget',
        category: 'electronics',
        quantity: 50,
        price: 29.99,
        supplier: 'TechCorp',
        location: 'Warehouse A'
      },
      onSave: async (data) => {
        console.log('Stock saved:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleOpenMember = () => {
    openMemberDrawer({
      data: {
        name: 'Jane Smith',
        phoneNumber: '+1987654321',
        email: 'jane@example.com',
        membershipType: 'premium',
        joinDate: '2023-06-01'
      },
      onSave: async (data) => {
        console.log('Member saved:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleOpenService = () => {
    openServiceDrawer({
      data: {
        name: 'Deep Cleaning',
        price: 150,
        duration: 60,
        category: 'hygiene',
        description: 'Comprehensive dental cleaning'
      },
      onSave: async (data) => {
        console.log('Service saved:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleOpenAIAssistant = () => {
    openAIAssistantDrawer({
      data: {
        message: 'Help me manage my appointments',
        context: 'appointment-management'
      },
      onSave: async (data) => {
        console.log('AI Assistant data saved:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  };

  const handleOpenMultipleDrawers = () => {
    // This demonstrates that only AI assistant can open multiple drawers
    console.log('Opening AI assistant first...');
    openAIAssistantDrawer({
      data: { message: 'I need help with multiple tasks' }
    });
    
    // Wait a bit then try to open another drawer
    setTimeout(() => {
      console.log('Now trying to open appointment drawer...');
      openAppointmentDrawer({
        data: { patientName: 'Test Patient' }
      });
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Drawer System Example</h1>
      
      <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
        <h3>Auto-Save Feature</h3>
        <p>Edit mode drawers save automatically when closed. Create mode requires manual save.</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={toggleAutoSave}
          />
          Enable Auto-Save
        </label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '8px' }}>
          Auto-save is currently: <strong>{autoSaveEnabled ? 'Enabled' : 'Disabled'}</strong>
        </p>
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
        <h3>Database Querying Features</h3>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>Phone/Email Fields:</strong> Query database for existing users as you type</li>
          <li><strong>Searchable Options:</strong> Search through treatment types, doctors, etc.</li>
          <li><strong>Auto-fill:</strong> Click query results to populate form fields</li>
          <li><strong>Debounced:</strong> Queries trigger after 500ms of no typing</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
        <h3>Multiple Drawer Restriction</h3>
        <p>Only AI Assistant can open multiple drawers. Other drawers will close existing ones.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Appointment Drawer</h3>
          <p>Open appointment drawer with sample data</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={handleOpenAppointment}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Open Appointment (Edit)
            </button>
            <button 
              onClick={handleCreateAppointment}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Create New Appointment
            </button>
          </div>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Stock Drawer</h3>
          <p>Open stock management drawer</p>
          <button 
            onClick={handleOpenStock}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Open Stock
          </button>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Member Drawer</h3>
          <p>Open member management drawer</p>
          <button 
            onClick={handleOpenMember}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Open Member
          </button>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Service Drawer</h3>
          <p>Open service management drawer</p>
          <button 
            onClick={handleOpenService}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Open Service
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3>AI Assistant Drawer</h3>
        <p>AI Assistant can open multiple drawers (including member drawer from appointment)</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenAIAssistant}
            style={{
              padding: '8px 16px',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Open AI Assistant
          </button>
          
          <button 
            onClick={handleOpenMultipleDrawers}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Test Multiple Drawers
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3>Drawer Management</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={closeAllDrawers}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close All Drawers
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3>Current State</h3>
        <div style={{ fontSize: '0.875rem' }}>
          <p>Appointment drawer open: {isDrawerOpen('appointment') ? 'Yes' : 'No'}</p>
          <p>Stock drawer open: {isDrawerOpen('stock') ? 'Yes' : 'No'}</p>
          <p>Member drawer open: {isDrawerOpen('member') ? 'Yes' : 'No'}</p>
          <p>Service drawer open: {isDrawerOpen('service') ? 'Yes' : 'No'}</p>
          <p>AI Assistant drawer open: {isDrawerOpen('ai-assistant') ? 'Yes' : 'No'}</p>
          <p>Has unsaved changes: {hasUnsavedChanges() ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e' }}>
        <h3>Key Features Demonstrated</h3>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Edit mode: Auto-save on drawer close</li>
          <li>Create mode: Manual save required</li>
          <li>Database querying for phone/email fields</li>
          <li>Searchable options for select fields</li>
          <li>Only AI Assistant can open multiple drawers</li>
          <li>Member drawer can be opened from appointment drawer</li>
          <li>Business-type specific forms and fields</li>
          <li>Real-time change tracking</li>
          <li>Debounced queries and searches</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
        <h3>Testing Instructions</h3>
        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>Database Querying:</strong> Type in phone number or email fields to see query results</li>
          <li><strong>Search Options:</strong> Type in treatment type or doctor fields to search options</li>
          <li><strong>Auto-fill:</strong> Click on query results to populate form fields</li>
          <li><strong>Create Mode:</strong> Use "Create New Appointment" to test manual save</li>
          <li><strong>Edit Mode:</strong> Use "Open Appointment (Edit)" to test auto-save</li>
          <li><strong>Multiple Drawers:</strong> Try opening AI Assistant then another drawer</li>
        </ol>
      </div>
    </div>
  );
};

export default DrawerExample; 