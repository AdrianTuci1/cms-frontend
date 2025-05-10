import React from 'react';
import { getBusinessType } from '../config/businessTypes';
import GymClientCard from '../components/dashboard/gym/GymClientCard';
import DentalClientCard from '../components/dashboard/dental/DentalClientCard';
import HotelClientCard from '../components/dashboard/hotel/HotelClientCard';
import './ClientsView.css';

const ClientsView = () => {
  const businessType = getBusinessType();

  // Mock data - replace with actual data from your backend
  const clients = [
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
    }
  ];

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
    <div className="dashboard-view">
      <div className="clients-container">
        {clients.map(client => renderClientCard(client))}
      </div>
    </div>
  );
};

export default ClientsView; 