/**
 * Timeline Optimization Test
 * 
 * Test to demonstrate the timeline data optimization functionality
 * Uses resourceId as primary key and keeps data field intact
 */

import dataSyncManager from '../../design-patterns/data-sync/index.js';

export class TimelineOptimizationTest {
  constructor() {
    this.results = {
      before: null,
      after: null,
      optimization: null,
      errors: []
    };
  }

  /**
   * Run the timeline optimization test
   */
  async runTest() {
    try {
      console.log('🧪 Starting Timeline Optimization Test...');
      
      // Wait for DataSyncManager to be initialized
      await dataSyncManager.waitForInitialization();
      
      // Set business type
      dataSyncManager.setBusinessType('dental');
      
      // Step 1: Get current timeline data structure
      console.log('📊 Step 1: Analyzing current timeline data structure...');
      const currentData = await dataSyncManager.getData('timeline');
      
      this.results.before = {
        count: Array.isArray(currentData) ? currentData.length : 0,
        sampleItem: currentData[0] || null,
        structure: this.analyzeDataStructure(currentData)
      };
      
      console.log('Current timeline data structure:', this.results.before);
      
      // Step 2: Trigger re-optimization
      console.log('🔄 Step 2: Triggering timeline data re-optimization...');
      const optimizedCount = await dataSyncManager.reoptimizeTimelineData();
      
      this.results.optimization = {
        optimizedCount,
        success: optimizedCount > 0
      };
      
      console.log(`Optimization completed: ${optimizedCount} records optimized`);
      
      // Step 3: Get optimized timeline data structure
      console.log('📊 Step 3: Analyzing optimized timeline data structure...');
      const optimizedData = await dataSyncManager.getData('timeline');
      
      this.results.after = {
        count: Array.isArray(optimizedData) ? optimizedData.length : 0,
        sampleItem: optimizedData[0] || null,
        structure: this.analyzeDataStructure(optimizedData)
      };
      
      console.log('Optimized timeline data structure:', this.results.after);
      
      // Step 4: Compare results
      console.log('📈 Step 4: Comparing before and after...');
      this.compareResults();
      
      console.log('✅ Timeline Optimization Test completed successfully');
      return this.results;
      
    } catch (error) {
      console.error('❌ Timeline Optimization Test failed:', error);
      this.results.errors.push({
        step: 'unknown',
        error: error.message
      });
      return this.results;
    }
  }

  /**
   * Analyze data structure
   */
  analyzeDataStructure(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { type: 'empty', size: 0 };
    }

    const sampleItem = data[0];
    const keys = Object.keys(sampleItem);
    
    return {
      type: 'array',
      size: data.length,
      keys: keys,
      hasData: !!(sampleItem.data && typeof sampleItem.data === 'object'),
      dataKeys: sampleItem.data ? Object.keys(sampleItem.data) : [],
      essentialFields: {
        hasId: !!sampleItem.id,
        hasResourceId: !!sampleItem.resourceId,
        hasBusinessId: !!sampleItem.businessId,
        hasLocationId: !!sampleItem.locationId,
        hasData: !!sampleItem.data
      },
      keyStructure: {
        idIsResourceId: sampleItem.id === sampleItem.resourceId,
        hasOriginalId: sampleItem.id !== sampleItem.resourceId
      }
    };
  }

  /**
   * Compare before and after results
   */
  compareResults() {
    const before = this.results.before;
    const after = this.results.after;
    const optimization = this.results.optimization;

    console.log('📊 Comparison Results:');
    console.log(`- Records count: ${before.count} → ${after.count} (${optimization.optimizedCount} optimized)`);
    console.log(`- Data structure: ${before.structure.type} → ${after.structure.type}`);
    console.log(`- Keys before: ${before.structure.keys.length} keys`);
    console.log(`- Keys after: ${after.structure.keys.length} keys`);
    console.log(`- Has data field: ${before.structure.hasData} → ${after.structure.hasData}`);
    console.log(`- ID is ResourceId: ${after.structure.keyStructure.idIsResourceId}`);
    
    if (before.sampleItem && after.sampleItem) {
      const beforeSize = JSON.stringify(before.sampleItem).length;
      const afterSize = JSON.stringify(after.sampleItem).length;
      const sizeReduction = ((beforeSize - afterSize) / beforeSize * 100).toFixed(2);
      
      console.log(`- Sample item size: ${beforeSize} bytes → ${afterSize} bytes (${sizeReduction}% reduction)`);
    }
  }

  /**
   * Get test results
   */
  getResults() {
    return this.results;
  }
}

/**
 * Run the timeline optimization test
 */
export async function runTimelineOptimizationTest() {
  const test = new TimelineOptimizationTest();
  return await test.runTest();
}

// Export for direct usage
export default TimelineOptimizationTest;
