import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-scrolling to bottom when messages change
 * @param {Array} messages - Array of messages to watch
 * @returns {React.RefObject} - Ref to attach to the bottom element
 */
export const useAutoScroll = (messages) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return bottomRef;
}; 