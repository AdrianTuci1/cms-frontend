import { useState } from 'react';
import styles from './AdminView.module.css';
import { FaPlus } from 'react-icons/fa';
import MembersTab from './Members/MembersTab';
import RolesTab from './Permissions/RolesTab';
import StaffProfileModal from '../components/admin/StaffProfileModal';
import useTabsStore from '../../../layout/tabsStore';

const AdminView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeTab } = useTabsStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab />;
      case 'roles':
        return <RolesTab />;
      default:
        return <MembersTab />; // Default to members tab
    }
  };

  return (
    <div className={styles.adminView}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <FaPlus className={styles.icon}/>
          Adaugă Membru
        </button>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>

      {isModalOpen && (
        <StaffProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminView; 