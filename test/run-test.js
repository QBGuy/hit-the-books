#!/usr/bin/env node

/**
 * Simple runner for the bet recoveries test
 * Usage: node test/run-test.js
 */

const { execSync } = require('child_process');
const path = require('path');

async function runTest() {
  console.log('🚀 Starting Bet Recoveries Test Suite...\n');
  
  try {
    // Run the TypeScript test using tsx
    const command = 'npx tsx test/test-bet-recoveries.ts';
    console.log(`Executing: ${command}\n`);
    
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n✅ Test execution completed!');
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runTest(); 