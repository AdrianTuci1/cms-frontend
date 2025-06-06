import React from 'react';
import StocksView from './StocksView';
import './StocksView.module.css';

const StocksSection = ({ view = 'inventory' }) => {
  return <StocksView view={view} />;
};

export default StocksSection; 