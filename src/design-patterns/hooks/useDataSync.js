/**
 * useDataSync - Hook pentru sincronizarea datelor cu API și IndexedDB
 * Integrează serviciile API cu design patterns pentru o experiență completă
 * Updated pentru noua structură API din requests.md - Server-First Approach
 * Enhanced cu Strategy Pattern pentru validare și business logic
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dataSyncManager from '../data-sync/index.js';
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
    // businessType is deprecated - now gets from business info
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
    // Search and filter parameters
    search = null,
    filters = {},
    sortBy = null,
    sortOrder = 'asc',
    // Strategy options
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const eventListenersRef = useRef([]);
  const resourceRef = useRef(resource);
  const businessTypeRef = useRef(businessType);
  const onDataUpdateRef = useRef(onDataUpdate);
  const onErrorRef = useRef(onError);

  // Strategy pentru business logic și validare
  const strategy = useRef(null);

  // Update refs when props change
  resourceRef.current = resource;
  businessTypeRef.current = businessType;
  onDataUpdateRef.current = onDataUpdate;
  onErrorRef.current = onError;

  /**
   * Get business type from data sync manager (no longer hardcoded)
   */
  const getBusinessType = useCallback(() => {
    try {
      return dataSyncManager.resourceRegistry?.getBusinessType() || businessType || null;
    } catch (error) {
      console.warn('Error getting business type from dataSyncManager:', error);
      return businessType || null;
    }
  }, [businessType]);

  /**
   * Initialize strategy based on business type
   */
  useEffect(() => {
    if (enableBusinessLogic) {
      const currentBusinessType = getBusinessType();
      if (currentBusinessType) {
        try {
          strategy.current = crudStrategyFactory.create(currentBusinessType);
        } catch (err) {
          console.warn(`No strategy found for business type: ${currentBusinessType}`);
          strategy.current = null;
        }
      }
    }
  }, [enableBusinessLogic, getBusinessType]);

  /**
   * Set business type if provided (for backward compatibility)
   */
  useEffect(() => {
    if (businessType) {
      console.warn('Passing businessType to useDataSync is deprecated. Business type should come from business info.');
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

    return strategy.current.validateData(data, resourceRef.current);
  }, [enableValidation]);

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

    return strategy.current.processData(data, resourceRef.current);
  }, [enableBusinessLogic]);

  /**
   * Build request parameters based on resource configuration and query options
   */
  const buildRequestParams = useCallback(() => {
    const config = dataSyncManager.getResourceConfig(resourceRef.current);
    const requestParams = { ...params };

    // Add search parameters
    if (search) {
      requestParams.search = search;
    }

    // Add filter parameters
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          requestParams[key] = value;
        }
      });
    }

    // Add sorting parameters
    if (sortBy) {
      requestParams.sortBy = sortBy;
      requestParams.sortOrder = sortOrder;
    }

    // Add date range parameters for timeline
    if (config && config.requiresDateRange) {
      if (startDate) requestParams.startDate = startDate;
      if (endDate) requestParams.endDate = endDate;
    }

    // Debug logging for timeline parameters
    if (resourceRef.current === 'timeline') {
      console.log('📅 Timeline Parameters Built:', {
        startDate,
        endDate,
        finalParams: { ...requestParams }
      });
    }

    // Add pagination parameters for resources that support it
    if (config && config.supportsPagination) {
      requestParams.page = page;
      requestParams.limit = limit;
    }

    return requestParams;
  }, [params, search, filters, sortBy, sortOrder, startDate, endDate, page, limit]);

  /**
   * Funcția principală de preluare date
   */
  const fetchData = useCallback(async () => {
    let requestParams;
    try {
      setLoading(true);
      setError(null);

      // Wait for DataSyncManager to be initialized
      await dataSyncManager.waitForInitialization();

      requestParams = buildRequestParams();

      // Debug logging for timeline fetch
      if (resourceRef.current === 'timeline') {
        console.log('🔄 useDataSync fetching timeline with params:', requestParams);
      }

      const fetchOptions = {
        forceRefresh: false, // Try cache first for faster load
        useCache: true, // Use cache/IDB if available
        params: requestParams
      };

      const result = await dataSyncManager.getDataWithFallback(resourceRef.current, fetchOptions);

      // For timeline, preserve the structure (reservations array) for dental timeline hook
      let timelineResult = result;
      if (resourceRef.current === 'timeline') {
        // If result is already an array (from standardizeTimelineData), wrap it in reservations
        if (Array.isArray(result)) {
          timelineResult = { reservations: result };
        } else if (result && result.reservations) {
          // If result already has reservations, keep it as is
          timelineResult = result;
        } else {
          // Fallback: wrap single item in reservations array
          timelineResult = { reservations: [result] };
        }
      }

      // Process data using strategy
      const processedResult = processData(timelineResult, 'read');

      setData(processedResult);
      setLastUpdated(new Date().toISOString());
      setIsDataLoaded(true);

      if (onDataUpdateRef.current) {
        onDataUpdateRef.current(processedResult);
      }

      // After initial data load, trigger background refresh from server to keep data up to date
      // But only if online and not currently loading fresh data
      if (dataSyncManager.connectivityManager?.isOnline) {
        dataSyncManager.getDataWithFallback(resourceRef.current, {
          forceRefresh: true,
          useCache: false,
          params: requestParams
        }).catch(() => {/* background refresh failure ignored */ });
      }

    } catch (err) {
      console.warn(`Error fetching ${resourceRef.current}:`, err.message);

      // Încearcă să obțină date din cache ca fallback
      try {
        // Build request params again in case the first attempt failed before it was built
        const fallbackRequestParams = requestParams || buildRequestParams();
        
        const fallbackData = await dataSyncManager.getDataWithFallback(resourceRef.current, {
          forceRefresh: false,
          useCache: true,
          params: fallbackRequestParams
        });

        // For timeline, preserve the structure (reservations array) for dental timeline hook
        let processedFallbackData = fallbackData;
        if (resourceRef.current === 'timeline') {
          // If fallbackData is already an array, wrap it in reservations
          if (Array.isArray(fallbackData)) {
            processedFallbackData = { reservations: fallbackData };
          } else if (fallbackData && fallbackData.reservations) {
            // If fallbackData already has reservations, keep it as is
            processedFallbackData = fallbackData;
          } else {
            // Fallback: wrap single item in reservations array
            processedFallbackData = { reservations: [fallbackData || []] };
          }
        }

        processedFallbackData = processData(processedFallbackData, 'read');

        setData(processedFallbackData);
        setLastUpdated(new Date().toISOString());
        setIsDataLoaded(true);

        if (onDataUpdateRef.current) {
          onDataUpdateRef.current(processedFallbackData);
        }
      } catch (fallbackError) {
        console.warn(`No data available for ${resourceRef.current}:`, fallbackError.message);
        
        // Set empty data instead of error for better UX
        const emptyData = resourceRef.current === 'timeline' ? { reservations: [] } : [];
        const processedEmptyData = processData(emptyData, 'read');
        
        setData(processedEmptyData);
        setLastUpdated(new Date().toISOString());
        setIsDataLoaded(true);
        
        // Don't set error state - just log warning
        console.warn(`Using empty data structure for ${resourceRef.current} due to unavailability`);
      }
    } finally {
      setLoading(false);
    }
  }, [processData, buildRequestParams]);

  /**
   * Funcție pentru refresh manual
   */
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Memoize filters to prevent unnecessary re-renders
   */
  const memoizedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  /**
   * Initial data load on mount
   */
  useEffect(() => {
    const initialLoad = async () => {
      try {
        await dataSyncManager.waitForInitialization();
        fetchData();
      } catch (error) {
        console.warn('DataSyncManager not ready for initial load:', error);
      }
    };
    
    initialLoad();
  }, []); // Empty dependency array - only run on mount

  /**
   * Refetch data when parameters change
   */
  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        await dataSyncManager.waitForInitialization();
        fetchData();
      } catch (error) {
        console.warn('DataSyncManager not ready yet:', error);
      }
    };
    
    checkAndFetch();
  }, [startDate, endDate, page, limit, search, sortBy, sortOrder, memoizedFilters]);

  /**
   * Funcție pentru actualizare optimistă
   */
  const optimisticUpdate = useCallback((updater) => {
    setData(prevData => {
      const newData = typeof updater === 'function' ? updater(prevData) : updater;

      return newData;
    });
  }, []);

  /**
   * Funcție pentru operații CRUD cu validare și business logic
   */
  const performOperation = useCallback(async (operation, operationData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate data if validation is enabled
      if (enableValidation) {
        const validation = validateData(operationData, resourceRef.current);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // Check if operation is allowed
      const operationName = `${operation}${resourceRef.current.charAt(0).toUpperCase() + resourceRef.current.slice(1)}`;
      if (!isOperationAllowed(operationName, operationData)) {
        throw new Error('Operation not allowed');
      }

      // Process data using business logic
      const processedData = processData(operationData, operation);

      const dataWithOperation = {
        ...processedData,
        _operation: operation,
        businessType: getBusinessType()
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
      await dataSyncManager.handleDataChange(resourceRef.current, dataWithOperation);

      // Refresh pentru a obține datele actualizate
      await fetchData();

    } catch (err) {
      console.error(`Error performing ${operation} on ${resourceRef.current}:`, err);
      setError(err);

      // Revert optimistic update
      await fetchData();

      if (onErrorRef.current) {
        onErrorRef.current(err);
      }
    } finally {
      setLoading(false);
    }
  }, [enableValidation, validateData, isOperationAllowed, processData, optimisticUpdate]);

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

      if (onDataUpdateRef.current) {
        onDataUpdateRef.current(processedData);
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
      if (eventData.resource === resourceRef.current) {
        setError(eventData.error);
        if (onErrorRef.current) {
          onErrorRef.current(eventData.error);
        }
      }
    };

    // Listen pentru status online/offline
    const onlineListener = () => setIsOnline(true);
    const offlineListener = () => setIsOnline(false);

    // Adaugă listeners
    eventBus.on(`${resourceRef.current}:socket-update`, socketListener);
    eventBus.on(`${resourceRef.current}:api-update`, apiListener);
    eventBus.on('datasync:api-error', errorListener);
    eventBus.on('datasync:online', onlineListener);
    eventBus.on('datasync:offline', offlineListener);

    listeners.push(
      () => eventBus.off(`${resourceRef.current}:socket-update`, socketListener),
      () => eventBus.off(`${resourceRef.current}:api-update`, apiListener),
      () => eventBus.off('datasync:api-error', errorListener),
      () => eventBus.off('datasync:online', onlineListener),
      () => eventBus.off('datasync:offline', offlineListener)
    );

    eventListenersRef.current = listeners;

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
      eventListenersRef.current = [];
    };
  }, [processData]); // Doar processData ca dependență

  /**
   * Initial data fetch - only run once on mount
   */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  /**
   * Clear duplicates from the current resource
   */
  const clearDuplicates = useCallback(async () => {
    try {
      const count = await dataSyncManager.clearDuplicates(resourceRef.current);
      console.log(`Cleared ${count} duplicates from ${resourceRef.current}`);

      // Refresh data after clearing duplicates
      await fetchData();

      return count;
    } catch (error) {
      console.error(`Error clearing duplicates for ${resourceRef.current}:`, error);
      throw error;
    }
  }, [fetchData]);

  /**
   * Clear all data from the current resource
   */
  const clearResourceData = useCallback(async () => {
    try {
      const count = await dataSyncManager.clearResourceData(resourceRef.current);
      console.log(`Cleared ${count} records from ${resourceRef.current}`);

      // Refresh data after clearing
      await fetchData();

      return count;
    } catch (error) {
      console.error(`Error clearing data for ${resourceRef.current}:`, error);
      throw error;
    }
  }, [fetchData]);

  /**
   * Get supported query parameters for the current resource
   */
  const getSupportedQueryParams = useCallback(() => {
    return dataSyncManager.resourceRegistry?.getSupportedQueryParams(resourceRef.current) || {
      supported: [],
      searchable: [],
      filterable: [],
      sortable: []
    };
  }, []);

  /**
   * Build search query for the current resource
   */
  const buildSearchQuery = useCallback((searchTerm) => {
    return dataSyncManager.resourceRegistry?.buildSearchQuery(resourceRef.current, searchTerm) || {};
  }, []);

  return {
    // Data state
    data,
    loading,
    error,
    lastUpdated,
    isDataLoaded,

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
    businessType: getBusinessType(),

    // Utility operations
    clearDuplicates,
    clearResourceData,

    // Query parameter utilities
    getSupportedQueryParams,
    buildSearchQuery
  };
};

export default useDataSync; 