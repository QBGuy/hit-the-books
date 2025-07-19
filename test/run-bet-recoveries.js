#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🔄 Running Bet Recoveries to Refresh Opportunities Table')
console.log('========================================================')

try {
  // Create a simple TypeScript script to run the process
  const scriptContent = `
import { processOdds } from '../lib/betting/bet_recoveries_standalone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function runBetRecoveries() {
  console.log('🚀 Starting bet recoveries process...')
  
  try {
    const results = await processOdds(['oddsapi'])
    console.log(\`✅ Successfully processed \${results.length} opportunities\`)
    console.log('🕐 Timestamp of latest data:', results[0]?.timestamp || 'N/A')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

runBetRecoveries()
`

  // Write the script to a temporary file
  const fs = require('fs')
  const tempScriptPath = path.join(__dirname, 'temp-run-bet-recoveries.ts')
  fs.writeFileSync(tempScriptPath, scriptContent)

  // Run the script
  execSync(`npx tsx ${tempScriptPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })

  // Clean up
  fs.unlinkSync(tempScriptPath)
  
  console.log('\n✅ Bet recoveries completed successfully!')
  
} catch (error) {
  console.error('\n❌ Bet recoveries failed:', error.message)
  process.exit(1)
} 