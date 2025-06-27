/**
 * useDataSync - Hook pentru sincronizarea datelor cu API și IndexedDB
 * Integrează serviciile API cu design patterns pentru o experiență completă
 * Updated pentru noua structură API din requests.md - Server-First Approach
 * Enhanced cu Strategy Pattern pentru validare și business logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import dataSyncManager from '../data-sync/DataSyncManager';
import eventBus from '../observer/base/EventBus';
import { crudStrategyFactory } from '../strategy/CRUDStrategy.js';

/**
 * Hook principal pentru sincronizarea datelor
 * @param {string} resource - Numele resursei (timeline, clients, packages, members, invoices, stocks, sales, agent, history, workflows, reports, roles, permissions, userData, businessInfo)
 * @param {Object} options - Opțiuni de configurare
 * @returns {Object} State-ul datelor și funcții de control
 */
export const useDataSync = (resource, options = {}) => {
  const {
    businessType = null,
    onDataUpdate = null,
    onError = null,
    params = {},
    // Date range parameters for timeline
    startDate = null,
    endDate = null,
    // Pagination parameters for clients/members
    page = 1,
    limit = 20,
    // Strategy options
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const eventListenersRef = useRef([]);

  // Strategy pentru business logic și validare
  const strategy = useRef(null);

  /**
   * Initialize strategy based on business type
   */
  useEffect(() => {
    if (enableBusinessLogic && businessType) {
      try {
        strategy.current = crudStrategyFactory.create(businessType);
      } catch (err) {
        console.warn(`No strategy found for business type: ${businessType}`);
        strategy.current = null;
      }
    }
  }, [businessType, enableBusinessLogic]);

  /**
   * Set business type if provided
   */
  useEffect(() => {
    if (businessType && dataSyncManager.businessType !== businessType) {
      dataSyncManager.setBusinessType(businessType);
    }
  }, [businessType]);

  /**
   * Validate data using strategy
   */
  const validateData = useCallback((data, operation = 'create') => {
    if (!enableValidation || !strategy.current) {
      return { isValid: true, errors: [] };
    }

    return strategy.current.validateData(data, resource);
  }, [resource, enableValidation]);

  /**
   * Check if operation is allowed using strategy
   */
  const isOperationAllowed = useCallback((operation, data = {}) => {
    if (!enableBusinessLogic || !strategy.current) {
      return true;
    }

    return strategy.current.isOperationAllowed(operation, data);
  }, [enableBusinessLogic]);

  /**
   * Process data using strategy
   */
  const processData = useCallback((data, operation = 'create') => {
    if (!enableBusinessLogic || !strategy.current) {
      return data;
    }

    return strategy.current.processData(data, resource);
  }, [resource, enableBusinessLogic]);

  /**
   * Build request parameters based on resource configuration
   */
  const buildRequestParams = useCallback(() => {
    const config = dataSyncManager.getResourceConfig(resource);
    const requestParams = { ...params };

    // Add date range parameters for timeline
    if (config && config.requiresDateRange) {
      if (startDate) requestParams.startDate = startDate;
      if (endDate) requestParams.endDate = endDate;
    }

    // Add pagination parameters for resources that support it
    if (config && config.supportsPagination) {
      requestParams.page = page;
      requestParams.limit = limit;
    }

    return requestParams;
  }, [resource, params, startDate, endDate, page, limit]);

  /**
   * Funcția principală de preluare date
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const requestParams = buildRequestParams();

      const fetchOptions = {
        forceRefresh: true, // Always fetch from server
        useCache: false, // Never use cache in server-first approach
        params: requestParams
      };

      const result = await dataSyncManager.getDataWithFallback(resource, fetchOptions);
      
      // Process data using strategy
      const processedResult = processData(result, 'read');
      
      setData(processedResult);
      setLastUpdated(new Date().toISOString());
      
      if (onDataUpdate) {
        onDataUpdate(processedResult);
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
  }, [resource, onDataUpdate, onError, buildRequestParams, processData]);

  /**
   * Funcție pentru refresh manual
   */
  const refresh = useCallback(() => {
    fetchData();
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
   * Funcție pentru operații CRUD cu validare și business logic
   */
  const performOperation = useCallback(async (operation, operationData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate data if validation is enabled
      if (enableValidation) {
        const validation = validateData(operationData, operation);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // Check if operation is allowed
      const operationName = `${operation}${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      if (!isOperationAllowed(operationName, operationData)) {
        throw new Error('Operation not allowed');
      }

      // Process data using business logic
      const processedData = processData(operationData, operation);

      const dataWithOperation = {
        ...processedData,
        _operation: operation,
        businessType: businessType || dataSyncManager.businessType
      };

      // Actualizare optimistă
      if (operation === 'create') {
        optimisticUpdate(prevData => {
          const newItem = { ...processedData, id: `temp_${Date.now()}` };
          return Array.isArray(prevData) ? [...prevData, newItem] : newItem;
        });
      } else if (operation === 'update') {
        optimisticUpdate(prevData => {
          if (Array.isArray(prevData)) {
            return prevData.map(item => 
              item.id === processedData.id ? { ...item, ...processedData } : item
            );
          }
          return { ...prevData, ...processedData };
        });
      } else if (operation === 'delete') {
        optimisticUpdate(prevData => {
          if (Array.isArray(prevData)) {
            return prevData.filter(item => item.id !== processedData.id);
          }
          return null;
        });
      }

      // Sincronizare cu API
      await dataSyncManager.handleDataChange(resource, dataWithOperation);

      // Refresh pentru a obține datele actualizate
      await fetchData();

    } catch (err) {
      console.error(`Error performing ${operation} on ${resource}:`, err);
      setError(err);
      
      // Revert optimistic update
      await fetchData();
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [resource, fetchData, optimisticUpdate, onError, businessType, enableValidation, validateData, isOperationAllowed, processData]);

  /**
   * Funcții CRUD convenabile cu validare și business logic
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
      const processedData = processData(eventData.data, 'read');
      setData(processedData);
      setLastUpdated(new Date().toISOString());
      
      if (onDataUpdate) {
        onDataUpdate(processedData);
      }
    };

    // Listen pentru actualizări de la API
    const apiListener = (eventData) => {
      if (eventData.source === 'api') {
        const processedData = processData(eventData.data, 'read');
        setData(processedData);
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
  }, [resource, onDataUpdate, onError, processData]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data state
    data,
    loading,
    error,
    lastUpdated,
    isOnline,
    
    // CRUD operations
    refresh,
    create,
    update,
    remove,
    optimisticUpdate,
    
    // Strategy methods
    validateData,
    isOperationAllowed,
    processData,
    
    // Strategy info
    strategy: strategy.current?.getName() || 'No Strategy',
    businessType: businessType || dataSyncManager.businessType
  };
};

export default useDataSync; 