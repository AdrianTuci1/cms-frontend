import { getBusinessType } from '../../config/businessTypes';

const Packages = () => {
  const businessType = getBusinessType();

  return (
    <div className="packages-page">
      <h1>Our Fitness Packages</h1>
      <div className="packages-grid">
        <div className="package-card">
          <h3>Basic Package</h3>
          <ul>
            <li>Access to gym equipment</li>
            <li>Locker room access</li>
            <li>Basic fitness assessment</li>
            <li>Monthly membership</li>
          </ul>
          <div className="price">$29.99/month</div>
        </div>
        <div className="package-card">
          <h3>Premium Package</h3>
          <ul>
            <li>All Basic Package features</li>
            <li>Unlimited group classes</li>
            <li>Personal trainer consultation</li>
            <li>Sauna access</li>
          </ul>
          <div className="price">$49.99/month</div>
        </div>
        <div className="package-card">
          <h3>VIP Package</h3>
          <ul>
            <li>All Premium Package features</li>
            <li>Personal training sessions</li>
            <li>Nutrition consultation</li>
            <li>24/7 access</li>
          </ul>
          <div className="price">$79.99/month</div>
        </div>
      </div>
    </div>
  );
};

export default Packages; 