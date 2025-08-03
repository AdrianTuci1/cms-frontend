import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';
import { getMockDentalNotes } from '../actions/mockData';

const DentalNotesView = () => {
  const dentalNotes = getMockDentalNotes();

  return (
    <div className={styles.notesContent}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3>Dental Notes</h3>
        <button style={{
          padding: '0.5rem 1rem',
          border: '1px solid hsl(221.2 83.2% 53.3%)',
          borderRadius: '0.375rem',
          background: 'hsl(221.2 83.2% 53.3%)',
          color: 'white',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}>
          + Add Note
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {dentalNotes.map(note => (
          <div key={note.id} style={{
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
                <strong>{note.date}</strong>
              </div>
              <div style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                background: 'hsl(210 40% 98%)',
                color: 'hsl(215.4 16.3% 46.9%)',
                border: '1px solid hsl(214.3 31.8% 91.4%)'
              }}>
                {note.category}
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', marginBottom: '0.5rem' }}>
              {note.doctor}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'hsl(222.2 84% 4.9%)', marginBottom: '0.5rem' }}>
              {note.content}
            </div>
            {note.attachments.length > 0 && (
              <div style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)' }}>
                <strong>Attachments:</strong>
                {note.attachments.map((attachment, index) => (
                  <span key={index} style={{ 
                    marginLeft: '0.5rem',
                    color: 'hsl(221.2 83.2% 53.3%)',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}>
                    {attachment}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {dentalNotes.length === 0 && (
        <p style={{ textAlign: 'center', color: 'hsl(215.4 16.3% 46.9%)', padding: '2rem' }}>
          No dental notes available
        </p>
      )}
    </div>
  );
};

export default DentalNotesView;