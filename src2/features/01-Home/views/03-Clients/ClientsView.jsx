import React, { useState, useMemo } from 'react';
import { getBusinessType } from '../config/businessTypes';
import { FaSearch, FaPlus } from 'react-icons/fa';
import GymClientCard from '../components/dashboard/gym/GymClientCard';
import DentalClientCard from '../components/dashboard/dental/DentalClientCard';
import HotelClientCard from '../components/dashboard/hotel/HotelClientCard';
import styles from './ClientsView.module.css';

const ClientsView = () => {
  const businessType = getBusinessType();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from your backend
  const allClients = [
    {
      id: 1,
      name: 'Maria Popescu',
      email: 'maria.popescu@email.com',
      phone: '0722-123-456',
      photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      doctor: 'Dr. Ion Ionescu',
      previousTreatment: {
        name: 'Curățare profesională',
        date: '15.03.2024'
      },
      nextTreatment: {
        name: 'Control periodic',
        date: '15.06.2024'
      }
    },
    {
      id: 2,
      name: 'Alexandru Dumitrescu',
      email: 'alex.dumitrescu@email.com',
      phone: '0733-456-789',
      photoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      doctor: 'Dr. Elena Popescu',
      previousTreatment: {
        name: 'Plombă',
        date: '01.03.2024'
      },
      nextTreatment: {
        name: 'Extracție măsea de minte',
        date: '20.04.2024'
      }
    },
    {
      id: 3,
      name: 'Ana Maria Ionescu',
      email: 'ana.ionescu@email.com',
      phone: '0744-789-012',
      photoUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
      doctor: 'Dr. Ion Ionescu',
      previousTreatment: {
        name: 'Albire',
        date: '10.02.2024'
      },
      nextTreatment: {
        name: 'Control albire',
        date: '10.05.2024'
      }
    },
    {
      id: 4,
      name: 'Vasile Popa',
      email: 'vasile.popa@email.com',
      phone: '0755-111-222',
      photoUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
      doctor: 'Dr. Elena Popescu',
      previousTreatment: {
        name: 'Extracție',
        date: '20.02.2024'
      },
      nextTreatment: {
        name: 'Proteză',
        date: '25.05.2024'
      }
    },
    {
      id: 5,
      name: 'Elena Dumitru',
      email: 'elena.dumitru@email.com',
      phone: '0766-333-444',
      photoUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
      doctor: 'Dr. Ion Ionescu',
      previousTreatment: {
        name: 'Consultare',
        date: '05.03.2024'
      },
      nextTreatment: {
        name: 'Tratament ortodontic',
        date: '30.04.2024'
      }
    }
  ];

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return allClients;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return allClients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm) ||
      client.doctor.toLowerCase().includes(searchLower) ||
      client.previousTreatment.name.toLowerCase().includes(searchLower) ||
      client.nextTreatment.name.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, allClients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderClientCard = (client) => {
    switch (businessType.name) {
      case 'Gym':
        return <GymClientCard key={client.id} client={client} />;
      case 'Dental Clinic':
        return <DentalClientCard key={client.id} client={client} />;
      case 'Hotel':
        return <HotelClientCard key={client.id} client={client} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminView}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search clients by name, email, phone, doctor, or treatment..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton}>
          <FaPlus className={styles.icon}/>
          Adaugă Client
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.membersContainer}>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => renderClientCard(client))
          ) : searchTerm.trim() ? (
            <div className={styles.emptyState}>
              <p>No clients found matching "{searchTerm}". Try a different search term.</p>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No clients found. Add a client using the button above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsView; 