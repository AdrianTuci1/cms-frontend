import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './LandingPage.module.css';
import LocationMap from '../components/webpage/general/LocationMap/LocationMap';
import InvertedCard from '../components/webpage/general/Hero/InvertedCard';
import MembershipCard from '../components/webpage/gym/MembershipCard/MembershipCard';
import Facilities from '../components/webpage/gym/Facilities/Facilities';
import Packages from '../components/webpage/gym/landingpackages/Packages';
import Classes from '../components/webpage/gym/Classes/Classes';
import PhotoGallery from '../components/webpage/general/PhotoGallery/PhotoGallery';
import Footer from '../components/webpage/general/Footer/Footer';
import gymDescription from '../content/gym-description.md?raw';
import useAuthStore from '../store/authStore';
import { getBusinessType } from '../config/businessTypes';

// Sample photos - replace with your actual photos
const galleryPhotos = [
  '/images/gym1.jpg',
  '/images/gym2.jpg',
  '/images/gym3.jpg',
  '/images/gym4.jpg',
  '/images/gym5.jpg',
  '/images/gym6.jpg',
];

const LandingPage = () => {
  const user = useAuthStore(state => state.user);
  const businessType = getBusinessType();
  
  const title = businessType.name;
  const identifier = getBusinessIdentifier(businessType.name);
  const position = [44.4268, 26.1025]; // Default coordinates (Bucharest, Romania)
  
  const renderBusinessSpecificContent = () => {
    switch (businessType.name) {
      case 'Dental Clinic':
        return (
          <>
            <Facilities />
          </>
        );
      case 'Gym':
        return (
          <>
            <Facilities />
            <Packages />
            <Classes />
          </>
        );
      case 'Hotel':
        return (
          <>
            <Facilities />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <InvertedCard />
      </section>
      
      <section className={styles.descriptionMap}>
        <div className={styles.description}>
          <div className={styles.hotelInfo}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.identifier}>{identifier}</h3>
          </div>
          <div className={styles.servicesDescription}>
            {user ? (
              <div className={styles.membershipCardContainer}>
                <MembershipCard
                  membershipType={user.membershipType}
                  expiryDate={user.expiryDate}
                  memberName={user.name}
                  accessLevel={user.accessLevel}
                  visits={user.visits}
                  lastVisit={user.lastVisit}
                  personalTrainer={user.personalTrainer}
                />
              </div>
            ) : (
              <ReactMarkdown>{gymDescription}</ReactMarkdown>
            )}
          </div>
        </div>
        
        <div className={styles.map}>
          <LocationMap position={position} />
        </div>
      </section>

      {renderBusinessSpecificContent()}


      <PhotoGallery photos={galleryPhotos} />

      <Footer />
    </div>
  );
};

const getBusinessIdentifier = (businessType) => {
  switch (businessType) {
    case 'Dental Clinic':
      return 'Professional Dental Care';
    case 'Gym':
      return 'Fitness & Wellness';
    case 'Hotel':
      return 'Luxury & Comfort';
    default:
      return '';
  }
};

export default LandingPage; 