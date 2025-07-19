# 🎯 Bet Logging Implementation

**Project**: Hit the Books  
**Feature**: Complete Bet Logging System  
**Date**: January 2025

---

## 📋 Overview

This document outlines the complete implementation of the bet logging system for Hit the Books, including logging bets, retrieving logged bets from Supabase, and adding user actions for logging bets and refreshing the API.

---

## 🏗️ Architecture

### Data Flow
```
User Action → Bet Logging Modal → API Call → Supabase → User Actions Log
     ↓
Bet Logs Hook → Dashboard → Real-time Updates
```

### Key Components
1. **Bet Logging Modal** - User interface for logging bets
2. **Bet Logs Hook** - Data management for bet logs
3. **User Actions Hook** - Audit trail logging
4. **API Routes** - Server-side bet logging endpoints
5. **Dashboard Integration** - Real-time bet log display

---

## 🔧 Implementation Details

### 1. Bet Logging Hook (`hooks/use-bet-logs.ts`)

**Purpose**: Manages bet logs data and provides CRUD operations

**Key Features**:
- Fetch bet logs with filtering
- Log new bets to Supabase
- Optimistic updates for better UX
- Error handling and loading states
- Real-time data synchronization

**API Functions**:
```typescript
// Fetch bet logs with filters
fetchBetLogs(filters: BetLogFilters): Promise<BetLogResponse>

// Log a new bet
logBet(betData: BetLogData): Promise<{ message: string; bet: BetLog }>

// Hook for managing bet logs
useBetLogs(initialFilters: BetLogFilters)
```

**Usage Example**:
```typescript
const {
  betLogs,
  isLoading,
  error,
  total,
  addBetLog,
  refresh
} = useBetLogs({
  betType: 'bonus',
  bookie: 'sportsbet',
  limit: 50
})
```

### 2. User Actions Hook (`hooks/use-user-actions.ts`)

**Purpose**: Logs all user interactions for analytics and audit trails

**Key Features**:
- Automatic action logging to Supabase
- Multiple action types (bet_logged, filter_changed, etc.)
- Error handling with graceful fallbacks
- Comprehensive user activity tracking

**Action Types**:
- `dashboard_viewed` - When user views dashboard
- `filter_changed` - When user changes filters
- `opportunities_refresh` - When user refreshes data
- `bet_logged` - When user logs a bet
- `error_occurred` - When errors happen
- `page_viewed` - When user views pages
- `user_login` - When user logs in
- `user_logout` - When user logs out

**Usage Example**:
```typescript
const { logBetLogged, logFilterChanged, logError } = useUserActions()

// Log a bet
logBetLogged({
  sport: 'NRL',
  bet_type: 'bonus',
  profit: 15.50,
  bookie_1: 'Sportsbet',
  bookie_2: 'Betfair'
})
```

### 3. Bet Logging Modal (`components/dashboard/shared/bet-logging-modal.tsx`)

**Purpose**: User interface for confirming and logging bets

**Key Features**:
- Displays bet summary with calculated stakes
- Real-time profit calculations
- Error handling and success states
- Integration with user actions logging
- Optimistic UI updates

**Props Interface**:
```typescript
interface BetLoggingModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: OpportunityData
  userStake: number
  calculatedStake1?: number
  calculatedStake2?: number
  onSuccess: () => void
}
```

**User Flow**:
1. User clicks "Log Bet" on opportunity
2. Modal opens with bet summary
3. User confirms bet details
4. API call logs bet to Supabase
5. User action is logged
6. Success state shown
7. Modal closes and logs refresh

### 4. Bet Log List (`components/dashboard/logs/bet-log-list.tsx`)

**Purpose**: Displays user's logged bets with real data

**Key Features**:
- Real-time bet log display
- Loading and error states
- Empty state handling
- Integration with BetCard component
- Automatic data refresh

**Data Integration**:
- Uses `useBetLogs` hook for data
- Displays actual bet log data from Supabase
- Shows profit_actual vs expected profit
- Handles different bet types (bonus/turnover)

### 5. Dashboard Integration (`components/dashboard/dashboard-layout.tsx`)

**Purpose**: Integrates all bet logging functionality into main dashboard

**Key Features**:
- Real-time bet logs display
- Automatic refresh on bet logging
- Error handling and logging
- User action tracking
- Seamless integration with opportunities

**Integration Points**:
- Uses `useBetLogs` for bet log data
- Uses `useUserActions` for activity tracking
- Passes callbacks to child components
- Handles bet logged events

---

## 🗄️ Database Schema

### Bet Log Table (`bet_log`)
```sql
CREATE TABLE bet_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  sport TEXT NOT NULL,
  bookie_1 TEXT NOT NULL,
  odds_1 DECIMAL NOT NULL,
  team_1 TEXT NOT NULL,
  stake_1 DECIMAL NOT NULL,
  bookie_2 TEXT NOT NULL,
  odds_2 DECIMAL NOT NULL,
  team_2 TEXT NOT NULL,
  stake_2 DECIMAL NOT NULL,
  profit DECIMAL NOT NULL,
  profit_actual DECIMAL,
  betfair_scalar DECIMAL DEFAULT 1,
  bookie TEXT NOT NULL,
  bet_type TEXT NOT NULL CHECK (bet_type IN ('bonus', 'turnover')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Actions Table (`user_actions`)
```sql
CREATE TABLE user_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### POST `/api/bets`
**Purpose**: Log a new bet for the authenticated user

