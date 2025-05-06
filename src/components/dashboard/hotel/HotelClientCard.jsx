import React from 'react';
import './HotelClientCard.css';

const HotelClientCard = ({ client }) => {
  return (
    <div className="hotel-card">
      <div className="hotel-card__header">
        <h3>{client.name}</h3>
        <div className="hotel-card__room-badge">
          <span className="hotel-card__room-number">Room {client.roomNumber}</span>
        </div>
      </div>
      <div className="hotel-card__content">
        <div className="hotel-card__info">
          <div className="hotel-card__info-item">
            <span className="hotel-card__label">Email</span>
            <span className="hotel-card__value">{client.email}</span>
          </div>
          <div className="hotel-card__info-item">
            <span className="hotel-card__label">Phone</span>
            <span className="hotel-card__value">{client.phone}</span>
          </div>
        </div>
        <div className="hotel-card__dates">
          <div className="hotel-card__date-item">
            <span className="hotel-card__label">Check-in</span>
            <span className="hotel-card__value">{client.checkIn}</span>
          </div>
          <div className="hotel-card__date-item">
            <span className="hotel-card__label">Check-out</span>
            <span className="hotel-card__value">{client.checkOut}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelClientCard; 