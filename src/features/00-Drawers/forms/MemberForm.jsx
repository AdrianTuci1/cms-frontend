import React, { useState } from 'react';
import { getBusinessTypeKey, getBusinessTypeKeyForSync } from '../../../../src/config/businessTypes';
import BaseForm from './BaseForm';
import styles from './MemberForm.module.css';
import { useDataSync } from '../../../design-patterns/hooks';

const MemberForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessTypeKey = getBusinessTypeKey();
  const businessTypeForSync = getBusinessTypeKeyForSync(businessTypeKey);
  const [activeView, setActiveView] = useState('details'); // 'details' or 'appointments'
  
  // Use useDataSync to fetch roles
  const rolesSync = useDataSync('roles', {
    businessType: businessTypeForSync,
    enableValidation: true,
    enableBusinessLogic: true
  });
  
  // Only show for dental clinics
  if (businessTypeKey !== 'DENTAL') {
    return null;
  }
  
  // Simplified fields for dental clinics
  const getFields = () => {
    // Get role options from the roles data sync
    const roleOptions = (rolesSync.items || []).map(role => ({
      value: role.id.toString(),
      label: role.name
    }));

    return [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email Address', required: true },
      { 
        name: 'role', 
        type: 'select', 
        label: 'Role', 
        required: true,
        options: roleOptions
      },
      { name: 'dutyDays', type: 'textarea', label: 'Duty Days', placeholder: 'Enter duty days...' }
    ];
  };

  const getRequiredFields = () => {
    const fields = getFields();
    return fields.filter(field => field.required).map(field => field.name);
  };

  const handleSubmit = async (formData, mode) => {
    const processedData = {
      ...formData,
      businessType: businessTypeKey,
      status: 'active',
      createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      updatedAt: new Date().toISOString()
    };

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  const handleDelete = async (formData) => {
    if (onDelete) {
      await onDelete(formData);
    }
  };

  const renderUpcomingAppointments = () => {
    // Mock data - in real app this would come from props or API
    const appointments = [
      { id: 1, date: '2024-01-15', time: '10:00 AM', type: 'Check-up', status: 'Confirmed' },
      { id: 2, date: '2024-01-22', time: '2:30 PM', type: 'Cleaning', status: 'Pending' },
      { id: 3, date: '2024-01-29', time: '9:00 AM', type: 'Consultation', status: 'Confirmed' }
    ];

    return (
      <div className={styles['appointments-view']}>
        <h3>Upcoming Appointments</h3>
        <div className={styles['appointments-list']}>
          {appointments.map(appointment => (
            <div key={appointment.id} className={styles['appointment-card']}>
              <div className={styles['appointment-date']}>
                <strong>{appointment.date}</strong> at {appointment.time}
              </div>
              <div className={styles['appointment-type']}>{appointment.type}</div>
              <div className={`${styles['appointment-status']} ${styles[`status-${appointment.status.toLowerCase()}`]}`}>
                {appointment.status}
              </div>
            </div>
          ))}
        </div>
        {appointments.length === 0 && (
          <p className={styles['no-appointments']}>No upcoming appointments</p>
        )}
      </div>
    );
  };

  const renderViewToggle = () => {
    return (
      <div className={styles['view-toggle']}>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'details' ? styles.active : ''}`}
          onClick={() => setActiveView('details')}
        >
          Details
        </button>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'appointments' ? styles.active : ''}`}
          onClick={() => setActiveView('appointments')}
        >
          Upcoming Appointments
        </button>
      </div>
    );
  };

  return (
    <div className={styles['member-form-container']}>
      {renderViewToggle()}
      
      {activeView === 'details' ? (
        <BaseForm
          mode={mode}
          data={data}
          fields={getFields()}
          required={getRequiredFields()}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onCancel}
          isLoading={isLoading}
          title={`Dental Clinic ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'} Member`}
          businessType={businessTypeKey}
        />
      ) : (
        <div className={styles['appointments-container']}>
          {renderUpcomingAppointments()}
        </div>
      )}
    </div>
  );
};

export default MemberForm; 