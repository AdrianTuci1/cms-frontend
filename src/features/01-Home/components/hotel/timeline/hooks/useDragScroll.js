import { useRef, useState, useCallback, useEffect } from 'react';

export const useDragScroll = () => {
  const [isDragging, setIsDragging] = useState(false);
  const tableWrapperRef = useRef(null);
  const dragStartTimeRef = useRef(Date.now());
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (!tableWrapperRef.current) return;
    
    setIsDragging(true);
    dragStartTimeRef.current = Date.now();
    
    startXRef.current = e.pageX - tableWrapperRef.current.offsetLeft;
    startYRef.current = e.pageY - tableWrapperRef.current.offsetTop;
    scrollLeftRef.current = tableWrapperRef.current.scrollLeft;
    scrollTopRef.current = tableWrapperRef.current.scrollTop;

    // Prevenim selecția textului în timpul drag-ului
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !tableWrapperRef.current) return;

    const x = e.pageX - tableWrapperRef.current.offsetLeft;
    const y = e.pageY - tableWrapperRef.current.offsetTop;
    
    const walkX = (x - startXRef.current) * 2; // Multiplicator pentru scroll mai rapid
    const walkY = (y - startYRef.current) * 2;

    tableWrapperRef.current.scrollLeft = scrollLeftRef.current - walkX;
    tableWrapperRef.current.scrollTop = scrollTopRef.current - walkY;

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