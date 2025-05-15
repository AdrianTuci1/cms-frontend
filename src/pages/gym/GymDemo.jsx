import React from 'react';
import GymInfoCard from '../../components/webpage/gym/InfoCard/GymInfoCard';
import membershipData from '../../data/membershipData.json';

const GymDemo = () => {
  // Sample data for different membership types
  const membershipSamples = [
    {
      ...membershipData.gym,
      // VIP memberships typically don't have visit limits
      visitsLeft: null 
    },
    {
      ...membershipData.gym,
      memberName: "Sarah Johnson",
      accessLevel: "premium",
      visits: 42,
      // Premium with unlimited visits
      visitsLeft: null,
      expiryDate: "2024-05-30",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      ...membershipData.gym,
      memberName: "Mike Williams",
      accessLevel: "standard",
      membershipType: "Basic Membership - 3 luni",
      // Standard with limited visits
      visitsLeft: 8,
      visits: 12,
      expiryDate: "2024-02-15",
      profilePicture: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Gym Membership Card Demo</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {membershipSamples.map((member, index) => (
          <GymInfoCard key={index} data={member} />
        ))}
      </div>
    </div>
  );
};

export default GymDemo; 