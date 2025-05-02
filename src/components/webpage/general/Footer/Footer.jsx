import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>FitLife Center</h3>
          <p className={styles.footerDescription}>
            Transformă-ți viața prin fitness. Noi oferim cele mai bune facilități și programe pentru a-ți atinge obiectivele.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FacebookIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <YouTubeIcon />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Link-uri Rapide</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/about" className={styles.footerLink}>Despre Noi</Link></li>
            <li><Link to="/membership" className={styles.footerLink}>Membrii</Link></li>
            <li><Link to="/classes" className={styles.footerLink}>Clase</Link></li>
            <li><Link to="/contact" className={styles.footerLink}>Contact</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Program</h4>
          <ul className={styles.footerSchedule}>
            <li>Luni - Vineri: 06:00 - 23:00</li>
            <li>Sâmbătă: 08:00 - 20:00</li>
            <li>Duminică: 09:00 - 18:00</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Contact</h4>
          <ul className={styles.contactInfo}>
            <li>Strada Exemplu, Nr. 123</li>
            <li>București, România</li>
            <li>Tel: +40 123 456 789</li>
            <li>Email: contact@fitlifecenter.ro</li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © {currentYear} FitLife Center. Toate drepturile rezervate.
        </div>
        <div className={styles.legalLinks}>
          <Link to="/privacy" className={styles.legalLink}>Politica de Confidențialitate</Link>
          <Link to="/terms" className={styles.legalLink}>Termeni și Condiții</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 