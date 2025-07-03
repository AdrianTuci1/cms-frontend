/**
 * Test Runner for Timeline Nesting Fix
 * 
 * Run this file to test that timeline data is not nested
 */

import TimelineNestingTest from './timeline-nesting-test.js';

// Run the test
async function runTest() {
  console.log('🔧 Testing Timeline Nesting Fix...\n');
  
  const test = new TimelineNestingTest();
  const results = await test.runAllTests();
  
  // Check if all tests passed
  const allPassed = results.dental?.success && 
                   results.gym?.success && 
                   results.hotel?.success;
  
  const noNesting = !results.dental?.standardizedStructure?.hasNesting?.hasNesting &&
                   !results.gym?.standardizedStructure?.hasNesting?.hasNesting &&
                   !results.hotel?.standardizedStructure?.hasNesting?.hasNesting;
  
  if (allPassed && noNesting) {
    console.log('\n🎉 SUCCESS: Timeline nesting issue is FIXED!');
    console.log('✅ All business types return flat arrays');
    console.log('✅ No nested data structures detected');
  } else {
    console.log('\n❌ FAILURE: Timeline nesting issue still exists');
    if (!allPassed) {
      console.log('❌ Some tests failed');
    }
    if (!noNesting) {
      console.log('❌ Nested data detected');
    }
  }
  
  return { allPassed, noNesting, results };
}

// Export for use in other files
export { runTest };

// Run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runTimelineNestingTest = runTest;
} else {
  // Node.js environment
  runTest().catch(console.error);
} 