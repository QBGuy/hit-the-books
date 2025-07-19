# 📘 Product Requirements Document (PRD v2.0)

**Project**: Hit the Books  
**Goal**: A web application that identifies profitable sports betting opportunities and allows logged-in users to track and log their bets.

---

## 🎯 Product Overview

Hit the Books is a sports betting arbitrage application that:
- Identifies profitable betting opportunities across multiple bookmakers
- Provides real-time odds comparison and profit calculations
- Allows authenticated users to log and track their betting activities
- Offers filtering and control mechanisms for different bet types

---

## 🔧 Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | Next.js 15 App Router + TypeScript |
| Styling        | TailwindCSS + shadcn/ui            |
| Icons          | lucide-react                       |
| Authentication | Supabase Auth (Google login only)  |
| Database       | Supabase (PostgreSQL)              |
| State Mgmt     | React state (useState/useEffect)   |
| Package Mgmt   | pnpm                               |

---

## 🔐 Authentication & User Management

### Authentication Flow
- **Provider**: Google OAuth via Supabase Auth
- **Landing Page**: Default entry point with Google login
- **Access Control**: Only authenticated users can access main dashboard
- **User Identification**: All logged actions tied to user_id from Supabase Auth

### User Actions Tracking
All user interactions are logged in the `user_actions` table including:
- Login/logout events
- Bet logging activities
- Dashboard interactions

---

## 🗃️ Database Schema (Supabase)

### `opportunities` Table
*Populated by bet_recoveries.js*

| Column          | Type      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| sport           | text      | e.g. "NRL", "AFL", "NBA"             |
| bookie_1        | text      | Primary bookmaker                    |
| odds_1          | decimal   | Odds for team_1 at bookie_1          |
| team_1          | text      | Team/player name                     |
| bookie_2        | text      | Secondary bookmaker                  |
| odds_2          | decimal   | Odds for team_2 at bookie_2          |
| team_2          | text      | Opposing team/player                 |
| stake_2         | decimal   | Required stake for bookie_2 (assuming $1 on bookie_1) |
| profit          | decimal   | Expected profit (assuming $1 bet)    |
| betfair_scalar  | decimal   | Used in effective odds calculations  |
| bookie          | text      | Primary bookie for filtering         |
| bet_type        | text      | "turnover" (low-hold) or "bonus"     |
| timestamp       | timestamp | ISO format, used for freshness check |

### `bet_log` Table
*User-specific bet tracking*

| Column         | Type      | Notes                                |
| -------------- | --------- | ------------------------------------ |
| user_id        | uuid      | From Supabase Auth                   |
| username       | text      | From auth profile                    |
| sport          | text      | Sport category                       |
| bookie_1       | text      | Primary bookmaker                    |
| odds_1         | decimal   | Actual odds used                     |
| team_1         | text      | Team/player bet on                   |
| stake_1        | decimal   | Actual stake placed                  |
| bookie_2       | text      | Secondary bookmaker                  |
| odds_2         | decimal   | Counter-bet odds                     |
| team_2         | text      | Counter-bet team/player              |
| stake_2        | decimal   | Counter-bet stake                    |
| profit         | decimal   | Expected profit                      |
| profit_actual  | decimal   | Actual dollar profit (post-settlement) |
| betfair_scalar | decimal   | Effective odds scalar                |
| bookie         | text      | Primary bookie for filtering         |
| bet_type       | text      | "turnover" or "bonus"                |
| timestamp      | timestamp | When bet was logged                  |

### `user_actions` Table
*Activity and audit logging*

| Column         | Type      | Notes                                |
| -------------- | --------- | ------------------------------------ |
| id             | serial    | Primary key                          |
| user_id        | uuid      | References auth.users(id)            |
| username       | text      | User display name                    |
| email          | text      | User email                           |
| action_type    | text      | "login", "logout", "bet_logged", etc |
| action_details | jsonb     | Additional context data              |
| timestamp      | timestamp | Auto-generated                       |

---

## 🎨 User Interface Structure

### Landing Page (`/reference/ui/landing-page.tsx`)
- Default entry point
- Google Auth integration
- Clean, welcoming design
- Redirect to dashboard after authentication

### Main Dashboard (`/reference/ui/sports-betting-dashboard`)
Three-tab interface with consistent styling:

#### 1. Controls Tab
- **Bet Type Filter**: Toggle between "Bonus" and "Turnover" (low-hold)
- **Stake Input**: Set stake amount for bookie_1 calculations
- **Bookie Filter**: Filter opportunities by primary bookmaker
- **Refresh Button**: Force refresh of opportunities data

#### 2. Opportunities Tab
- **Data Source**: `opportunities` table from Supabase
- **Filtering**: Applied based on Controls tab settings
- **Calculations**: Real-time profit/stake calculations using bet-calculations.ts
- **Actions**: "Log Bet" button for each opportunity
- **Freshness**: Visual indicators for data age

#### 3. Logs Tab
- **Data Source**: User-specific `bet_log` table
- **Display Format**: 
  - Bet: "team_1 vs team_2"
  - Date: formatted timestamp
  - Bookie: bookie_1
  - Team: team_1
  - Odds: odds_1
  - Stake: stake_1
  - Payout: calculated payout
  - Recovery: profit amount
  - Type: bet_type

---

## ⚙️ Core Features & Logic

### Opportunity Refresh System
- **Freshness Threshold**: Data older than configurable time (default: 60 seconds)
- **Refresh Triggers**: Manual button click or automatic check
- **Data Flow**: bet_recoveries.js → Supabase → UI calculations

### Bet Calculations (`/reference/bet-opportunities/bet-calculations.ts`)
- Calculate required stakes for both bookmakers
- Determine profit margins and payouts
- Handle different bet types (bonus vs turnover)
- Apply betfair_scalar for effective odds

### User Experience
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live profit calculations as user adjusts stake
- **Clean UI**: Reusable card components for bet display
- **Consistent Theming**: shadcn/ui components throughout

---

## 🔄 Data Flow

1. **Odds Collection**: bet_recoveries.js fetches odds and posts to `opportunities`
2. **User Access**: Authenticated users view filtered opportunities
3. **Calculations**: bet-calculations.ts processes raw data for UI display
4. **Bet Logging**: Users log bets to `bet_log` table
5. **Activity Tracking**: All actions recorded in `user_actions`

---

## 📱 Component Architecture

### Reusable Components
- **BetCard**: Standardized bet display for both Opportunities and Logs
- **Controls Panel**: Centralized filtering and configuration
- **RefreshButton**: Consistent refresh functionality
- **TabNavigation**: Clean tab switching interface

### Code Organization
- Split monolithic dashboard into focused components
- Separate concerns (Controls, Opportunities, Logs)
- Shared utilities and calculations
- Consistent prop interfaces

---

## 🚀 Success Metrics

- **User Engagement**: Daily active users, session duration
- **Bet Tracking**: Number of logged bets, profit tracking accuracy
- **System Performance**: Data freshness, calculation speed
- **User Experience**: Low bounce rate, high return usage
