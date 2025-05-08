import React from 'react';
import { stocksData } from '../../../data/stocksData';
import styles from './ProductsPanel.module.css';

const ProductsPanel = ({ onAddToCart }) => (
  <div className={styles.productsPanel}>
    <div className={styles.productsPanelContent}>
      <div className={styles.productsHeader}>
        <span className={styles.productCount}>{stocksData.inventory.length} produse disponibile</span>
      </div>
      <div className={styles.productsGrid}>
        {stocksData.inventory.map(product => (
          <div 
            key={product.id} 
            className={styles.productCard}
            onClick={() => onAddToCart(product)}
          >
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <span className={styles.productCode}>{product.code}</span>
            </div>
            <div className={styles.productPrice}>
              <span>{product.currentPrice} RON</span>
              <span className={styles.stockInfo}>Stoc: {product.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductsPanel; 