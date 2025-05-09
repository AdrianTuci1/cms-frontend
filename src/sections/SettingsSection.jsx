import React from 'react';
import { getBusinessType } from '../config/businessTypes';
import styles from './SettingsSection.module.css';
import { FaPlus } from 'react-icons/fa';
import useTabsStore from '../store/tabsStore';
import ReservationsTab from '../components/dashboard/admin/ReservationsTab';
import AttractionsTab from '../components/dashboard/admin/AttractionsTab';
import ServicesTab from '../components/dashboard/admin/ServicesTab';
import GymSubscriptionsTab from '../components/dashboard/admin/GymSubscriptionsTab';
import GymClassesTab from '../components/dashboard/admin/GymClassesTab';
import GymFacilitiesTab from '../components/dashboard/admin/GymFacilitiesTab';
import DentalTreatmentsTab from '../components/dashboard/admin/DentalTreatmentsTab';
import GalleryTab from '../components/dashboard/admin/GalleryTab';

const SettingsSection = () => {
  const { activeTab, getTabsBySection } = useTabsStore();
  const tabs = getTabsBySection('settings');
  const businessType = getBusinessType();

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        return <GalleryTab />;
      case 'reservations':
        return <ReservationsTab />;
      case 'attractions':
        return <AttractionsTab />;
      case 'services':
        return <ServicesTab />;
      case 'gym-subscriptions':
        return <GymSubscriptionsTab />;
      case 'gym-classes':
        return <GymClassesTab />;
      case 'gym-facilities':
        return <GymFacilitiesTab />;
      case 'dental-treatments':
        return <DentalTreatmentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.settingsSection}>
      <div className={styles.header}>
        <h1>Setări</h1>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsSection; 