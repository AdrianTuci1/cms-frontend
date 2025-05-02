import React, { useState } from 'react';
import styles from './PhotoGallery.module.css';

const PhotoGallery = ({ photos = [] }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoClick = (index) => {
    if (photos.length > 0) {
      setCurrentPhotoIndex(index);
      setIsFullscreen(true);
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryGrid}>
        {/* Main large image on the left */}
        <div
          className={styles.galleryItem}
          onClick={() => handlePhotoClick(0)}
        >
          {photos[0] && <img src={photos[0]} alt="Gallery 1" />}
        </div>

        {/* Right side container */}
        <div className={styles.rightSide}>
          {/* Top right image */}
          <div
            className={`${styles.galleryItem} ${styles.topRight}`}
            onClick={() => handlePhotoClick(1)}
          >
            {photos[1] && <img src={photos[1]} alt="Gallery 2" />}
          </div>

          {/* Bottom right container */}
          <div className={styles.bottomRight}>
            {/* Bottom left image */}
            <div
              className={styles.galleryItem}
              onClick={() => handlePhotoClick(2)}
            >
              {photos[2] && <img src={photos[2]} alt="Gallery 3" />}
            </div>

            {/* Plus button */}
            <div 
              className={`${styles.galleryItem} ${styles.plusContainer}`}
              onClick={() => handlePhotoClick(0)}
            >
              <span className={styles.plusButton}>+</span>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && photos.length > 0 && (
        <div className={styles.fullscreenOverlay}>
          <div className={styles.fullscreenContent}>
            <button className={styles.closeButton} onClick={handleCloseFullscreen}>
              ×
            </button>
            <img
              src={photos[currentPhotoIndex]}
              alt={`Fullscreen ${currentPhotoIndex + 1}`}
              className={styles.fullscreenImage}
            />
            <button className={styles.navButton} onClick={handlePrevPhoto}>
              ←
            </button>
            <button className={styles.navButton} onClick={handleNextPhoto}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 