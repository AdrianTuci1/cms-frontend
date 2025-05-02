import { getBusinessType } from '../../config/businessTypes';

const Rooms = () => {
  const businessType = getBusinessType();

  return (
    <div className="rooms-page">
      <h1>Our Rooms</h1>
      <div className="rooms-grid">
        <div className="room-card">
          <h3>Standard Room</h3>
          <ul>
            <li>1 King Bed</li>
            <li>City View</li>
            <li>Free WiFi</li>
            <li>Breakfast included</li>
          </ul>
          <div className="price">$99/night</div>
          <button className="book-button">Book Now</button>
        </div>
        <div className="room-card">
          <h3>Deluxe Room</h3>
          <ul>
            <li>1 King Bed or 2 Queen Beds</li>
            <li>Ocean View</li>
            <li>Free WiFi</li>
            <li>Breakfast included</li>
            <li>Mini Bar</li>
          </ul>
          <div className="price">$149/night</div>
          <button className="book-button">Book Now</button>
        </div>
        <div className="room-card">
          <h3>Suite</h3>
          <ul>
            <li>Separate Living Room</li>
            <li>Ocean View</li>
            <li>Free WiFi</li>
            <li>Breakfast included</li>
            <li>Mini Bar</li>
            <li>Room Service</li>
          </ul>
          <div className="price">$249/night</div>
          <button className="book-button">Book Now</button>
        </div>
        <div className="room-card">
          <h3>Presidential Suite</h3>
          <ul>
            <li>2 Bedrooms</li>
            <li>Panoramic View</li>
            <li>Free WiFi</li>
            <li>Breakfast included</li>
            <li>Mini Bar</li>
            <li>24/7 Room Service</li>
            <li>Private Butler</li>
          </ul>
          <div className="price">$499/night</div>
          <button className="book-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 