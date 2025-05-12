import React, { useState } from 'react';
import styles from './ReportsView.module.css';
import MonthlyReport from './reports/MonthlyReport';
import DailyReport from './reports/DailyReport';
import ServicesReport from './reports/ServicesReport';
import TrendsReport from './reports/TrendsReport';

const REPORT_TYPES = {
  MONTHLY: 'monthly',
  DAILY: 'daily',
  SERVICES: 'services',
  TRENDS: 'trends'
};

export default function ReportsView() {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES.MONTHLY);

  const renderReport = () => {
    switch (selectedReport) {
      case REPORT_TYPES.MONTHLY:
        return <MonthlyReport />;
      case REPORT_TYPES.DAILY:
        return <DailyReport />;
      case REPORT_TYPES.SERVICES:
        return <ServicesReport />;
      case REPORT_TYPES.TRENDS:
        return <TrendsReport />;
      default:
        return <MonthlyReport />;
    }
  };

  return (
    <div className={`${styles.bentoWrap} bg-secondary`}>
      <div className={styles.bentoHeader}>
        <div className={styles.reportTypeSelector}>
          <button
            className={`${styles.reportTypeButton} ${selectedReport === REPORT_TYPES.MONTHLY ? styles.active : ''}`}
            onClick={() => setSelectedReport(REPORT_TYPES.MONTHLY)}
          >
            Lunar
          </button>
          <button
            className={`${styles.reportTypeButton} ${selectedReport === REPORT_TYPES.DAILY ? styles.active : ''}`}
            onClick={() => setSelectedReport(REPORT_TYPES.DAILY)}
          >
            Zilnic
          </button>
          <button
            className={`${styles.reportTypeButton} ${selectedReport === REPORT_TYPES.SERVICES ? styles.active : ''}`}
            onClick={() => setSelectedReport(REPORT_TYPES.SERVICES)}
          >
            Servicii
          </button>
          <button
            className={`${styles.reportTypeButton} ${selectedReport === REPORT_TYPES.TRENDS ? styles.active : ''}`}
            onClick={() => setSelectedReport(REPORT_TYPES.TRENDS)}
          >
            Tendințe
          </button>
        </div>
      </div>
      <div className={styles.bentoGrid}>
        {renderReport()}
      </div>
    </div>
  );
} 