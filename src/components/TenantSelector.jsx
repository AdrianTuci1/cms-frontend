import React, { useState } from 'react';
import { tenantUtils } from '../config/tenant.js';
import styles from './TenantSelector.module.css';

const TenantSelector = ({ onTenantChange, currentTenantId, currentBusinessType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(currentTenantId);
  
  const availableTenants = tenantUtils.getAllTenants();

  const handleTenantSelect = (tenant) => {
    setSelectedTenant(tenant.id);
    
    // Update environment variables in localStorage for persistence
    localStorage.setItem('VITE_TENANT_ID', tenant.id);
    localStorage.setItem('VITE_BUSINESS_TYPE', tenant.businessType);
    
    // Call the callback to update parent component
    if (onTenantChange) {
      onTenantChange(tenant);
    }
    
    setIsOpen(false);
    
    // Show a brief notification before reload
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = `Schimbat la ${tenant.name}. Se reîncarcă...`;
    document.body.appendChild(notification);
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getBusinessTypeIcon = (businessType) => {
    switch (businessType) {
      case 'dental':
        return '🦷';
      case 'gym':
        return '💪';
      case 'hotel':
        return '🏨';
      default:
        return '🏢';
    }
  };

  const currentTenant = availableTenants.find(t => t.id === currentTenantId);

  return (
    <div className={styles.tenantSelector}>
      <button 
        className={styles.currentTenant}
        onClick={() => setIsOpen(!isOpen)}
        title="Schimbă tenant-ul"
      >
        <div className={styles.tenantInfo}>
          <span className={styles.icon}>
            {getBusinessTypeIcon(currentBusinessType)}
          </span>
          <div className={styles.details}>
            <span className={styles.name}>{currentTenant?.name}</span>
            <span className={styles.type}>{currentTenant?.businessType}</span>
          </div>
        </div>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h4>Selectează Tenant</h4>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.tenantList}>
            {availableTenants.map((tenant) => (
              <button
                key={tenant.id}
                className={`${styles.tenantOption} ${
                  tenant.id === selectedTenant ? styles.selected : ''
                }`}
                onClick={() => handleTenantSelect(tenant)}
              >
                <div className={styles.tenantInfo}>
                  <span className={styles.icon}>
                    {getBusinessTypeIcon(tenant.businessType)}
                  </span>
                  <div className={styles.details}>
                    <span className={styles.name}>{tenant.name}</span>
                    <span className={styles.type}>{tenant.businessType}</span>
                    <span className={styles.id}>ID: {tenant.id}</span>
                  </div>
                </div>
                {tenant.id === selectedTenant && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSelector;