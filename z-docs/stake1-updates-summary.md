# Stake_1 Updates Summary

**Date**: January 2025  
**Purpose**: Update logic so stake_1 is never 0 and fix related calculations

---

## 🎯 Changes Made

### 1. **Calculations Logic** (`lib/betting/calculations.ts`)

**Updated `calculateBetOutcomes` function:**
- **Before**: `stake1 = isBonus ? 0 : stake` (stake_1 was 0 for bonus bets)
- **After**: `stake1 = stake` (stake_1 is always the original stake, never 0)

**Updated outlay calculation:**
- **Before**: `outlay = stake1 + stake2` (simple addition)
- **After**: `outlay = (stake1 * (isBonus ? 0 : 1)) + stake2` (new formula)

**Added `calculateProfitActual` function:**
- New function to calculate actual profit for bet logs
- Uses the same logic as `calculateBetOutcomes` but specifically for profit_actual
- Handles both bonus and turnover bet types correctly

### 2. **Bet Logging** (`components/dashboard/shared/bet-logging-modal.tsx`)

**Updated bet logging to ensure non-zero stake_1:**
- **Before**: Used `stake1Display` which could be 0 for bonus bets
- **After**: Always uses `userStake` for stake_1 (never 0)

**Added profit_actual calculation:**
- Now calculates and includes `profit_actual` when logging bets
- Uses the new `calculateProfitActual` function
- Ensures accurate profit tracking from the start

### 3. **Bet Card Display** (`components/dashboard/shared/bet-card.tsx`)

**Updated stake_1 display:**
- **Before**: Used `calculations.stake1` which could be 0
- **After**: Always shows the actual stake amount (`stake`)

**Updated outlay calculation in fallback:**
- **Before**: `calculatedStake1 + calculatedStake2`
- **After**: `calculatedStake1 * (betType === "bonus" ? 0 : 1) + calculatedStake2`

### 4. **API Updates** (`app/api/bets/[id]/route.ts`)

**Added PATCH method:**
- New endpoint to update bet logs
- Specifically for updating `profit_actual` values
- Includes proper authentication and authorization
- Logs user actions for audit trail

### 5. **Bet Logs Hook** (`hooks/use-bet-logs.ts`)

**Added `updateBetLog` function:**
- New function to update bet logs via API
- Supports updating any bet log fields, especially `profit_actual`

**Updated `useBetLogs` hook:**
- Added `updateBetLogInList` function
- Provides optimistic updates for better UX
- Maintains data consistency

---

## 🔧 Technical Details

### Outlay Formula
The new outlay calculation follows the formula:
```
outlay = (stake_1 * [bool: if bonus_type="bonus" then 0 else 1] + stake_2)
```

**Examples:**
- **Bonus bet**: `outlay = (100 * 0) + 175 = $175` (only stake_2)
- **Turnover bet**: `outlay = (100 * 1) + 108 = $208` (stake_1 + stake_2)

### Stake_1 Behavior
- **Bonus bets**: stake_1 is stored as the actual stake amount (e.g., $100) but outlay calculation treats it as 0
- **Turnover bets**: stake_1 is stored and used as the actual stake amount in all calculations

### Profit_actual Calculation
The new `calculateProfitActual` function:
1. Applies Betfair scalars if applicable
2. Calculates payouts using the correct stake_1 values
3. Uses the new outlay formula
4. Returns the actual profit: `totalPayout - outlay`

---

## ✅ Testing

Created and ran comprehensive tests (`test/test-stake1-updates.ts`):

**Test Results:**
- ✅ Bonus bet: stake_1 = $100 (not 0)
- ✅ Turnover bet: stake_1 = $100 (full amount)
- ✅ Outlay calculations match new formula
- ✅ Profit_actual calculations work correctly
- ✅ All calculations are consistent

---

## 🎯 Impact Areas

### 1. **Bet Log Database**
- All new bet logs will have non-zero stake_1 values
- profit_actual will be calculated and stored correctly
- Historical data may need migration if stake_1 values are 0

### 2. **UI Display**
- Bet cards will show correct stake_1 amounts
- Outlay calculations will be accurate
- Profit displays will be consistent

### 3. **Calculations**
- All profit calculations use the new logic
- Outlay calculations follow the new formula
- Bonus vs turnover bet handling is consistent

---

## 🚀 Migration Notes

### For Existing Data
If there are existing bet logs with stake_1 = 0 for bonus bets:
1. These should be updated to reflect the actual stake amounts
2. profit_actual values should be recalculated using the new logic
3. Consider running a data migration script

### For New Bets
- All new bets will automatically use the correct logic
- No additional configuration needed
- profit_actual will be calculated and stored from the start

---

## 📋 Summary

The changes ensure that:
1. **stake_1 is never 0** - Always stores the actual stake amount
2. **Outlay calculation is correct** - Uses the new formula for bonus vs turnover bets
3. **profit_actual is accurate** - Calculated using the correct stake_1 values
4. **UI displays are consistent** - All components show the right values
5. **API supports updates** - Can update profit_actual and other fields

All changes maintain backward compatibility while fixing the core calculation issues. 