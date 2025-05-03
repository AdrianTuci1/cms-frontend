import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdMilitaryTech } from 'react-icons/md';
import { MdDiamond } from 'react-icons/md';
import { MdShield } from 'react-icons/md';
import { MdHandyman } from 'react-icons/md';
import { MdConfirmationNumber } from 'react-icons/md';

// Mock Data Structure
const initialPackages = [
  { id: 'pkg_gold_001', name: 'Gold Membership', price: 150, entry_limit: null, entry_type: 'unlimited', is_single_use: false, tier: 'gold' },
  { id: 'pkg_silver_002', name: 'Silver Access', price: 100, entry_limit: 12, entry_type: 'monthly', is_single_use: false, tier: 'silver' },
  { id: 'pkg_black_003', name: 'Black VIP', price: 250, entry_limit: null, entry_type: 'unlimited', is_single_use: false, tier: 'black' },
  { id: 'pkg_daypass_004', name: 'Day Pass', price: 20, entry_limit: 1, entry_type: 'total', is_single_use: true, tier: 'none' },
  { id: 'srv_pt_005', name: 'Personal Training Session', price: 80, entry_limit: 1, entry_type: 'total', is_single_use: true, tier: 'service' },
];

const tierIcons = {
  gold: <MdMilitaryTech style={{ color: 'gold' }} />,
  silver: <MdDiamond style={{ color: '#b0c4de' }} />,
  black: <MdShield style={{ color: '#333' }} />,
  service: <MdHandyman style={{ color: '#8b5cf6' }} />,
  none: <MdConfirmationNumber style={{ color: '#757575' }} />,
};

const tierBorderClass = {
  gold: 'tierGold',
  silver: 'tierSilver',
  black: 'tierBlack',
  service: 'tierService',
  none: '',
}

const ManagePackages = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [open, setOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    entry_limit: '',
    entry_type: 'total',
    is_single_use: false,
    tier: 'none',
  });

  const handleClickOpen = () => {
    setNewPackage({
      name: '', price: '', entry_limit: '', entry_type: 'total', is_single_use: false, tier: 'none',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.price) {
      alert('Numele și prețul pachetului sunt obligatorii.');
      return;
    }
    const newId = `${newPackage.tier}_${newPackage.name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      price: parseFloat(newPackage.price) || 0,
      entry_limit: newPackage.entry_limit === '' || newPackage.entry_limit === null ? null : parseInt(newPackage.entry_limit, 10) || 0,
    };
    setPackages(prev => [...prev, packageToAdd]);
    handleClose();
  };

  const handleEdit = (packageId) => {
    console.log("Edit package:", packageId);
  };

  const handleDelete = (packageId) => {
    console.log("Delete package:", packageId);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px', 
        padding: '0 8px' 
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '500' }}>
          Gestionare Pachete
        </h2>
        <button
          onClick={handleClickOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          <MdAdd />
          Adaugă Pachet
        </button>
      </div>

      {/* Package List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                marginBottom: '8px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{ fontSize: '24px' }}>
                {tierIcons[pkg.tier]}
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(pkg.id)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '20px'
                  }}
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '20px'
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px', 
            color: '#666' 
          }}>
            Nu există pachete definite.
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Adaugă Pachet Nou</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Nume Pachet
                </label>
                <input
                  type="text"
                  name="name"
                  value={newPackage.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Preț (RON)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newPackage.price}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Limită Intrări (gol pt. nelimitat)
                </label>
                <input
                  type="number"
                  name="entry_limit"
                  value={newPackage.entry_limit}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  min="0"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Tip Limită
                </label>
                <select
                  name="entry_type"
                  value={newPackage.entry_type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="total">Total</option>
                  <option value="monthly">Lunar</option>
                  <option value="weekly">Săptămânal</option>
                  <option value="unlimited">Nelimitat</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Tier
                </label>
                <select
                  name="tier"
                  value={newPackage.tier}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="none">Day Pass / Altele</option>
                  <option value="service">Serviciu</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="black">Black</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="is_single_use"
                  checked={newPackage.is_single_use}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                />
                <label>Pachet Single Use</label>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '8px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  background: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Anulează
              </button>
              <button
                onClick={handleAddPackage}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Adaugă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackages; 