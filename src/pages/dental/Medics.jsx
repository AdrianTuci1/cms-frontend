import { getBusinessType } from '../../config/businessTypes';

const Medics = () => {
  const businessType = getBusinessType();

  return (
    <div className="medics-page">
      <h1>Our Dental Team</h1>
      <div className="medics-grid">
        <div className="medic-card">
          <h3>Dr. John Smith</h3>
          <p>General Dentistry</p>
          <p>10 years of experience</p>
        </div>
        <div className="medic-card">
          <h3>Dr. Sarah Johnson</h3>
          <p>Orthodontics</p>
          <p>8 years of experience</p>
        </div>
        <div className="medic-card">
          <h3>Dr. Michael Brown</h3>
          <p>Endodontics</p>
          <p>12 years of experience</p>
        </div>
      </div>
    </div>
  );
};

export default Medics; 