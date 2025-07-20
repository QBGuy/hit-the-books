const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Duplicate Bet Logging Test');
console.log('=====================================');

try {
  // Run the TypeScript test file
  const testPath = path.join(__dirname, 'test-duplicate-bet-logging.ts');
  execSync(`npx tsx ${testPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Test completed successfully');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
} 