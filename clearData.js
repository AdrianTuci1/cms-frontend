/**
 * Database Clear Utility - Browser Version
 * 
 * Open this file in your browser to clear IndexedDB data
 */

// Simple browser-based database clear
async function clearDatabase() {
  console.log('🗑️ Starting database clear...');
  
  try {
    // Delete the entire database
    const dbName = 'cms-frontend';
    const request = indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = function() {
      console.log('✅ Database deleted successfully!');
      console.log('🔄 Please refresh the page to reinitialize the database');
    };
    
    request.onerror = function() {
      console.error('❌ Error deleting database:', request.error);
    };
    
    request.onblocked = function() {
      console.warn('⚠️ Database deletion was blocked. Please close other tabs using this database.');
    };
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

// Clear specific stores only (if database exists)
async function clearSpecificStores() {
  console.log('🗑️ Clearing specific stores...');
  
  try {
    const dbName = 'cms-frontend';
    const request = indexedDB.open(dbName, 2);
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      const stores = ['timeline', 'clients', 'packages', 'members', 'invoices', 'stocks', 'sales'];
      
      let clearedCount = 0;
      
      stores.forEach(storeName => {
        if (db.objectStoreNames.contains(storeName)) {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          store.clear();
          
          transaction.oncomplete = function() {
            clearedCount++;
            console.log(`✅ Cleared store: ${storeName}`);
            
            if (clearedCount === stores.length) {
              console.log('🎉 All stores cleared!');
              db.close();
            }
          };
        }
      });
    };
    
    request.onerror = function() {
      console.error('❌ Error opening database:', request.error);
    };
    
  } catch (error) {
    console.error('❌ Error clearing stores:', error);
  }
}

// Check what's in the database
async function inspectDatabase() {
  console.log('🔍 Inspecting database...');
  
  try {
    const dbName = 'cms-frontend';
    const request = indexedDB.open(dbName, 2);
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log('📊 Database stores:', Array.from(db.objectStoreNames));
      
      // Check timeline store specifically
      if (db.objectStoreNames.contains('timeline')) {
        const transaction = db.transaction('timeline', 'readonly');
        const store = transaction.objectStore('timeline');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = function() {
          const timelineData = getAllRequest.result;
          console.log(`📅 Timeline records: ${timelineData.length}`);
          console.log('📋 Sample timeline data:', timelineData.slice(0, 3));
        };
      }
      
      db.close();
    };
    
    request.onerror = function() {
      console.error('❌ Error opening database:', request.error);
    };
    
  } catch (error) {
    console.error('❌ Error inspecting database:', error);
  }
}

// Make functions available globally
window.clearDatabase = clearDatabase;
window.clearSpecificStores = clearSpecificStores;
window.inspectDatabase = inspectDatabase;

console.log('🛠️ Database clear utilities loaded!');
console.log('');
console.log('Available functions:');
console.log('  - clearDatabase() - Delete entire database');
console.log('  - clearSpecificStores() - Clear data from all stores');
console.log('  - inspectDatabase() - Check what\'s in the database');
console.log('');
console.log('💡 Run clearDatabase() to completely reset the database'); 