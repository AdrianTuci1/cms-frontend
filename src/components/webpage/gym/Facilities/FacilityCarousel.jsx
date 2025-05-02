import React, { useState, useEffect } from 'react';
import styles from './Facilities.module.css';

const FacilityCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < images.length - visibleSlides) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canSlideLeft = currentIndex > 0;
  const canSlideRight = currentIndex < images.length - visibleSlides;

  return (
    <div className={styles.carousel}>
      {canSlideLeft && (
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div className={styles.slidesContainer}>
        <div 
          className={styles.slidesTrack} 
          style={{ transform: `translateX(-${currentIndex * (100/visibleSlides)}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.slide}>
              <div className={styles.imageFrame}>
                {image ? (
                  <img src={image} alt={`${title} ${index + 1}`}/>
                ) : (
                  <div className={styles.missingImage}>
                    Fotografie lipsa
                  </div>
                )}
              </div>
              <div className={styles.captionFrame}>
                {image ? (
                  <div className={styles.slideCaption}>
                    <h3>{title}</h3>
                    <p>Grand Hotel Brasov | Cazare in Brasov</p>
                  </div>
                ) : (
                  <div className={styles.missingCaption}>
                    Caption lipsa
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {canSlideRight && (
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default FacilityCarousel; 