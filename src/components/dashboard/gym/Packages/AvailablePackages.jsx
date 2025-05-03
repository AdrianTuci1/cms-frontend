import React from 'react';
import { MdMilitaryTech } from 'react-icons/md';
import { MdDiamond } from 'react-icons/md';
import { MdShield } from 'react-icons/md';
import { MdHandyman } from 'react-icons/md';
import { MdConfirmationNumber } from 'react-icons/md';

const subscriptionIcons = {
  gold: <MdMilitaryTech style={{ color: 'gold' }} />,
  silver: <MdDiamond style={{ color: '#b0c4de' }} />,
  black: <MdShield style={{ color: '#333' }} />,
  service: <MdHandyman style={{ color: '#8b5cf6' }} />,
  none: <MdConfirmationNumber style={{ color: '#757575' }} />,
};

const subscriptionLabels = {
  gold: 'Gold',
  silver: 'Silver',
  black: 'Black',
  service: 'Serviciu',
  none: 'Day Pass',
};

// Mock data - this should come from your backend
const availablePackages = [
  { id: 'pkg_gold_001', name: 'Gold Membership', price: 150, entry_limit: null, entry_type: 'unlimited', tier: 'gold' },
  { id: 'pkg_silver_002', name: 'Silver Access', price: 100, entry_limit: 12, entry_type: 'monthly', tier: 'silver' },
  { id: 'pkg_black_003', name: 'Black VIP', price: 250, entry_limit: null, entry_type: 'unlimited', tier: 'black' },
  { id: 'pkg_daypass_004', name: 'Day Pass', price: 20, entry_limit: 1, entry_type: 'total', tier: 'none' },
  { id: 'srv_pt_005', name: 'Personal Training Session', price: 80, entry_limit: 1, entry_type: 'total', tier: 'service' },
];

const AvailablePackages = ({ selectedPackage, onSelectPackage }) => {
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '500' }}>
        Pachete Disponibile
      </h2>
      
      <div style={{ width: '100%' }}>
        {availablePackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onSelectPackage(pkg)}
            style={{
              marginBottom: '8px',
              borderRadius: '8px',
              backgroundColor: selectedPackage?.id === pkg.id ? '#e3f2fd' : '#f8f9fa',
              cursor: 'pointer',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: selectedPackage?.id === pkg.id ? '#e3f2fd' : '#e9ecef',
              }
            }}
          >
            <div style={{ fontSize: '24px' }}>
              {subscriptionIcons[pkg.tier]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500' }}>{pkg.name}</div>
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '4px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '16px',
                  fontSize: '0.875rem'
                }}>
                  {pkg.price} RON
                </span>
                <span style={{
                  border: '1px solid #e0e0e0',
                  padding: '4px 8px',
                  borderRadius: '16px',
                  fontSize: '0.875rem'
                }}>
                  {pkg.entry_type === 'unlimited' ? 'Acces nelimitat' : 
                   pkg.entry_type === 'monthly' ? `${pkg.entry_limit} intrări/lună` :
                   `${pkg.entry_limit} intrare`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailablePackages; 