**Request Body**:
```typescript
{
  sport: string
  bookie_1: string
  odds_1: number
  team_1: string
  stake_1: number
  bookie_2: string
  odds_2: number
  team_2: string
  stake_2: number
  profit: number
  profit_actual?: number
  betfair_scalar?: number
  bookie: string
  bet_type: "bonus" | "turnover"
}
```

**Response**:
```typescript
{
  message: string
  bet: BetLog
}
```

### GET `/api/bets`
**Purpose**: Fetch user's bet logs with filtering

**Query Parameters**:
- `betType` - Filter by bet type (bonus/turnover)
- `bookie` - Filter by bookie
- `limit` - Number of records to return
- `offset` - Pagination offset

**Response**:
```typescript
{
  betLogs: BetLog[]
  total: number
}
```

### POST `/api/user-actions`
**Purpose**: Log a user action for analytics

**Request Body**:
```typescript
{
  action_type: string
  action_details?: any
}
```

**Response**:
```typescript
{
  message: string
  action: UserAction
}
```

---

## 🧪 Testing

### Test Script (`test/test-bet-logging.ts`)
**Purpose**: Verify bet logging functionality

**Test Coverage**:
1. **Bet Logs Fetching** - Verify API can fetch bet logs
2. **User Actions Fetching** - Verify user actions are logged
3. **Opportunities Data** - Verify opportunities are available
4. **Database Connectivity** - Verify all tables are accessible

**Running Tests**:
```bash
# Run the test script
node test/run-bet-logging-test.js

# Or run directly
npx tsx test/test-bet-logging.ts
```

---

## 🚀 Usage Examples

### Logging a Bet
```typescript
import { logBet } from '@/hooks/use-bet-logs'

const betData = {
  sport: 'NRL',
  bookie_1: 'Sportsbet',
  odds_1: 2.10,
  team_1: 'Storm',
  stake_1: 100,
  bookie_2: 'Betfair',
  odds_2: 2.05,
  team_2: 'Panthers',
  stake_2: 95.24,
  profit: 4.76,
  betfair_scalar: 1,
  bookie: 'sportsbet',
  bet_type: 'bonus'
}

const result = await logBet(betData)
console.log('Bet logged:', result.bet)
```

### Using the Bet Logs Hook
```typescript
import { useBetLogs } from '@/hooks/use-bet-logs'

function BetLogsComponent() {
  const {
    betLogs,
    isLoading,
    error,
    total,
    addBetLog,
    refresh
  } = useBetLogs({
    betType: 'bonus',
    limit: 20
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Bet Logs ({total})</h2>
      {betLogs.map(bet => (
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  )
}
```

### Logging User Actions
```typescript
import { useUserActions } from '@/hooks/use-user-actions'

function Dashboard() {
  const { logBetLogged, logFilterChanged } = useUserActions()

  const handleBetLogged = (betData) => {
    logBetLogged(betData)
  }

  const handleFilterChange = (filterType, value) => {
    logFilterChanged(filterType, value)
  }

  return (
    <div>
      {/* Dashboard content */}
    </div>
  )
}
```

---

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own bet logs
- User actions are scoped to authenticated user
- API endpoints require authentication

### Data Validation
- Required field validation on bet logging
- Bet type validation (bonus/turnover only)
- Numeric validation for odds and stakes
- Input sanitization

### Error Handling
- Graceful error handling in all components
- User-friendly error messages
- Fallback behavior for failed operations
- Comprehensive error logging

---

## 📊 Performance Considerations

### Optimistic Updates
- UI updates immediately on bet logging
- Background API calls for better UX
- Automatic rollback on errors

### Caching Strategy
- Bet logs cached in React state
- Automatic refresh on new bets
- Efficient filtering and pagination

### Database Optimization
- Indexed columns for fast queries
- Efficient RLS policies
- Optimized query patterns

---

## 🔄 Real-time Features

### Automatic Refresh
- Bet logs refresh when new bets are logged
- Real-time data age indicators
- Automatic stale data detection

### User Action Tracking
- All user interactions logged automatically
- Real-time analytics data
- Comprehensive audit trail

---

## 🎯 Future Enhancements

### Planned Features
1. **Bet Editing** - Allow users to edit logged bets
2. **Bet Deletion** - Allow users to delete bets
3. **Export Functionality** - Export bet logs to CSV/PDF
4. **Advanced Filtering** - Date ranges, profit ranges
5. **Bulk Operations** - Bulk edit/delete bets
6. **Real-time Notifications** - WebSocket updates
7. **Mobile App** - React Native integration

### Performance Improvements
1. **Virtual Scrolling** - For large bet log lists
2. **Advanced Caching** - Redis integration
3. **Background Processing** - Queue-based bet logging
4. **Analytics Dashboard** - Advanced user analytics

---

## 📝 Conclusion

The bet logging system is now fully implemented and integrated into the Hit the Books application. Users can:

✅ **Log bets** from opportunities with full validation  
✅ **View their bet history** with real-time updates  
✅ **Track all user actions** for analytics  
✅ **Filter and search** their bet logs  
✅ **See real-time data** with automatic refresh  

The system is production-ready with comprehensive error handling, security features, and performance optimizations. 