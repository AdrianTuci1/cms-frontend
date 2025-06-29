import React from 'react';
import styles from './InvoicesSection.module.css';
import InvoiceCard from '../../components/dashboard/invoices/InvoiceCard';
import useInvoicesStore from '../store';

const InvoicesSection = () => {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredInvoices,
    getFilteredSuggestions,
    getTotalItemsCount
  } = useInvoicesStore();

  const filteredInvoices = getFilteredInvoices();
  const filteredSuggestions = getFilteredSuggestions();
  const totalItemsCount = getTotalItemsCount();

  return (
    <div className={styles.invoicesContainer}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.actions}>
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className={styles.filterButton}>
                <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V14L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.addButton}>
                <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <span className={styles.invoiceCount}>
              {totalItemsCount} items
            </span>
          </div>
        </div>

        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Recent Invoices</h2>
            <div className={styles.cardsContainer}>
              {filteredInvoices.map(invoice => (
                <InvoiceCard key={invoice.id} data={invoice} type="invoice" />
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Billing Suggestions</h2>
            <div className={styles.cardsContainer}>
              {filteredSuggestions.map(suggestion => (
                <InvoiceCard key={suggestion.id} data={suggestion} type="suggestion" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesSection; 