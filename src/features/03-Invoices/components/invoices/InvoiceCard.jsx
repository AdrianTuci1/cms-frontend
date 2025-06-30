import React from 'react';
import styles from './InvoiceCard.module.css';
import { FaLightbulb } from 'react-icons/fa';

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

  return (
    <div className={styles.card}>
      <div className={styles.invoiceInfo}>
        <div className={styles.iconContainer}>
          {data.icon}
        </div>
        <div className={styles.details}>
          <h3 className={styles.invoiceNumber}>
            {type === 'invoice' ? data.number : data.customer}
          </h3>
          <div className={styles.customerInfo}>
            {type === 'invoice' ? (
              <>
                <span>{data.customer}</span>
                <span className={styles.date}>{data.date}</span>
              </>
            ) : (
              <span>Last visit: {data.lastVisit}</span>
            )}
          </div>
          <span className={styles.amount}>
            {type === 'invoice' ? data.amount : data.suggestedAmount}
          </span>
        </div>
        <div className={styles.statusInfo}>
          {type === 'invoice' ? (
            <span className={`${styles.status} ${getStatusClass(data.status)}`}>
              {data.status}
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