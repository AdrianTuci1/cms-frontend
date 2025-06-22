/**
 * LocalDatabase - Wrapper pentru IndexedDB
 * Gestionează stocarea locală a datelor pentru funcționarea offline
 */
class LocalDatabase {
  constructor() {
    this.dbName = 'cms-frontend-db';
    this.version = 1;
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize database
   */
  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('appointments')) {
          const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' });
          appointmentsStore.createIndex('date', 'date', { unique: false });
          appointmentsStore.createIndex('medicId', 'medicId', { unique: false });
        }

        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id' });
          historyStore.createIndex('date', 'date', { unique: false });
          historyStore.createIndex('type', 'type', { unique: false });
          historyStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncQueueStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  /**
   * Save appointment to local database
   */
  async saveAppointment(appointment) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readwrite');
      const store = transaction.objectStore('appointments');
      const request = store.put(appointment);

      request.onsuccess = () => resolve(appointment);
      request.onerror = () => reject(new Error('Failed to save appointment'));
    });
  }

  /**
   * Update appointment in local database
   */
  async updateAppointment(appointment) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readwrite');
      const store = transaction.objectStore('appointments');
      const request = store.put(appointment);

      request.onsuccess = () => resolve(appointment);
      request.onerror = () => reject(new Error('Failed to update appointment'));
    });
  }

  /**
   * Delete appointment from local database
   */
  async deleteAppointment(id) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readwrite');
      const store = transaction.objectStore('appointments');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete appointment'));
    });
  }

  /**
   * Get appointments from local database
   */
  async getAppointments(dateRange) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const request = store.getAll();

      request.onsuccess = () => {
        let appointments = request.result;
        
        // Filter by date range if provided
        if (dateRange && dateRange.startDate && dateRange.endDate) {
          appointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            return appointmentDate >= startDate && appointmentDate <= endDate;
          });
        }

        resolve(appointments);
      };
      
      request.onerror = () => reject(new Error('Failed to get appointments'));
    });
  }

  /**
   * Save history item to local database
   */
  async saveHistoryItem(historyItem) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['history'], 'readwrite');
      const store = transaction.objectStore('history');
      const request = store.put(historyItem);

      request.onsuccess = () => resolve(historyItem);
      request.onerror = () => reject(new Error('Failed to save history item'));
    });
  }

  /**
   * Update history item in local database
   */
  async updateHistoryItem(historyItem) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['history'], 'readwrite');
      const store = transaction.objectStore('history');
      const request = store.put(historyItem);

      request.onsuccess = () => resolve(historyItem);
      request.onerror = () => reject(new Error('Failed to update history item'));
    });
  }

  /**
   * Get history items from local database
   */
  async getHistoryItems(filters = {}) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['history'], 'readonly');
      const store = transaction.objectStore('history');
      const request = store.getAll();

      request.onsuccess = () => {
        let historyItems = request.result;
        
        // Apply filters
        if (filters.dateFrom) {
          historyItems = historyItems.filter(item => 
            new Date(item.date) >= new Date(filters.dateFrom)
          );
        }
        
        if (filters.dateTo) {
          historyItems = historyItems.filter(item => 
            new Date(item.date) <= new Date(filters.dateTo)
          );
        }
        
        if (filters.type) {
          historyItems = historyItems.filter(item => item.type === filters.type);
        }
        
        if (filters.status) {
          historyItems = historyItems.filter(item => item.status === filters.status);
        }

        // Sort by date (newest first)
        historyItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        resolve(historyItems);
      };
      
      request.onerror = () => reject(new Error('Failed to get history items'));
    });
  }

  /**
   * Clear all data
   */
  async clear() {
    if (!this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        ['appointments', 'history', 'syncQueue'], 
        'readwrite'
      );

      const promises = [];
      
      ['appointments', 'history', 'syncQueue'].forEach(storeName => {
        const store = transaction.objectStore(storeName);
        promises.push(new Promise((res, rej) => {
          const request = store.clear();
          request.onsuccess = () => res();
          request.onerror = () => rej();
        }));
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch(() => reject(new Error('Failed to clear database')));
    });
  }
}

export default LocalDatabase; 