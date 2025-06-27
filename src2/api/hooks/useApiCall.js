/**
 * Hook unificat pentru toate cererile API
 * Înlocuiește useAuth și useApiError cu o singură soluție
 */
import { useState, useCallback } from 'react';

export const useApiCall = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      
      // Log error în development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
          timestamp: new Date().toISOString()
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

/**
 * Hook pentru cereri API cu parametri
 */
export const useApiCallWithParams = (apiFunction, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (additionalParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const finalParams = { ...params, ...additionalParams };
      const result = await apiFunction(finalParams);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      
      // Log error în development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
          timestamp: new Date().toISOString()
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}; 