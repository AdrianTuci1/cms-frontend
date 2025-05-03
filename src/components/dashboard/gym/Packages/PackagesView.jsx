import React, { useState } from 'react';
import AvailablePackages from './AvailablePackages';
import ManagePackages from './ManagePackages';

const PackagesView = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px'
        }}>
          <button
            onClick={() => handleTabChange(null, 0)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: selectedTab === 0 ? '#1976d2' : '#666',
              borderBottom: selectedTab === 0 ? '2px solid #1976d2' : 'none',
              fontWeight: selectedTab === 0 ? '600' : '400'
            }}
          >
            Pachete Disponibile
          </button>
          <button
            onClick={() => handleTabChange(null, 1)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: selectedTab === 1 ? '#1976d2' : '#666',
              borderBottom: selectedTab === 1 ? '2px solid #1976d2' : 'none',
              fontWeight: selectedTab === 1 ? '600' : '400'
            }}
          >
            Gestionare Pachete
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {selectedTab === 0 && <AvailablePackages />}
        {selectedTab === 1 && <ManagePackages />}
      </div>
    </div>
  );
};

export default PackagesView; 