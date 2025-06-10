import React from 'react';
import styles from '../AddAppointment.module.css';

const HotelAppointmentForm = ({ formData, onInputChange }) => {
  return (
    <>
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Guest Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Guest Name
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.guestName || ''}
              onChange={(e) => onInputChange('guestName', e.target.value)}
              placeholder="Enter guest name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Phone Number
            </label>
            <input
              type="tel"
              className={styles.formInput}
              value={formData.phoneNumber || ''}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Email
            </label>
            <input
              type="email"
              className={styles.formInput}
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Number of Guests
            </label>
            <input
              type="number"
              className={styles.formInput}
              value={formData.numberOfGuests || ''}
              onChange={(e) => onInputChange('numberOfGuests', e.target.value)}
              min="1"
              max="10"
              required
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Booking Details</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Check-in Date
            </label>
            <input
              type="date"
              className={styles.formInput}
              value={formData.checkInDate || ''}
              onChange={(e) => onInputChange('checkInDate', e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Check-out Date
            </label>
            <input
              type="date"
              className={styles.formInput}
              value={formData.checkOutDate || ''}
              onChange={(e) => onInputChange('checkOutDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Room Type
            </label>
            <select
              className={styles.formSelect}
              value={formData.roomType || ''}
              onChange={(e) => onInputChange('roomType', e.target.value)}
              required
            >
              <option value="">Select room type</option>
              <option value="standard">Standard Room</option>
              <option value="deluxe">Deluxe Room</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive Suite</option>
              <option value="presidential">Presidential Suite</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Number of Rooms
            </label>
            <input
              type="number"
              className={styles.formInput}
              value={formData.numberOfRooms || ''}
              onChange={(e) => onInputChange('numberOfRooms', e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Special Requests</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Room Preferences
            </label>
            <select
              className={styles.formSelect}
              value={formData.roomPreferences || ''}
              onChange={(e) => onInputChange('roomPreferences', e.target.value)}
            >
              <option value="">Select preferences</option>
              <option value="high_floor">High Floor</option>
              <option value="low_floor">Low Floor</option>
              <option value="quiet">Quiet Room</option>
              <option value="view">Room with View</option>
              <option value="near_elevator">Near Elevator</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Bed Type
            </label>
            <select
              className={styles.formSelect}
              value={formData.bedType || ''}
              onChange={(e) => onInputChange('bedType', e.target.value)}
            >
              <option value="">Select bed type</option>
              <option value="king">King Size</option>
              <option value="queen">Queen Size</option>
              <option value="double">Double</option>
              <option value="twin">Twin</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Additional Requests
          </label>
          <textarea
            className={styles.formTextarea}
            value={formData.additionalRequests || ''}
            onChange={(e) => onInputChange('additionalRequests', e.target.value)}
            placeholder="Add any special requests or requirements"
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Payment Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Payment Method
            </label>
            <select
              className={styles.formSelect}
              value={formData.paymentMethod || ''}
              onChange={(e) => onInputChange('paymentMethod', e.target.value)}
              required
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Special Rate Code
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.rateCode || ''}
              onChange={(e) => onInputChange('rateCode', e.target.value)}
              placeholder="Enter rate code if applicable"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelAppointmentForm; 