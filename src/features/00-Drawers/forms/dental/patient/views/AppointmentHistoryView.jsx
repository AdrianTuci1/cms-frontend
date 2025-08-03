import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';
import { getMockAppointments } from '../actions/mockData';

const AppointmentHistoryView = () => {
  const appointments = getMockAppointments();

  return (
    <div className={styles.historyContent}>
      <h3>Appointment History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(appointment => (
          <div key={appointment.id} style={{
            padding: '1rem',
            border: '1px solid hsl(214.3 31.8% 91.4%)',
            borderRadius: '0.5rem',
            background: 'hsl(0 0% 100%)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{ fontWeight: '600', color: 'hsl(222.2 84% 4.9%)' }}>
                <strong>{appointment.date}</strong> at {appointment.time}
              </div>
              <div style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                background: appointment.status === 'Completed' ? 'hsl(142.1 76.2% 36.3% / 0.1)' : 
                           appointment.status === 'Scheduled' ? 'hsl(221.2 83.2% 53.3% / 0.1)' : 
                           'hsl(47.9 95.8% 53.1% / 0.1)',
                color: appointment.status === 'Completed' ? 'hsl(142.1 76.2% 36.3%)' : 
                       appointment.status === 'Scheduled' ? 'hsl(221.2 83.2% 53.3%)' : 
                       'hsl(47.9 95.8% 53.1%)'
              }}>
                {appointment.status}
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'hsl(222.2 84% 4.9%)', marginBottom: '0.25rem' }}>
              {appointment.type}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', marginBottom: '0.25rem' }}>
              {appointment.doctor}
            </div>
            {appointment.notes && (
              <div style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontStyle: 'italic' }}>
                {appointment.notes}
              </div>
            )}
          </div>
        ))}
      </div>
      {appointments.length === 0 && (
        <p style={{ textAlign: 'center', color: 'hsl(215.4 16.3% 46.9%)', padding: '2rem' }}>
          No appointment history
        </p>
      )}
    </div>
  );
};

export default AppointmentHistoryView;