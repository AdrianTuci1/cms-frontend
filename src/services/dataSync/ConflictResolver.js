/**
 * ConflictResolver - Rezolvă conflictele de date între versiunile locale și server
 * Implementează Strategy Pattern pentru diferite strategii de rezolvare
 */
class ConflictResolver {
  constructor() {
    this.strategies = {
      'last-write-wins': this.lastWriteWins.bind(this),
      'server-wins': this.serverWins.bind(this),
      'client-wins': this.clientWins.bind(this),
      'manual': this.manualResolution.bind(this),
      'merge': this.mergeData.bind(this)
    };
  }

  /**
   * Resolve conflict between local and server data
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @param {string} strategy - Resolution strategy
   * @returns {Object} Resolved data
   */
  resolve(localData, serverData, strategy = 'last-write-wins') {
    const resolver = this.strategies[strategy];
    
    if (!resolver) {
      console.warn(`Unknown conflict resolution strategy: ${strategy}, using last-write-wins`);
      return this.lastWriteWins(localData, serverData);
    }

    return resolver(localData, serverData);
  }

  /**
   * Last write wins strategy
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Object} Data with latest timestamp
   */
  lastWriteWins(localData, serverData) {
    const localTimestamp = localData.updatedAt || localData.createdAt || 0;
    const serverTimestamp = serverData.updatedAt || serverData.createdAt || 0;

    return localTimestamp > serverTimestamp ? localData : serverData;
  }

  /**
   * Server wins strategy
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Object} Server data
   */
  serverWins(localData, serverData) {
    return serverData;
  }

  /**
   * Client wins strategy
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Object} Local data
   */
  clientWins(localData, serverData) {
    return localData;
  }

  /**
   * Manual resolution strategy (requires user input)
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Promise<Object>} Resolved data
   */
  async manualResolution(localData, serverData) {
    // This would trigger a UI dialog for user to choose
    // For now, return a promise that resolves to local data
    return new Promise((resolve) => {
      console.log('Manual conflict resolution required');
      console.log('Local data:', localData);
      console.log('Server data:', serverData);
      
      // In a real implementation, this would show a UI dialog
      // For now, default to local data
      resolve(localData);
    });
  }

  /**
   * Merge data strategy
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Object} Merged data
   */
  mergeData(localData, serverData) {
    const merged = { ...serverData };

    // Merge non-conflicting fields
    Object.keys(localData).forEach(key => {
      if (!this.hasConflict(localData[key], serverData[key])) {
        merged[key] = localData[key];
      }
    });

    // Add conflict resolution metadata
    merged._merged = true;
    merged._mergedAt = Date.now();
    merged._localVersion = localData.version || 0;
    merged._serverVersion = serverData.version || 0;

    return merged;
  }

  /**
   * Check if two values have a conflict
   * @param {*} localValue - Local value
   * @param {*} serverValue - Server value
   * @returns {boolean} True if there's a conflict
   */
  hasConflict(localValue, serverValue) {
    // Simple conflict detection
    // In a real implementation, this would be more sophisticated
    return localValue !== serverValue && 
           localValue !== undefined && 
           serverValue !== undefined;
  }

  /**
   * Detect conflicts between local and server data
   * @param {Object} localData - Local data
   * @param {Object} serverData - Server data
   * @returns {Array} Array of conflict descriptions
   */
  detectConflicts(localData, serverData) {
    const conflicts = [];
    const allKeys = new Set([...Object.keys(localData), ...Object.keys(serverData)]);

    allKeys.forEach(key => {
      if (this.hasConflict(localData[key], serverData[key])) {
        conflicts.push({
          field: key,
          localValue: localData[key],
          serverValue: serverData[key],
          type: this.getConflictType(localData[key], serverData[key])
        });
      }
    });

    return conflicts;
  }

  /**
   * Get conflict type
   * @param {*} localValue - Local value
   * @param {*} serverValue - Server value
   * @returns {string} Conflict type
   */
  getConflictType(localValue, serverValue) {
    if (localValue === null && serverValue !== null) return 'null-vs-value';
    if (localValue !== null && serverValue === null) return 'value-vs-null';
    if (typeof localValue === 'object' && typeof serverValue === 'object') return 'object';
    return 'value';
  }

  /**
   * Get recommended strategy for data type
   * @param {string} dataType - Type of data
   * @returns {string} Recommended strategy
   */
  getRecommendedStrategy(dataType) {
    const recommendations = {
      'appointments': 'last-write-wins',
      'history': 'server-wins',
      'clients': 'merge',
      'settings': 'client-wins',
      'default': 'last-write-wins'
    };

    return recommendations[dataType] || recommendations.default;
  }

  /**
   * Validate resolution result
   * @param {Object} resolvedData - Resolved data
   * @param {Object} originalLocal - Original local data
   * @param {Object} originalServer - Original server data
   * @returns {boolean} True if resolution is valid
   */
  validateResolution(resolvedData, originalLocal, originalServer) {
    // Basic validation - resolved data should not be empty
    if (!resolvedData || Object.keys(resolvedData).length === 0) {
      return false;
    }

    // Check if resolved data has required fields
    const requiredFields = ['id', 'updatedAt'];
    const hasRequiredFields = requiredFields.every(field => 
      resolvedData.hasOwnProperty(field)
    );

    return hasRequiredFields;
  }
}

export default ConflictResolver; 