/**
 * Simple timestamp timezone test runner
 * 
 * This script can be run with: npm run test:timestamp
 * Or directly with: node test/run-timestamp-test.js
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Running Timestamp Timezone Test')
console.log('===================================')

try {
  // Run the TypeScript test
  const testPath = path.join(__dirname, 'test-timestamp-timezone.ts')
  
  // Use ts-node to run the TypeScript test
  execSync(`npx ts-node ${testPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })
  
  console.log('\n✅ Test completed successfully!')
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message)
  process.exit(1)
}
