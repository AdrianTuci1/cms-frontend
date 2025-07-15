import React from 'react';
import { useDrawer, DRAWER_MODES, DRAWER_TYPES } from '../index';
import useDrawerStore from '../store/drawerStore';
import styles from './DrawerExample.module.css';

const DrawerExample = () => {
  const { isOpen, currentMode, currentDrawerType } = useDrawer();
  const { openDrawer } = useDrawerStore();

  // Example data
  const sampleTimeline = {
    id: 1,
    clientId: 101,
    clientName: 'Maria Popescu',
    phoneNumber: '0712 345 678',
    email: 'maria.popescu@email.com',
    treatmentId: 1,
    displayTreatment: 'Control + Curățare',
    medicId: 1,
    medicName: 'Dr. Elena Ionescu',
    date: '2024-01-15T09:00:00',
    duration: 60,
    status: 'scheduled',
    color: '#1976d2',
    notes: 'Regular checkup'
  };

  const sampleStock = {
    id: 1,
    name: 'Protein Powder',
    code: 'PROD001',
    category: 'Supplements',
    quantity: 50,
    currentPrice: 25.50,
    minQuantity: 10,
    description: 'High-quality protein powder'
  };

  const sampleMember = {
    id: 1,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0723 456 789',
    role: 'Manager',
    workDays: [0, 1, 2, 3, 4],
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  const sampleService = {
    id: 1,
    name: 'Dental Cleaning',
    price: 100,
    duration: 60,
    category: 'Hygiene',
    description: 'Professional dental cleaning service'
  };

  // Handler functions
  const handleSave = async (data, mode) => {
    console.log(`${mode} data:`, data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Data saved successfully!');
  };

  const handleDelete = async (data) => {
    console.log('Deleting data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Data deleted successfully!');
  };

  const handleCancel = () => {
    console.log('Operation cancelled');
  };

  // Open drawer functions using the new API
  const openTimelineEdit = () => {
    openDrawer('edit', 'timeline', sampleTimeline, {
      onSave: handleSave,
      onDelete: handleDelete,
      onCancel: handleCancel
    });
  };

  const openTimelineCreate = () => {
    openDrawer('create', 'timeline', null, {
      onSave: handleSave,
      onCancel: handleCancel
    });
  };

  const openStockEdit = () => {
    openDrawer('edit', 'stock', sampleStock, {
      onSave: handleSave,
      onDelete: handleDelete,
      onCancel: handleCancel
    });
  };

  const openStockCreate = () => {
    openDrawer('create', 'stock', null, {
      onSave: handleSave,
      onCancel: handleCancel
    });
  };

  const openMemberEdit = () => {
    openDrawer('edit', 'member', sampleMember, {
      onSave: handleSave,
      onDelete: handleDelete,
      onCancel: handleCancel
    });
  };

  const openMemberCreate = () => {
    openDrawer('create', 'member', null, {
      onSave: handleSave,
      onCancel: handleCancel
    });
  };

  const openServiceEdit = () => {
    openDrawer('edit', 'service', sampleService, {
      onSave: handleSave,
      onDelete: handleDelete,
      onCancel: handleCancel
    });
  };

  const openServiceCreate = () => {
    openDrawer('create', 'service', null, {
      onSave: handleSave,
      onCancel: handleCancel
    });
  };

  const openUserDrawer = () => {
    openDrawer('view', 'user', null, {
      onClose: () => console.log('User drawer closed')
    });
  };

  return (
    <div className={styles.container}>
      <h2>Drawer System Example</h2>
      <p>Demonstrating the new simplified API: openDrawer('mode', 'type', 'data')</p>

      <div className={styles.status}>
        <p>Drawer Status: {isOpen ? 'Open' : 'Closed'}</p>
        {isOpen && (
          <p>Current: {currentMode} {currentDrawerType}</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>Timeline Drawers</h3>
        <div className={styles.buttonGroup}>
          <button onClick={openTimelineCreate} className={styles.button}>
            Create Timeline
          </button>
          <button onClick={openTimelineEdit} className={styles.button}>
            Edit Timeline
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Stock Drawers</h3>
        <div className={styles.buttonGroup}>
          <button onClick={openStockCreate} className={styles.button}>
            Create Stock
          </button>
          <button onClick={openStockEdit} className={styles.button}>
            Edit Stock
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Member Drawers</h3>
        <div className={styles.buttonGroup}>
          <button onClick={openMemberCreate} className={styles.button}>
            Create Member
          </button>
          <button onClick={openMemberEdit} className={styles.button}>
            Edit Member
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Service Drawers</h3>
        <div className={styles.buttonGroup}>
          <button onClick={openServiceCreate} className={styles.button}>
            Create Service
          </button>
          <button onClick={openServiceEdit} className={styles.button}>
            Edit Service
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>User Drawer (with useDataSync & Auth)</h3>
        <div className={styles.buttonGroup}>
          <button onClick={openUserDrawer} className={styles.button}>
            Open User Profile
          </button>
        </div>
        <p className={styles.description}>
          This drawer uses the useDataSync hook to fetch user data from the API with fallback to userDataMock. 
          The component shows authentication data (roles, permissions, business type) and profile information.
          Data comes from JWT token during login and additional profile data from /api/userData endpoint.
        </p>
      </div>

      <div className={styles.codeExample}>
        <h3>Code Example</h3>
                 <pre>
{`// Open drawer for editing
openDrawer('edit', 'timeline', timelineData, {
  onSave: async (data, mode) => {
    await updateTimeline(data);
  },
  onDelete: async (data) => {
    await deleteTimeline(data.id);
  }
});

// Open drawer for creating
openDrawer('create', 'stock', null, {
  onSave: async (data) => {
    await createStock(data);
  }
});`}
        </pre>
      </div>
    </div>
  );
};

export default DrawerExample; 