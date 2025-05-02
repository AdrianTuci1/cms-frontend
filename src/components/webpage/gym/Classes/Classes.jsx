import React from 'react';
import styles from './Classes.module.css';

const Classes = () => {
  const classes = [
    {
      id: 1,
      title: 'Personal Training',
      description: 'One-on-one sessions with dedicated trainers, tailored to your specific needs.',
      image: '/images/personal-training.jpg'
    },
    {
      id: 2,
      title: 'Zumba',
      description: 'High-energy dance and fitness sessions combining Latin moves with cardio exercises.',
      image: '/images/zumba.jpg'
    }
  ];

  return (
    <section className={styles.classesSection}>
      <div className={styles.sectionTitle}>Classes</div>
      <div className={styles.classesGrid}>
        {classes.map((classItem) => (
          <div key={classItem.id} className={styles.classContainer}>
            <div className={styles.classCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={classItem.image} 
                  alt={classItem.title} 
                  className={styles.classImage} 
                />
              </div>
              <div className={styles.textContainer}>
                <h3 className={styles.classTitle}>{classItem.title}</h3>
                <p className={styles.classDescription}>{classItem.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Classes; 