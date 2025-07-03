import React from 'react';
import styles from './InvoiceCard.module.css';
import { FaLightbulb, FaFileInvoice } from 'react-icons/fa';

const InvoiceCard = ({ data, type = 'invoice' }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return styles.statusPaid;
      case 'pending':
        return styles.statusPending;
      default:
        return '';
    }
  };

  // Helper functions to extract data from different formats
  const getInvoiceNumber = () => {
    return data.number || data.invoiceNumber || `INV-${data.id}`;
  };

  const getCustomerName = () => {
    return data.customer || data.clientName || data.customerName || 'Unknown Customer';
  };

  const getAmount = () => {
    const amount = data.amount || data.totalAmount || data.suggestedAmount;
    if (typeof amount === 'number') {
      return `€${amount.toFixed(2)}`;
    }
    return amount || '€0.00';
  };

  const getDate = () => {
    return data.date || data.createdAt || data.invoiceDate || 'No date';
  };

  const getStatus = () => {
    return data.status || 'Unknown';
  };

  const getLastVisit = () => {
    return data.lastVisit || data.lastVisitDate || 'No visit data';
  };

  return (
    <div className={styles.card}>
      <div className={styles.invoiceInfo}>
        <div className={styles.iconContainer}>
          {data.icon || <FaFileInvoice />}
        </div>
        <div className={styles.details}>
          <h3 className={styles.invoiceNumber}>
            {type === 'invoice' ? getInvoiceNumber() : getCustomerName()}
          </h3>
          <div className={styles.customerInfo}>
            {type === 'invoice' ? (
              <>
                <span>{getCustomerName()}</span>
                <span className={styles.date}>{getDate()}</span>
              </>
            ) : (
              <span>Last visit: {getLastVisit()}</span>
            )}
          </div>
          <span className={styles.amount}>
            {getAmount()}
          </span>
        </div>
        <div className={styles.statusInfo}>
          {type === 'invoice' ? (
            <span className={`${styles.status} ${getStatusClass(getStatus())}`}>
              {getStatus()}
            </span>
          ) : (
            <span className={styles.suggestionBadge}>
              <FaLightbulb className={styles.suggestionIcon} />
              Suggested
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard; 