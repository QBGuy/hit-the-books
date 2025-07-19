#!/usr/bin/env node

const { testBetLogging } = require('./test-bet-logging.ts')

console.log('🚀 Running Bet Logging Test...')
console.log('==============================')

testBetLogging()
  .then(() => {
    console.log('\n✅ Test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }) 