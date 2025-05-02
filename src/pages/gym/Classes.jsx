import { getBusinessType } from '../../config/businessTypes';

const Classes = () => {
  const businessType = getBusinessType();

  return (
    <div className="classes-page">
      <h1>Our Fitness Classes</h1>
      <div className="classes-grid">
        <div className="class-card">
          <h3>Yoga</h3>
          <p>Monday, Wednesday, Friday</p>
          <p>9:00 AM - 10:00 AM</p>
          <p>Instructor: Sarah Wilson</p>
          <button className="book-button">Book Now</button>
        </div>
        <div className="class-card">
          <h3>HIIT</h3>
          <p>Tuesday, Thursday</p>
          <p>6:00 PM - 7:00 PM</p>
          <p>Instructor: Mike Johnson</p>
          <button className="book-button">Book Now</button>
        </div>
        <div className="class-card">
          <h3>Pilates</h3>
          <p>Monday, Wednesday</p>
          <p>5:00 PM - 6:00 PM</p>
          <p>Instructor: Emily Davis</p>
          <button className="book-button">Book Now</button>
        </div>
        <div className="class-card">
          <h3>Zumba</h3>
          <p>Friday, Saturday</p>
          <p>7:00 PM - 8:00 PM</p>
          <p>Instructor: Carlos Rodriguez</p>
          <button className="book-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Classes; 