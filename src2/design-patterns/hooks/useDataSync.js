/**
 * useDataSync - Hook pentru sincronizarea datelor cu API și IndexedDB
 * Integrează serviciile API cu design patterns pentru o experiență completă
 * Updated pentru noua structură API din requests.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import dataSyncManager from '../data-sync/DataSyncManager';
import eventBus from '../observer/base/EventBus';

/**
 * Hook principal pentru sincronizarea datelor
 * @param {string} resource - Numele resursei (timeline, clients, packages, members, invoices, stocks, sales, agent, history, workflows, reports, roles, permissions, userData, businessInfo)
 * @param {Object} options - Opțiuni de configurare
 * @returns {Object} State-ul datelor și funcții de control
 */
export const useDataSync = (resource, options = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 30000,
    useCache = true,
    forceRefresh = false,
    maxAge = 5 * 60 * 1000, // 5 minute
    businessType = null,
    onDataUpdate = null,
    onError = null,
    params = {}
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const refreshTimeoutRef = useRef(null);
  const eventListenersRef = useRef([]);

  /**
   * Set business type if provided
   */
  useEffect(() => {
    if (businessType && dataSyncManager.businessType !== businessType) {
      dataSyncManager.setBusinessType(businessType);
    }
  }, [businessType]);

  /**
   * Funcția principală de preluare date
   */
  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      const fetchOptions = {
        forceRefresh: force || forceRefresh,
        useCache,
        maxAge,
        params
      };

      const result = await dataSyncManager.getDataWithFallback(resource, fetchOptions);
      
      setData(result);
      setLastUpdated(new Date().toISOString());
      
      if (onDataUpdate) {
        onDataUpdate(result);
      }

    } catch (err) {
      console.error(`Error fetching ${resource}:`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [resource, forceRefresh, useCache, maxAge, params, onDataUpdate, onError]);

  /**
   * Funcție pentru refresh manual
   */
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  /**
   * Funcție pentru actualizare optimistă
   */
  const optimisticUpdate = useCallback((updater) => {
    setData(prevData => {
      const newData = typeof updater === 'function' ? updater(prevData) : updater;
      
      // Emite eveniment pentru DataSyncManager
      eventBus.emit(`${resource}:updated`, {
        data: newData,
        source: 'optimistic',
        timestamp: new Date().toISOString()
      });
      
      return newData;
    });
  }, [resource]);

  /**
   * Funcție pentru operații CRUD
   */
  const performOperation = useCallback(async (operation, operationData) => {
    try {
      setLoading(true);
      setError(null);

      const dataWithOperation = {
        ...operationData,
        _operation: operation,
        businessType: businessType || dataSyncManager.businessType
      };

      // Actualizare optimistă
      if (operation === 'create') {
        optimisticUpdate(prevData => {
          const newItem = { ...operationData, id: `temp_${Date.now()}` };
          return Array.isArray(prevData) ? [...prevData, newItem] : newItem;
        });
      } else if (operation === 'update') {
        optimisticUpdate(prevData => {
          if (Array.isArray(prevData)) {
            return prevData.map(item => 
              item.id === operationData.id ? { ...item, ...operationData } : item
            );
          }
          return { ...prevData, ...operationData };
        });
      } else if (operation === 'delete') {
        optimisticUpdate(prevData => {
          if (Array.isArray(prevData)) {
            return prevData.filter(item => item.id !== operationData.id);
          }
          return null;
        });
      }

      // Sincronizare cu API
      await dataSyncManager.handleDataChange(resource, dataWithOperation);

      // Refresh pentru a obține datele actualizate
      await fetchData(true);

    } catch (err) {
      console.error(`Error performing ${operation} on ${resource}:`, err);
      setError(err);
      
      // Revert optimistic update
      await fetchData(true);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [resource, fetchData, optimisticUpdate, onError, businessType]);

  /**
   * Funcții CRUD convenabile
   */
  const create = useCallback((data) => performOperation('create', data), [performOperation]);
  const update = useCallback((data) => performOperation('update', data), [performOperation]);
  const remove = useCallback((data) => performOperation('delete', data), [performOperation]);

  /**
   * Setup event listeners pentru actualizări live
   */
  useEffect(() => {
    const listeners = [];

    // Listen pentru actualizări de la WebSocket
    const socketListener = (eventData) => {
      setData(eventData.data);
      setLastUpdated(new Date().toISOString());
      
      if (onDataUpdate) {
        onDataUpdate(eventData.data);
      }
    };

    // Listen pentru actualizări de la API
    const apiListener = (eventData) => {
      if (eventData.source === 'api') {
        setData(eventData.data);
        setLastUpdated(new Date().toISOString());
      }
    };

    // Listen pentru erori
    const errorListener = (eventData) => {
      if (eventData.resource === resource) {
        setError(eventData.error);
        if (onError) {
          onError(eventData.error);
        }
      }
    };

    // Listen pentru status online/offline
    const onlineListener = () => setIsOnline(true);
    const offlineListener = () => setIsOnline(false);

    // Adaugă listeners
    eventBus.on(`${resource}:socket-update`, socketListener);
    eventBus.on(`${resource}:api-update`, apiListener);
    eventBus.on('datasync:api-error', errorListener);
    eventBus.on('datasync:online', onlineListener);
    eventBus.on('datasync:offline', offlineListener);

    listeners.push(
      () => eventBus.off(`${resource}:socket-update`, socketListener),
      () => eventBus.off(`${resource}:api-update`, apiListener),
      () => eventBus.off('datasync:api-error', errorListener),
      () => eventBus.off('datasync:online', onlineListener),
      () => eventBus.off('datasync:offline', offlineListener)
    );

    eventListenersRef.current = listeners;

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [resource, onDataUpdate, onError]);

  /**
   * Setup auto-refresh
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const setupRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        fetchData();
        setupRefresh();
      }, refreshInterval);
    };

    setupRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, fetchData]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isOnline,
    refresh,
    create,
    update,
    remove,
    optimisticUpdate
  };
};

export default useDataSync; 