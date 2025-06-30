import React, { useState, useEffect } from 'react';
import styles from './Timeline.module.css';
import OccupancyTimeline from './components/OccupancyTimeline';
import MemberCard from './components/MemberCard';

const Timeline = ({ 
  timeline, 
  checkedIn, 
  classes, 
  activeMembers: propActiveMembers, 
  loading 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyOccupancy, setHourlyOccupancy] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);

  const { showFullDay, setShowFullDay } = timeline || {};

  const calculateHourlyOccupancy = () => {
    const hourly = Array(24).fill(0);
    const maxCapacity = 50;

    // Use checkedIn data from timeline instead of mock data
    (checkedIn || []).forEach(member => {
      if (member.checkInTime) {
        const checkIn = parseInt(member.checkInTime.split(':')[0]);
        const checkOut = member.checkOutTime ? parseInt(member.checkOutTime.split(':')[0]) : currentTime.getHours();
        
        for (let hour = checkIn; hour <= checkOut; hour++) {
          if (hour >= 0 && hour < 24) {
            hourly[hour]++;
          }
        }
      }
    });

    return hourly.map(count => (count / maxCapacity) * 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const occupancy = calculateHourlyOccupancy();
    setHourlyOccupancy(occupancy);

    // Use active members from props if available, otherwise calculate from checkedIn
    if (propActiveMembers) {
      setActiveMembers(propActiveMembers);
    } else {
      const locations = ['gym', 'pool', 'aerobic'];
      const currentHour = currentTime.getHours();
      const active = (checkedIn || [])
        .filter(member => {
          if (!member.checkInTime) return false;
          const checkIn = parseInt(member.checkInTime.split(':')[0]);
          const checkOut = member.checkOutTime ? parseInt(member.checkOutTime.split(':')[0]) : currentHour;
          return showFullDay || (checkIn <= currentHour && checkOut >= currentHour);
        })
        .map(member => ({
          ...member,
          location: locations[Math.floor(Math.random() * locations.length)],
        }));
      
      setActiveMembers(active);
    }
  }, [showFullDay, currentTime, checkedIn, propActiveMembers]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Se încarcă timeline-ul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.timelineSection}>
        <OccupancyTimeline 
          hourlyOccupancy={hourlyOccupancy}
          currentTime={currentTime}
        />
      </div>
      
      <div className={styles.membersSection}>
        {activeMembers.map((member) => (
          <MemberCard key={member.memberId || member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 