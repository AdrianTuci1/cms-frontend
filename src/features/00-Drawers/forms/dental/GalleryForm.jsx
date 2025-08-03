import React, { useState } from 'react';
import BaseForm from '../BaseForm';
import useDrawerStore from '../../store/drawerStore';
import styles from './GalleryForm.module.css';

const GalleryForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const { getDrawerFields, getRequiredFields, getDrawerTitle } = useDrawerStore();
  const [images, setImages] = useState(data?.images || []);

  // Get fields configuration from store
  const fields = getDrawerFields('gallery');
  const requiredFields = getRequiredFields('gallery');
  const title = getDrawerTitle('gallery');

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (formData, mode) => {
    try {
      // Add data processing
      const processedData = {
        ...formData,
        images: images,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(processedData, mode);
        console.log(`Gallery ${mode === 'create' ? 'created' : 'updated'} successfully`);
      }
    } catch (error) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} gallery:`, error);
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} gallery. Please try again.`);
    }
  };

  const handleDelete = async (formData) => {
    if (!confirm('Are you sure you want to delete this gallery?')) {
      return;
    }

    try {
      if (onDelete) {
        await onDelete(formData);
        console.log('Gallery deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete gallery:', error);
      alert('Failed to delete gallery. Please try again.');
    }
  };

  return (
    <div className={styles.galleryFormContainer}>
      <div className={styles.uploadSection}>
        <h3>Upload Images</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
        <p className={styles.uploadHint}>Select multiple images to upload</p>
      </div>

      <div className={styles.imagesGrid}>
        {images.map((image) => (
          <div key={image.id} className={styles.imageItem}>
            <img src={image.url} alt={image.name} className={styles.image} />
            <div className={styles.imageOverlay}>
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
            <p className={styles.imageName}>{image.name}</p>
          </div>
        ))}
      </div>

      <BaseForm
        mode={mode}
        data={data}
        fields={fields.filter(field => field.name !== 'images')} // Exclude images field as we handle it separately
        required={requiredFields}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onCancel={onCancel}
        isLoading={isLoading}
        title={`${mode === 'create' ? 'New' : 'Edit'} ${title}`}
      />
    </div>
  );
};

export default GalleryForm; 