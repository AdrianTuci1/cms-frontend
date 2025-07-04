import React, { useState } from 'react';
import styles from './ProductsPanel.module.css';

const ProductsPanel = ({ 
  onAddToCart, 
  products = [], 
  loading = false, 
  error = null,
  businessType = 'dental'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filtrează produsele după categorie
  const filteredProducts = safeProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesCategory;
  });

  // Obține categoriile unice
  const categories = ['all', ...new Set(safeProducts.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className={styles.productsPanel}>
        <div className={styles.loading}>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productsPanel}>
        <div className={styles.error}>
          <p>Error loading products: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsPanel}>
      <div className={styles.productsPanelContent}>
        <div className={styles.productsHeader}>
          <div className={styles.categoryFilter}>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <span className={styles.productCount}>
            {filteredProducts.length} products available
          </span>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found</p>
              {selectedCategory !== 'all' && <p>Try selecting a different category</p>}
            </div>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={styles.productCard}
                onClick={() => onAddToCart(product)}
              >
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <span className={styles.productCode}>ID: {product.id}</span>
                  {product.category && (
                    <span className={styles.productCategory}>{product.category}</span>
                  )}
                  {product.description && (
                    <p className={styles.productDescription}>{product.description}</p>
                  )}
                </div>
                <div className={styles.productPrice}>
                  <span className={styles.price}>{product.currentPrice || product.price} RON</span>
                  <span className={styles.stockInfo}>
                    Stock: {product.quantity}
                    {product.quantity <= 5 && (
                      <span className={styles.lowStock}> (Low Stock)</span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPanel; 