import React, { useState } from 'react';
import styles from './GalleryTab.module.css';

const GalleryTab = () => {
  const [images, setImages] = useState([
    { id: 1, url: 'https://example.com/image1.jpg', title: 'Imagine 1', category: 'General' },
    { id: 2, url: 'https://example.com/image2.jpg', title: 'Imagine 2', category: 'Facilități' },
  ]);

  const handleDelete = (imageId) => {
    setImages(images.filter(image => image.id !== imageId));
  };

  return (
    <div className={styles.section}>
      <h2>Galerie</h2>
      <div className={styles.galleryGrid}>
        {images.map(image => (
          <div key={image.id} className={styles.imageCard}>
            <div className={styles.imageContainer}>
              <img src={image.url} alt={image.title} className={styles.image} />
              <div className={styles.imageOverlay}>
                <button className={styles.editButton}>✏️</button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(image.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className={styles.imageDetails}>
              <h3>{image.title}</h3>
              <p>Categorie: {image.category}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.uploadSection}>
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          id="imageUpload"
        />
        <label htmlFor="imageUpload" className={styles.uploadButton}>
          Încarcă Imagini
        </label>
      </div>
    </div>
  );
};

export default GalleryTab; 