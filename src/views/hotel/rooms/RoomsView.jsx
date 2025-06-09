import React, { useState } from 'react';
import styles from './RoomsView.module.css';
import RoomCard from '../../../components/dashboard/hotel/RoomCard/RoomCard';

const RoomsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: 'Deluxe Suite',
      price: 299,
      description: 'Spacious suite with ocean view and private balcony',
      capacity: 2,
      type: 'Suite'
    },
    {
      id: 2,
      name: 'Family Room',
      price: 399,
      description: 'Large room perfect for families with two bedrooms',
      capacity: 4,
      type: 'Family'
    },
    {
      id: 3,
      name: 'Executive Room',
      price: 199,
      description: 'Modern room with city view and work desk',
      capacity: 2,
      type: 'Standard'
    }
  ]);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.roomsView}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.filterButton}>
              <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V14L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.addButton}>
              <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <span className={styles.roomCount}>{filteredRooms.length} rooms</span>
        </div>
      </div>
      <div className={styles.roomsContainer}>
        {filteredRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomsView; 