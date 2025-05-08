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
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      membershipType: 'Premium',
      lastVisit: '2024-03-15',
      // Gym specific
      membershipStatus: 'Active',
      // Dental specific
      nextAppointment: '2024-04-01',
      // Hotel specific
      roomNumber: '101',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25'
    },
    // Add more mock clients as needed
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