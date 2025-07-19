#!/usr/bin/env node

/**
 * Simple script to run bet_recoveries and display results
 * Usage: node test/run-bet-recoveries.js
 */

const { execSync } = require('child_process');

async function runBetRecoveries() {
  console.log('🚀 Running Bet Recoveries...\n');
  
  try {
    // Run the bet recoveries directly
    const command = 'npx tsx -e "import { processOdds } from \'./lib/betting/bet_recoveries_standalone\'; import \'dotenv/config\'; processOdds().then(results => { console.log(`✅ Success! Found ${results.length} opportunities`); process.exit(0); }).catch(err => { console.error(`❌ Error:`, err.message); process.exit(1); })"';
    
    console.log('Starting bet recoveries processing...\n');
    
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
  } catch (error) {
    console.error('\n❌ Bet recoveries failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runBetRecoveries(); 