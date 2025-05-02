import { getBusinessType } from '../../config/businessTypes';

const Treatments = () => {
  const businessType = getBusinessType();

  return (
    <div className="treatments-page">
      <h1>Our Dental Treatments</h1>
      <div className="treatments-grid">
        <div className="treatment-card">
          <h3>General Dentistry</h3>
          <ul>
            <li>Regular Check-ups</li>
            <li>Teeth Cleaning</li>
            <li>Fillings</li>
            <li>Root Canal Treatment</li>
          </ul>
        </div>
        <div className="treatment-card">
          <h3>Cosmetic Dentistry</h3>
          <ul>
            <li>Teeth Whitening</li>
            <li>Veneers</li>
            <li>Dental Implants</li>
            <li>Invisalign</li>
          </ul>
        </div>
        <div className="treatment-card">
          <h3>Specialized Treatments</h3>
          <ul>
            <li>Orthodontics</li>
            <li>Periodontics</li>
            <li>Endodontics</li>
            <li>Oral Surgery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Treatments; 