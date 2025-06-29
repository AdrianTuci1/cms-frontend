import React, { useEffect } from 'react';
import styles from './HistoryView.module.css';
import HistoryList from './HistoryList/HistoryList';
import TimeframeView from './TimeframeView/TimeframeView';
import useHistoryStore from '../../store/historyStore';

const HistoryView = () => {
  const {
    // State from store
    search,
    selectedDate,
    selectedTypes,
    timeRange,
    customRange,
    
    // Actions from store
    setSearch,
    setSelectedDate,
    setTimeRange,
    setCustomRange,
    toggleType,
    
    // Data from store
    getCurrentHistoryData,
    
    // Initialize store
    initialize,
    cleanup
  } = useHistoryStore();

  // Initialize store on component mount
  useEffect(() => {
    initialize();
    
    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  const historyData = getCurrentHistoryData();

  return (
    <div className={styles.container}>
      <HistoryList
        historyData={historyData}
        search={search}
        selectedDate={selectedDate}
        selectedTypes={selectedTypes}
        timeRange={timeRange}
        customRange={customRange}
      />
      <TimeframeView
        historyData={historyData}
        selectedDate={selectedDate}
        selectedTypes={selectedTypes}
        timeRange={timeRange}
        customRange={customRange}
        onTimeRangeChange={setTimeRange}
        onCustomRangeChange={setCustomRange}
        onDateChange={setSelectedDate}
        onTypeToggle={toggleType}
      />
    </div>
  );
};

export default HistoryView;