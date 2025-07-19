# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development
- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Next.js linting

### Testing
- `tsx test/simple-test.ts` - Run simple database connectivity test
- `tsx test/test-bet-recoveries.ts` - Test betting calculation logic
- `tsx test/check-fresh-data.ts` - Test data freshness checks
- `node test/run-bet-recoveries.js` - Run bet recovery processing

### Database
- SQL setup script: `scripts/setup-database.sql`
- Test database connectivity: `tsx test/debug-database.ts`

## Architecture Overview

**Hit the Books** is a sports betting arbitrage application built with Next.js 15, TypeScript, and Supabase. The app identifies profitable betting opportunities and allows authenticated users to track their bets.

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Package Manager**: pnpm

### Core Structure

#### App Router (`app/`)
- `(auth)/` - Authentication routes (login, callback, errors)
- `(dashboard)/` - Protected dashboard area
- `api/` - API endpoints for opportunities, bets, user actions

#### Components (`components/`)
- `dashboard/` - Main dashboard components with tabs and controls
- `ui/` - Complete shadcn/ui component library (40+ components)
- `auth/` - Authentication provider and components

#### Business Logic (`lib/`)
- `betting/` - Core betting calculations and opportunity processing
  - `calculations.ts` - Bet profit calculations with bonus/turnover support
  - `bet_recoveries.ts` - Main opportunity data processing
  - `opportunities.ts` - Opportunity fetching logic
- `supabase/` - Database client configuration (client/server separation)

### Key Data Models

#### Opportunities Table
- Betting opportunities with odds, stakes, and profit calculations
- Includes Betfair scalar adjustments and bet type classification
- 60-second freshness threshold for data staleness

#### Bet Log Table
- User-specific logged bets with RLS (Row Level Security)
- Tracks stakes, odds, payouts, and profit per user

#### User Actions Table
- Audit trail of all user interactions for analytics

### Authentication Flow
- Google OAuth via Supabase Auth
- JWT tokens for API access
- Row-level security for user data isolation

### Data Freshness System
Data is considered "fresh" for 60 seconds. The `data-freshness-indicator.tsx` component shows:
- Age in seconds/minutes/hours
- Sydney timezone display
- Refresh status (Fresh/Stale/Refreshing)

### Betting Calculations
The `calculations.ts` module handles:
- Bonus vs turnover bet types
- Betfair exchange scalar adjustments
- Profit percentage calculations
- Currency formatting (AUD)

### Component Patterns

#### Reusable Components
- `bet-card.tsx` - Unified bet display for both opportunities and logs
- `data-freshness-indicator.tsx` - Real-time data age monitoring
- `bet-logging-modal.tsx` - Centralized bet logging with validation

#### State Management
- React hooks (useState/useEffect) for local state
- Custom hooks: `use-opportunities.ts`, `use-user-actions.ts`
- Context providers for auth and theming

### Environment Variables
Key variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key
- `ODDS_API_KEY` - External odds API access
- `GOOGLE_CLIENT_ID/SECRET` - OAuth credentials

### Performance Considerations
- Automatic code splitting with Next.js
- Strategic database indexing on filter columns
- Efficient Supabase queries with proper filtering
- Data caching with 60-second refresh threshold

### Development Workflow
1. Use existing component patterns from `components/ui/` and `components/dashboard/`
2. Follow TypeScript strict mode conventions
3. Test betting calculations thoroughly before deployment
4. Monitor data freshness for real-time accuracy
5. Ensure mobile responsiveness with Tailwind classes

### Testing Strategy
- Unit tests for betting calculations
- Database connectivity tests
- Data freshness validation
- Bet recovery processing verification