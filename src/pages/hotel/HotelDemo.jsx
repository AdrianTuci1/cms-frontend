import React from 'react';
import HotelInfoCard from '../../components/webpage/hotel/InfoCard/HotelInfoCard';
import membershipData from '../../data/membershipData.json';

const HotelDemo = () => {
  // Sample data for different room types
  const roomData = [
    {
      ...membershipData.hotel,
      roomType: "Camera Dubla Deluxe"
    },
    {
      ...membershipData.hotel,
      roomType: "Camera Standard",
      roomNumber: "101",
      guests: 1,
      roomPhoto: "https://media.istockphoto.com/id/1384894485/photo/luxury-hotel-bedroom-with-comfortable-white-bedding-and-charming-window-view-in-the-morning.jpg?s=612x612&w=0&k=20&c=o-Fy1ZaQBnqAGxV-EYeviGmX8hs4GJUPGiKcWjRYCFc="
    },
    {
      ...membershipData.hotel,
      roomType: "Apartament Suite",
      roomNumber: "501",
      guests: 4,
      roomPhoto: "https://media.istockphoto.com/id/1061316094/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=BrSvVbLTRnT8l2WSXc6O6ZBGMQTxQZdDuGy-MRmYcGU="
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Hotel Room Card Demo</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {roomData.map((room, index) => (
          <HotelInfoCard key={index} data={room} />
        ))}
      </div>
    </div>
  );
};

export default HotelDemo; 