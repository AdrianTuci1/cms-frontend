import { useState } from 'react';
import styles from './AdminView.module.css';
import { FaPlus } from 'react-icons/fa';
import useDrawerStore, { DRAWER_TYPES } from '../../00-Drawers/store/drawerStore';
import { useDataSync } from '../../../design-patterns/hooks';
import { getBusinessType } from '../../../config/businessTypes';
import MembersTab from './Members/MembersTab';
import RolesTab from './Permissions/RolesTab';
import useTabsStore from '../../../layout/tabsStore';
import useRolesStore from '../store/rolesStore';

const AdminView = () => {
  const { activeTab } = useTabsStore();
  const businessType = getBusinessType();
  const { roles, updateRolePermission } = useRolesStore();
  const { openDrawer } = useDrawerStore();
  
  // Use useDataSync for members data
  const membersSync = useDataSync('members', {
    businessType: businessType.name,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const handleAddMember = () => {
    console.log('Add member button clicked from AdminView!');
    
    // Create new member with default values
    const newMember = {
      name: '',
      email: '',
      phone: '',
      role: '',
      workDays: [],
      photoUrl: ''
    };

    openDrawer('create', DRAWER_TYPES.MEMBER, newMember, {
      title: 'New Staff Member',
      onSave: async (data, mode) => {
        console.log('Creating member:', data);
        
        try {
          // Use optimistic update from useDataSync
          await membersSync.create(data);
          console.log('Member created successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to create member:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Member creation cancelled');
      }
    });
  };

  const handleAddRole = () => {
    console.log('Add role button clicked from AdminView!');
    
    // Create new role with default values
    const newRole = {
      name: '',
      description: '',
      permissions: {},
      accountsCount: 0
    };

    openDrawer('create', DRAWER_TYPES.PERMISSIONS, newRole, {
      title: 'New Role',
      size: 'large',
      onSave: async (data, mode) => {
        console.log('Creating role:', data);
        
        try {
          // Here you would typically save to your roles store or API
          // For now, we'll just log the data
          console.log('Role created successfully!', data);
          
          // You could add the role to the store here
          // await rolesStore.addRole(data);
        } catch (error) {
          console.error('Failed to create role:', error);
        }
      },
      onCancel: () => {
        console.log('Role creation cancelled');
      }
    });
  };

  const handleEditRole = (role) => {
    console.log('Edit role button clicked:', role);
    
    openDrawer('edit', DRAWER_TYPES.PERMISSIONS, role, {
      title: `Edit Role - ${role.name}`,
      size: 'large',
      onSave: async (data, mode) => {
        console.log('Updating role:', data);
        
        try {
          // Here you would typically update your roles store or API
          console.log('Role updated successfully!', data);
          
          // You could update the role in the store here
          // await rolesStore.updateRole(data);
        } catch (error) {
          console.error('Failed to update role:', error);
        }
      },
      onDelete: async (data) => {
        console.log('Deleting role:', data);
        
        try {
          // Here you would typically delete from your roles store or API
          console.log('Role deleted successfully!', data);
          
          // You could remove the role from the store here
          // await rolesStore.deleteRole(data.id);
        } catch (error) {
          console.error('Failed to delete role:', error);
        }
      },
      onCancel: () => {
        console.log('Role editing cancelled');
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab />;
      case 'roles':
        return <RolesTab onEditRole={handleEditRole} />;
      default:
        return <MembersTab />; // Default to members tab
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'members':
        return 'Adaugă Membru';
      case 'roles':
        return 'Adaugă Rol';
      default:
        return 'Adaugă Membru';
    }
  };

  const handleAddButtonClick = () => {
    switch (activeTab) {
      case 'members':
        handleAddMember();
        break;
      case 'roles':
        handleAddRole();
        break;
      default:
        handleAddMember();
    }
  };

  return (
    <div className={styles.adminView}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={handleAddButtonClick}>
          <FaPlus className={styles.icon}/>
          {getButtonText()}
        </button>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminView; 