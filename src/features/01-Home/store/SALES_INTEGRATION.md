# Sales Integration Documentation

## Overview

SalesView a fost refactorizat pentru a folosi un store dedicat (`salesStore`) care integrează API-ul cu design patterns pentru o experiență completă de vânzări.

## Architecture

### Sales Store (`salesStore.js`)

Store-ul principal care gestionează toată logica de business pentru vânzări:

```javascript
import { useSalesStore } from '../store';

const {
  cart,
  total,
  stocksData,
  addToCart,
  removeFromCart,
  finalizeSale,
  validateCart,
  // ... și multe altele
} = useSalesStore(businessType);
```

### Integrare cu API

Store-ul folosește `useDataSync` pentru sincronizarea cu serverul:

- **Stocks**: Produsele disponibile pentru vânzare
- **Sales**: Istoricul vânzărilor
- **Invoices**: Facturile generate

### Strategy Pattern

Fiecare business type (dental, gym, hotel) are propriile reguli de business:

- Validare specifică business
- Permisiuni specifice
- Procesare date specifică

## Componente Actualizate

### SalesView.jsx

```javascript
// Înainte
const [cart, setCart] = useState([]);
const [total, setTotal] = useState(0);

// După
const {
  cart,
  total,
  addToCart,
  removeFromCart,
  finalizeSale
} = useSalesStore(businessType);
```

### ProductsPanel.jsx

```javascript
// Înainte
import { stocksData } from '../../../data/stocksData';

// După
const ProductsPanel = ({ 
  products = [], 
  loading = false, 
  error = null,
  businessType = 'dental'
}) => {
  // Folosește datele din store
}
```

### ReceiptPanel.jsx

```javascript
// Înainte
const ReceiptPanel = ({ cart, total, onUpdateQuantity, onRemoveFromCart, onValidate, onCancel }) => {

// După
const ReceiptPanel = ({ 
  cart, 
  total, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onValidate, 
  onCancel,
  canCreateSale = true,
  businessType = 'dental'
}) => {
```

## Funcționalități Noi

### 1. Validare în Timp Real

```javascript
const handleAddToCart = (product) => {
  try {
    addToCart(product); // Validare automată a stocului
  } catch (error) {
    console.error('Error adding to cart:', error.message);
  }
};
```

### 2. Sincronizare Automată cu Stocks

```javascript
// După finalizarea vânzării
for (const item of cart) {
  const stockItem = stocksData?.find(stock => stock.productId === item.id);
  if (stockItem) {
    const newQuantity = stockItem.quantity - item.quantity;
    await updateStock({
      id: stockItem.id,
      quantity: newQuantity
    });
  }
}
```

### 3. Generare Automată de Facturi

```javascript
if (customerInfo.createInvoice) {
  const invoiceData = {
    saleId: createdSale.id,
    customerInfo,
    items: saleData.items,
    total,
    paymentMethod,
    businessType,
    status: 'pending'
  };
  
  await createInvoice(invoiceData);
}
```

### 4. Observer Pattern pentru Evenimente

```javascript
// Listen pentru evenimente
subscribe('cart:itemAdded', (data) => {
  console.log('Item added to cart:', data);
});

subscribe('sale:completed', (data) => {
  console.log('Sale completed:', data);
});
```

## Beneficii

### 1. API Integration
- ✅ Sincronizare în timp real cu serverul
- ✅ Actualizare automată a stocului
- ✅ Generare automată de facturi
- ✅ Istoric vânzări persistent

### 2. Business Logic
- ✅ Validare specifică business type
- ✅ Verificare permisiuni
- ✅ Reguli de business specifice
- ✅ Validare date în timp real

### 3. Observer Pattern
- ✅ Actualizări în timp real
- ✅ Arhitectură event-driven
- ✅ Comunicare cross-component
- ✅ Sincronizare state

### 4. Error Handling
- ✅ Gestionare erori API
- ✅ Validare în timp real
- ✅ Feedback utilizator
- ✅ Rollback automat

## Exemplu de Utilizare

```javascript
import React from 'react';
import { useSalesStore } from '../store';

const SalesView = ({ businessType = 'dental' }) => {
  const {
    cart,
    total,
    stocksData,
    addToCart,
    removeFromCart,
    finalizeSale,
    canCreateSale
  } = useSalesStore(businessType);

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
    } catch (error) {
      // Gestionare eroare
      console.error('Error:', error.message);
    }
  };

  const handleFinalizeSale = async () => {
    try {
      const sale = await finalizeSale('cash', {
        name: 'John Doe',
        email: 'john@example.com',
        createInvoice: true
      });
      console.log('Sale completed:', sale);
    } catch (error) {
      console.error('Sale failed:', error);
    }
  };

  return (
    <div>
      {/* UI pentru vânzări */}
    </div>
  );
};
```

## Testing

Pentru testarea integrării, folosește `SalesIntegrationExample`:

```javascript
import { SalesIntegrationExample } from '../store';

// În componenta ta
<SalesIntegrationExample businessType="dental" />
```

## Migrare

Pentru a migra de la vechiul sistem:

1. Înlocuiește state-ul local cu `useSalesStore`
2. Actualizează componentele pentru a folosi datele din store
3. Adaugă gestionarea erorilor
4. Testează cu `SalesIntegrationExample`

## Concluzie

Integrarea SalesView cu API-ul prin `salesStore` oferă:

- **Performanță**: Sincronizare eficientă cu serverul
- **Scalabilitate**: Arhitectură modulară și extensibilă
- **Mentenabilitate**: Cod curat și bine structurat
- **User Experience**: Feedback în timp real și gestionare erori
- **Business Logic**: Reguli specifice pentru fiecare business type 