/**
 * Timestamp utilities to fix the 10-hour timezone issue
 * 
 * The problem: Database stores timestamps without 'Z' suffix, causing them to be
 * interpreted as local time instead of UTC, creating a 10-hour discrepancy.
 */

import moment from 'moment-timezone'

/**
 * Ensures a timestamp string has proper UTC format
 */
export function ensureUTCTimestamp(timestamp: string): string {
  // If it already ends with Z, return as is
  if (timestamp.endsWith('Z')) {
    return timestamp
  }
  
  // If it ends with +00:00, convert to Z format
  if (timestamp.endsWith('+00:00')) {
    return timestamp.replace('+00:00', 'Z')
  }
  
  // If it has no timezone info, add Z
  if (!timestamp.includes('+') && !timestamp.includes('Z')) {
    return timestamp + 'Z'
  }
  
  return timestamp
}

/**
 * Converts a database timestamp to a proper UTC Date object
 */
export function parseDatabaseTimestamp(dbTimestamp: string): Date {
  const utcTimestamp = ensureUTCTimestamp(dbTimestamp)
  return new Date(utcTimestamp)
}

/**
 * Calculates the age of data in seconds, handling the timezone issue
 */
export function calculateDataAge(dbTimestamp: string): number {
  const utcTimestamp = ensureUTCTimestamp(dbTimestamp)
  const dbDate = new Date(utcTimestamp)
  const now = new Date()
  
  return Math.floor((now.getTime() - dbDate.getTime()) / 1000)
}

/**
 * Checks if data is fresh (within threshold)
 */
export function isDataFresh(dbTimestamp: string, thresholdSeconds: number = 60): boolean {
  const age = calculateDataAge(dbTimestamp)
  return age <= thresholdSeconds
}

/**
 * Formats a timestamp for display in Sydney timezone
 */
export function formatSydneyTime(timestamp: string): string {
  const utcTimestamp = ensureUTCTimestamp(timestamp)
  return moment(utcTimestamp).tz('Australia/Sydney').format('h:mm:ss A')
}

/**
 * Formats a timestamp for display in Sydney timezone (24-hour format)
 */
export function formatSydneyTime24(timestamp: string): string {
  const utcTimestamp = ensureUTCTimestamp(timestamp)
  return moment(utcTimestamp).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')
}

/**
 * Gets the current UTC timestamp for database storage
 */
export function getCurrentUTCTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Converts a local timestamp to UTC for database storage
 */
export function localToUTCTimestamp(localTimestamp: string): string {
  // If it's already a UTC timestamp, return as is
  if (localTimestamp.endsWith('Z')) {
    return localTimestamp
  }
  
  // Parse as local time and convert to UTC
  const localDate = new Date(localTimestamp)
  return localDate.toISOString()
}

/**
 * Utility to fix existing database timestamps
 */
export function fixDatabaseTimestamp(dbTimestamp: string): string {
  // If it already has Z suffix, return as is
  if (dbTimestamp.endsWith('Z')) {
    return dbTimestamp
  }
  
  // If it ends with +00:00, convert to Z format
  if (dbTimestamp.endsWith('+00:00')) {
    return dbTimestamp.replace('+00:00', 'Z')
  }
  
  // Add Z suffix to make it UTC
  return dbTimestamp + 'Z'
}

/**
 * Batch fix for multiple timestamps
 */
export function fixDatabaseTimestamps(timestamps: string[]): string[] {
  return timestamps.map(fixDatabaseTimestamp)
}

/**
 * Test function to verify timestamp handling
 */
export function testTimestampHandling(): void {
  console.log('🧪 Testing Timestamp Handling')
  console.log('=============================')
  
  // Test with timestamp without Z
  const testTimestamp = '2025-07-19T22:30:25.474'
  const fixedTimestamp = fixDatabaseTimestamp(testTimestamp)
  const age = calculateDataAge(testTimestamp)
  const isFresh = isDataFresh(testTimestamp)
  const sydneyTime = formatSydneyTime(testTimestamp)
  
  console.log(`Original: ${testTimestamp}`)
  console.log(`Fixed: ${fixedTimestamp}`)
  console.log(`Age: ${age} seconds`)
  console.log(`Is fresh: ${isFresh}`)
  console.log(`Sydney time: ${sydneyTime}`)
  
  // Test with timestamp that already has Z
  const testTimestampWithZ = '2025-07-19T22:30:25.474Z'
  const ageWithZ = calculateDataAge(testTimestampWithZ)
  
  console.log(`\nWith Z suffix: ${testTimestampWithZ}`)
  console.log(`Age: ${ageWithZ} seconds`)
  console.log(`Age difference: ${Math.abs(age - ageWithZ)} seconds`)
  
  if (Math.abs(age - ageWithZ) > 3600) {
    console.log('⚠️  Large age difference detected - timezone issue confirmed')
  } else {
    console.log('✅ Timestamps handled correctly')
  }
} 