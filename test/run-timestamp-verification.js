/**
 * Test runner script for timestamp verification
 * 
 * Run with: node test/run-timestamp-verification.js
 */

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Running Database Timestamp Verification Test')
console.log('=================================================')

// Run the TypeScript test using ts-node
const testProcess = spawn('npx', ['ts-node', '--esm', 'verify-database-timestamps.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
})

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Test completed successfully!')
  } else {
    console.log(`\n❌ Test failed with exit code ${code}`)
    process.exit(code)
  }
})

testProcess.on('error', (error) => {
  console.error('❌ Failed to start test:', error)
  process.exit(1)
})
