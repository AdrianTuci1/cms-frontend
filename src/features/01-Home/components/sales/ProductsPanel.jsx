import React, { useState } from 'react';
import styles from './ProductsPanel.module.css';

const ProductsPanel = ({ 
  onAddToCart, 
  products = [], 
  loading = false, 
  error = null,
  businessType = 'dental'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtrează produsele după căutare și categorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obține categoriile unice
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

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
          <h2>Products ({businessType})</h2>
          <span className={styles.productCount}>
            {filteredProducts.length} products available
          </span>
        </div>

        {/* Search and Filter Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found</p>
              {searchTerm && <p>Try adjusting your search terms</p>}
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