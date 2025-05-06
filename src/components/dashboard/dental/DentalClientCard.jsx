import React from 'react';
import './DentalClientCard.css';

const DentalClientCard = ({ client }) => {
  return (
    <div className="dental-card">
      <div className="dental-card__header">
        <h3>{client.name}</h3>
        <div className="dental-card__appointment-badge">
          <span className="dental-card__appointment-date">{client.nextAppointment}</span>
        </div>
      </div>
      <div className="dental-card__content">
        <div className="dental-card__info">
          <div className="dental-card__info-item">
            <span className="dental-card__label">Email</span>
            <span className="dental-card__value">{client.email}</span>
          </div>
          <div className="dental-card__info-item">
            <span className="dental-card__label">Phone</span>
            <span className="dental-card__value">{client.phone}</span>
          </div>
          <div className="dental-card__info-item">
            <span className="dental-card__label">Last Visit</span>
            <span className="dental-card__value">{client.lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalClientCard; 