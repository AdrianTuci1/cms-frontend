import { useEffect } from 'react';

/**
 * Custom hook to handle click outside events
 * @param {React.RefObject} ref - The ref to check against
 * @param {Function} callback - Function to call when clicking outside
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}; 