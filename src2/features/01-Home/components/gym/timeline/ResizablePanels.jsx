import React, { useState, useRef, useEffect } from 'react';
import styles from './ResizablePanels.module.css';

const ResizablePanels = ({ leftContent, rightContent }) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(75);
  const containerRef = useRef(null);
  const isResizingRef = useRef(false);

  const handleMouseDown = (e) => {
    isResizingRef.current = true;
    document.body.style.cursor = 'ew-resize';
  };

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setLeftPanelWidth(Math.max(40, Math.min(90, newWidth)));
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.body.style.cursor = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={styles.panelsContainer} ref={containerRef}>
      <div 
        className={styles.leftPanel}
        style={{ width: `${leftPanelWidth}%` }}
      >
        {leftContent}
      </div>

      <div 
        className={styles.resizeHandle}
        onMouseDown={handleMouseDown}
      />

      <div 
        className={styles.rightPanel}
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {rightContent}
      </div>
    </div>
  );
};

export default ResizablePanels; 