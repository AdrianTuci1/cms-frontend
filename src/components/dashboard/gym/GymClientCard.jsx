import React from 'react';
import './GymClientCard.css';

const GymClientCard = ({ client }) => {
  return (
    <div className="gym-card">
      <div className="gym-card__header">
        <h3>{client.name}</h3>
        <span className={`gym-card__status ${client.membershipStatus.toLowerCase()}`}>
          {client.membershipStatus}
        </span>
      </div>
      <div className="gym-card__content">
        <div className="gym-card__info">
          <div className="gym-card__info-item">
            <span className="gym-card__label">Email</span>
            <span className="gym-card__value">{client.email}</span>
          </div>
          <div className="gym-card__info-item">
            <span className="gym-card__label">Phone</span>
            <span className="gym-card__value">{client.phone}</span>
          </div>
          <div className="gym-card__info-item">
            <span className="gym-card__label">Membership</span>
            <span className="gym-card__value">{client.membershipType}</span>
          </div>
          <div className="gym-card__info-item">
            <span className="gym-card__label">Last Visit</span>
            <span className="gym-card__value">{client.lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymClientCard; 