import React from 'react';
import GymInfoCard from '../../gym/InfoCard/GymInfoCard';
import DentalInfoCard from '../../dental/InfoCard/DentalInfoCard';
import HotelInfoCard from '../../hotel/InfoCard/HotelInfoCard';

const MembershipCard = ({ businessType, data }) => {
  switch (businessType) {
    case 'gym':
      return <GymInfoCard data={data} />;
    case 'dental':
      return <DentalInfoCard data={data} />;
    case 'hotel':
      return <HotelInfoCard data={data} />;
    default:
      return <GymInfoCard data={data} />;
  }
};

export default MembershipCard; 