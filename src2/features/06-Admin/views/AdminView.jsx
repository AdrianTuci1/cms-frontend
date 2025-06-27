import { useState } from 'react';
import styles from './AdminView.module.css';
import { FaPlus } from 'react-icons/fa';
import MembersTab from '../../components/dashboard/admin/MembersTab';
import RolesTab from '../../components/dashboard/admin/RolesTab';
import StaffProfileModal from '../../components/dashboard/admin/StaffProfileModal';
import useTabsStore from '../../store/tabsStore';

const AdminView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeTab } = useTabsStore();
  const [staffEmails, setStaffEmails] = useState({
    manager: ['manager@example.com'],
    receptioner: ['receptioner@example.com'],
    camerista: ['camerista@example.com']
  });

  const handleAddEmail = (role, email) => {
    setStaffEmails(prev => ({
      ...prev,
      [role]: [...prev[role], email]
    }));
  };

  const handleRemoveEmail = (role, email) => {
    setStaffEmails(prev => ({
      ...prev,
      [role]: prev[role].filter(e => e !== email)
    }));
  };

  const handleViewProfile = (email) => {
    // TODO: Implement view profile functionality
    console.log('View profile for:', email);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab />;
      case 'roles':
        return (
          <RolesTab
            staffEmails={staffEmails}
            onAddEmail={handleAddEmail}
            onRemoveEmail={handleRemoveEmail}
            onViewProfile={handleViewProfile}
          />
        );
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