/**
 * React hook for managing offline data and feature availability
 * Provides offline-aware data fetching and feature access control
 */
import { useState, useEffect, useCallback } from 'react';
import offlineManager from '../offline/OfflineManager';
import dataSyncManager from '../data-sync/DataSyncManager';
import eventBus from '../observer/base/EventBus';

export const useOfflineData = (feature, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  const {
    autoRefresh = true,
    refreshInterval = 30000,
    fallbackToOffline = true,
    onDataChange = null
  } = options;

  // Check feature availability
  const isFeatureAvailable = offlineManager.isFeatureAvailable(feature);
  const canAccessOfflineData = offlineManager.hasOfflineData(feature);

  /**
   * Load data from IndexedDB with API fallback
   */
  const loadData = useCallback(async () => {
    if (!isFeatureAvailable) {
      setError(new Error(`${feature} is not available offline`));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to get data with fallback to API
      const result = await dataSyncManager.getDataWithFallback(feature, options);
      
      if (result) {
        setData(result);
        setHasOfflineData(true);
        
        if (onDataChange) {
          onDataChange(result);
        }
      } else {
        setData(null);
        setHasOfflineData(false);
      }
    } catch (err) {
      console.error(`Error loading data for ${feature}:`, err);
      setError(err);
      
      // Try to get offline data as last resort
      if (fallbackToOffline && canAccessOfflineData) {
        const offlineData = offlineManager.getOfflineData(feature);
        if (offlineData) {
          setData(offlineData);
          setHasOfflineData(true);
          setError(new Error(`Using offline data for ${feature}`));
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [feature, isFeatureAvailable, canAccessOfflineData, fallbackToOffline, onDataChange, options]);

  /**
   * Update data and sync
   */
  const updateData = useCallback(async (newData) => {
    if (!isFeatureAvailable) {
      throw new Error(`${feature} is not available offline`);
    }

    try {
      // Update local state immediately
      setData(newData);
      
      // Store in IndexedDB
      await dataSyncManager.storeData(feature, newData);
      
      // Emit update event
      eventBus.emit(`${feature}:updated`, newData);
      
      if (onDataChange) {
        onDataChange(newData);
      }
    } catch (err) {
      console.error(`Error updating data for ${feature}:`, err);
      throw err;
    }
  }, [feature, isFeatureAvailable, onDataChange]);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  /**
   * Clear offline data
   */
  const clearOfflineData = useCallback(() => {
    offlineManager.clearOfflineData(feature);
    setHasOfflineData(false);
  }, [feature]);

  // Setup event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (autoRefresh) {
        loadData();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleDataUpdate = (updatedData) => {
      setData(updatedData);
      setHasOfflineData(true);
      
      if (onDataChange) {
        onDataChange(updatedData);
      }
    };

    const handleFeatureAvailabilityChange = ({ feature: changedFeature, isAvailable }) => {
      if (changedFeature === feature && !isAvailable) {
        setError(new Error(`${feature} is not available offline`));
      }
    };

    // Listen for network changes
    eventBus.on('offline:online', handleOnline);
    eventBus.on('offline:offline', handleOffline);
    
    // Listen for data updates
    eventBus.on(`${feature}:socket-update`, handleDataUpdate);
    eventBus.on(`${feature}:updated`, handleDataUpdate);
    
    // Listen for feature availability changes
    eventBus.on('offline:feature-availability-changed', handleFeatureAvailabilityChange);

    // Initial data load
    loadData();

    // Setup auto-refresh if enabled
    let refreshTimer = null;
    if (autoRefresh && refreshInterval > 0) {
      refreshTimer = setInterval(loadData, refreshInterval);
    }

    return () => {
      eventBus.off('offline:online', handleOnline);
      eventBus.off('offline:offline', handleOffline);
      eventBus.off(`${feature}:socket-update`, handleDataUpdate);
      eventBus.off(`${feature}:updated`, handleDataUpdate);
      eventBus.off('offline:feature-availability-changed', handleFeatureAvailabilityChange);
      
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [feature, loadData, autoRefresh, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    isOffline,
    hasOfflineData,
    isFeatureAvailable,
    canAccessOfflineData,
    updateData,
    refresh,
    clearOfflineData
  };
};

/**
 * Hook for checking if a feature is available offline
 */
export const useFeatureAvailability = (feature) => {
  const [isAvailable, setIsAvailable] = useState(offlineManager.isFeatureAvailable(feature));
  const [hasOfflineData, setHasOfflineData] = useState(offlineManager.hasOfflineData(feature));

  useEffect(() => {
    const handleAvailabilityChange = ({ feature: changedFeature, isAvailable: available, hasOfflineData: offlineData }) => {
      if (changedFeature === feature) {
        setIsAvailable(available);
        setHasOfflineData(offlineData);
      }
    };

    eventBus.on('offline:feature-availability-changed', handleAvailabilityChange);

    return () => {
      eventBus.off('offline:feature-availability-changed', handleAvailabilityChange);
    };
  }, [feature]);

  return {
    isAvailable,
    hasOfflineData,
    isOnline: navigator.onLine
  };
};

/**
 * Hook for offline status and sync information
 */
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(dataSyncManager.getSyncStatus());
  const [offlineStatus, setOfflineStatus] = useState(offlineManager.getOfflineStatus());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus(dataSyncManager.getSyncStatus());
      setOfflineStatus(offlineManager.getOfflineStatus());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(dataSyncManager.getSyncStatus());
      setOfflineStatus(offlineManager.getOfflineStatus());
    };

    const handleSyncStatusChange = () => {
      setSyncStatus(dataSyncManager.getSyncStatus());
    };

    const handleOfflineStatusChange = () => {
      setOfflineStatus(offlineManager.getOfflineStatus());
    };

    eventBus.on('offline:online', handleOnline);
    eventBus.on('offline:offline', handleOffline);
    eventBus.on('datasync:synced', handleSyncStatusChange);
    eventBus.on('datasync:queue-processed', handleSyncStatusChange);
    eventBus.on('offline:feature-availability-changed', handleOfflineStatusChange);

    return () => {
      eventBus.off('offline:online', handleOnline);
      eventBus.off('offline:offline', handleOffline);
      eventBus.off('datasync:synced', handleSyncStatusChange);
      eventBus.off('datasync:queue-processed', handleSyncStatusChange);
      eventBus.off('offline:feature-availability-changed', handleOfflineStatusChange);
    };
  }, []);

  return {
    isOnline,
    syncStatus,
    offlineStatus
  };
};

// Default export
export default useOfflineData; 