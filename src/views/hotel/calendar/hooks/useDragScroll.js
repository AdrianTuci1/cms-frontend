import { useRef, useState, useCallback, useEffect } from 'react';

export const useDragScroll = () => {
  const [isDragging, setIsDragging] = useState(false);
  const tableWrapperRef = useRef(null);
  const dragStartTimeRef = useRef(Date.now());
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (!tableWrapperRef.current) return;
    
    setIsDragging(true);
    dragStartTimeRef.current = Date.now();
    
    startXRef.current = e.pageX - tableWrapperRef.current.offsetLeft;
    scrollLeftRef.current = tableWrapperRef.current.scrollLeft;

    // Prevenim selecția textului în timpul drag-ului
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !tableWrapperRef.current) return;

    const x = e.pageX - tableWrapperRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // Multiplicator pentru scroll mai rapid
    tableWrapperRef.current.scrollLeft = scrollLeftRef.current - walk;

    e.preventDefault();
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    tableWrapperRef,
    handleMouseDown,
    handleMouseMove,
    dragStartTimeRef
  };
}; 