/**
 * Stocks Mock Data - Date mock pentru stocuri
 */

// Mock data pentru stocks
export const stocksMock = {
  id: 'stocks-001',
  items: [
    {
      id: 'stock-001',
      code: 'PROD001',
      name: 'Protein Powder',
      category: 'Supplements',
      quantity: 50,
      minQuantity: 10,
      currentPrice: 25.50,
      price: 25.50,
      status: 'in-stock',
      description: 'High-quality protein powder for muscle building'
    },
    {
      id: 'stock-002',
      code: 'PROD002',
      name: 'Energy Drink',
      category: 'Drinks',
      quantity: 5,
      minQuantity: 10,
      currentPrice: 15.75,
      price: 15.75,
      status: 'low-stock',
      description: 'Refreshing energy drink with vitamins'
    },
    {
      id: 'stock-003',
      code: 'PROD003',
      name: 'Vitamin C',
      category: 'Supplements',
      quantity: 25,
      minQuantity: 5,
      currentPrice: 12.99,
      price: 12.99,
      status: 'in-stock',
      description: 'Vitamin C supplements for immune support'
    },
    {
      id: 'stock-004',
      code: 'PROD004',
      name: 'Sports Water',
      category: 'Drinks',
      quantity: 3,
      minQuantity: 15,
      currentPrice: 8.50,
      price: 8.50,
      status: 'low-stock',
      description: 'Electrolyte-enhanced sports water'
    },
    {
      id: 'stock-005',
      code: 'PROD005',
      name: 'Creatine Monohydrate',
      category: 'Supplements',
      quantity: 35,
      minQuantity: 8,
      currentPrice: 18.99,
      price: 18.99,
      status: 'in-stock',
      description: 'Pure creatine monohydrate for strength'
    }
  ]
};

/**
 * Funcție pentru obținerea datelor stocuri
 */
export function getStocksMock(businessType = null) {
  return stocksMock;
}

export default {
  stocksMock,
  getStocksMock
}; 