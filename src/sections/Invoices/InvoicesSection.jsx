import React, { useState } from 'react';
import styles from './InvoicesSection.module.css';
import InvoiceCard from '../../components/dashboard/invoices/InvoiceCard';
import { FaBuilding, FaStore, FaHome } from 'react-icons/fa';

const InvoicesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const recentInvoices = [
    {
      id: 1,
      number: 'INV-2024-001',
      businessType: 'hotel',
      customer: 'John Smith',
      amount: '€450.00',
      date: '2024-03-15',
      status: 'Paid',
      icon: <FaBuilding />
    },
    {
      id: 2,
      number: 'INV-2024-002',
      businessType: 'restaurant',
      customer: 'Maria Garcia',
      amount: '€125.50',
      date: '2024-03-14',
      status: 'Pending',
      icon: <FaStore />
    },
    {
      id: 3,
      number: 'INV-2024-003',
      businessType: 'apartment',
      customer: 'Alex Johnson',
      amount: '€850.00',
      date: '2024-03-13',
      status: 'Paid',
      icon: <FaHome />
    }
  ];

  const billingSuggestions = [
    {
      id: 1,
      customer: 'Sarah Wilson',
      businessType: 'hotel',
      lastVisit: '2024-03-10',
      suggestedAmount: '€380.00',
      icon: <FaBuilding />
    },
    {
      id: 2,
      customer: 'Michael Brown',
      businessType: 'restaurant',
      lastVisit: '2024-03-12',
      suggestedAmount: '€95.00',
      icon: <FaStore />
    },
    {
      id: 3,
      customer: 'Emma Davis',
      businessType: 'apartment',
      lastVisit: '2024-03-08',
      suggestedAmount: '€720.00',
      icon: <FaHome />
    }
  ];

  const filteredInvoices = recentInvoices.filter(invoice => {
    const searchLower = searchQuery.toLowerCase();
    return (
      invoice.number.toLowerCase().includes(searchLower) ||
      invoice.customer.toLowerCase().includes(searchLower) ||
      invoice.amount.toLowerCase().includes(searchLower)
    );
  });

  const filteredSuggestions = billingSuggestions.filter(suggestion => {
    const searchLower = searchQuery.toLowerCase();
    return (
      suggestion.customer.toLowerCase().includes(searchLower) ||
      suggestion.suggestedAmount.toLowerCase().includes(searchLower)
    );
  });

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
              {filteredInvoices.length + filteredSuggestions.length} items
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