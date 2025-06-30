/**
 * useObserver - Hook pentru Observer Pattern
 * Gestionează event handling și comunicarea între componente
 */

import { useEffect, useCallback, useRef } from 'react';
import eventBus from '../observer/base/EventBus';

/**
 * Hook pentru observer pattern
 * @returns {Object} Funcții pentru event handling
 */
export const useObserver = () => {
  const listenersRef = useRef(new Map());

  /**
   * Subscribe la un eveniment
   * @param {string} event - Numele evenimentului
   * @param {Function} callback - Funcția de callback
   * @param {Object} options - Opțiuni suplimentare
   */
  const subscribe = useCallback((event, callback, options = {}) => {
    const { once = false, priority = 0 } = options;
    
    const listener = {
      callback,
      once,
      priority,
      timestamp: Date.now()
    };

    // Adaugă listener-ul
    eventBus.on(event, callback);
    
    // Stochează referința pentru cleanup
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event).push(listener);

    // Returnează funcția de unsubscribe
    return () => {
      eventBus.off(event, callback);
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        const index = listeners.findIndex(l => l.callback === callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }, []);

  /**
   * Unsubscribe de la un eveniment
   * @param {string} event - Numele evenimentului
   * @param {Function} callback - Funcția de callback (opțional)
   */
  const unsubscribe = useCallback((event, callback = null) => {
    if (callback) {
      eventBus.off(event, callback);
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        const index = listeners.findIndex(l => l.callback === callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      // Unsubscribe de la toate listener-urile pentru acest eveniment
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        listeners.forEach(listener => {
          eventBus.off(event, listener.callback);
        });
        listenersRef.current.delete(event);
      }
    }
  }, []);

  /**
   * Emite un eveniment
   * @param {string} event - Numele evenimentului
   * @param {*} data - Datele de emis
   */
  const emit = useCallback((event, data) => {
    eventBus.emit(event, data);
  }, []);

  /**
   * Emite un eveniment cu delay
   * @param {string} event - Numele evenimentului
   * @param {*} data - Datele de emis
   * @param {number} delay - Delay-ul în milisecunde
   */
  const emitDelayed = useCallback((event, data, delay) => {
    setTimeout(() => {
      eventBus.emit(event, data);
    }, delay);
  }, []);

  /**
   * Emite un eveniment cu debounce
   * @param {string} event - Numele evenimentului
   * @param {*} data - Datele de emis
   * @param {number} delay - Delay-ul în milisecunde
   */
  const emitDebounced = useCallback((() => {
    const timers = new Map();
    
    return (event, data, delay) => {
      if (timers.has(event)) {
        clearTimeout(timers.get(event));
      }
      
      const timer = setTimeout(() => {
        eventBus.emit(event, data);
        timers.delete(event);
      }, delay);
      
      timers.set(event, timer);
    };
  })(), []);

  /**
   * Cleanup la unmount
   */
  useEffect(() => {
    return () => {
      // Cleanup toate listener-urile
      listenersRef.current.forEach((listeners, event) => {
        listeners.forEach(listener => {
          eventBus.off(event, listener.callback);
        });
      });
      listenersRef.current.clear();
    };
  }, []);

  return {
    subscribe,
    unsubscribe,
    emit,
    emitDelayed,
    emitDebounced
  };
};

/**
 * Hook pentru un eveniment specific
 * @param {string} event - Numele evenimentului
 * @param {Function} callback - Funcția de callback
 * @param {Object} options - Opțiuni
 */
export const useEvent = (event, callback, options = {}) => {
  const { subscribe, unsubscribe } = useObserver();

  useEffect(() => {
    const unsubscribeFn = subscribe(event, callback, options);
    return unsubscribeFn;
  }, [event, callback, subscribe, options]);
};

/**
 * Hook pentru multiple evenimente
 * @param {Array} events - Array de evenimente cu callback-uri
 */
export const useEvents = (events) => {
  const { subscribe, unsubscribe } = useObserver();

  useEffect(() => {
    const unsubscribers = events.map(({ event, callback, options = {} }) => 
      subscribe(event, callback, options)
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [events, subscribe]);
};

export default useObserver; 