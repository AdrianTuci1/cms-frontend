import React from 'react';
import styles from './MemberCards.module.css';

const MemberCards = () => {
  return (
    <div className={styles.memberCards}>
      {/* Sample member cards - replace with actual data */}
      <div className={styles.memberCard}>
        <div className={styles.memberAvatar}>JD</div>
        <div className={styles.memberInfo}>
          <div className={styles.memberName}>John Doe</div>
          <div className={styles.memberStatus}>In sala</div>
        </div>
      </div>
      <div className={styles.memberCard}>
        <div className={styles.memberAvatar}>AS</div>
        <div className={styles.memberInfo}>
          <div className={styles.memberName}>Alice Smith</div>
          <div className={styles.memberStatus}>In sala</div>
        </div>
      </div>
    </div>
  );
};

export default MemberCards; 