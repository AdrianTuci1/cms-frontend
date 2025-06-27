import React, { useState, useEffect } from 'react';
import useTimelineStore from '../../../store/timelineStore';
import { mockMembers } from '../../../data/mockData';
import styles from './Timeline.module.css';
import OccupancyTimeline from './components/OccupancyTimeline';
import MemberCard from './components/MemberCard';

const Timeline = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { showFullDay } = useTimelineStore();
  const [activeMembers, setActiveMembers] = useState([]);
  const [hourlyOccupancy, setHourlyOccupancy] = useState([]);

  const calculateHourlyOccupancy = () => {
    const hourly = Array(24).fill(0);
    const maxCapacity = 50;

    mockMembers.forEach(member => {
      const checkIn = parseInt(member.checkIn.split(':')[0]);
      const checkOut = parseInt(member.checkOut.split(':')[0]);
      
      for (let hour = checkIn; hour <= checkOut; hour++) {
        hourly[hour]++;
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

    const locations = ['gym', 'pool', 'aerobic'];
    const currentHour = currentTime.getHours();
    const active = mockMembers
      .filter(member => {
        const checkIn = parseInt(member.checkIn.split(':')[0]);
        const checkOut = parseInt(member.checkOut.split(':')[0]);
        return showFullDay || (checkIn <= currentHour && checkOut >= currentHour);
      })
      .map(member => ({
        ...member,
        location: locations[Math.floor(Math.random() * locations.length)],
      }));
    
    setActiveMembers(active);
  }, [showFullDay, currentTime]);

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
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 