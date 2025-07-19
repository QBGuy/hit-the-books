# 📋 Development Tasks

**Project**: Hit the Books  
**Phase**: Initial Development  
**Last Updated**: December 2024

---

## 🚀 Phase 1: Foundation Setup (Priority: Critical)

### 1.1 Project Infrastructure
- [x] **Set up Next.js 15 project structure**
  - Initialize with TypeScript and App Router
  - Configure TailwindCSS and shadcn/ui
  - Set up pnpm as package manager
  - Configure ESLint and Prettier

- [x] **Supabase Configuration**
  - Configure Google OAuth in Supabase Auth
  - Create development and production instances

- [x] **Database Schema Creation**
  - Create `opportunities` table with proper schema (or check exists)
  - Create `bet_log` table with user relationships (or check exists)
  - Create `user_actions` table for audit trail (or check exists)
  - [ ] Set up Row-Level Security (RLS) policies
  - [ ] Create appropriate indexes for performance

### 1.2 Authentication System
- [x] **Implement Google Auth**
  - Set up Supabase Auth client
  - Create auth context and hooks
  - Implement login/logout functionality
  - [ ] Add route protection middleware

- [ ] **User Session Management**
  - [ ] Handle user state persistence
  - [x] Implement auth callbacks
  - [ ] Set up user profile management
  - [ ] Add session timeout handling

---

## 🎨 Phase 2: Core UI Components (Priority: High)

### 2.1 Landing Page
- [x] **Create Landing Page Component**
  - Design clean, welcoming interface
  - Integrate Google login button
  - Add project branding and logo
  - Implement responsive design
  - Add loading states and error handling

### 2.2 Dashboard Layout
- [x] **Main Dashboard Structure**
  - Create authenticated layout wrapper
  - Implement three-tab navigation (Controls, Opportunities, Logs)
  - Add consistent header with user info and logout
  - Set up responsive grid system
  - Add theme provider integration

### 2.3 Reusable Components
- [x] **BetCard Component**
  - Design unified bet display card
  - Include all necessary bet information
  - Add action buttons (Log Bet, etc.)
  - Implement hover states and animations
  - Ensure accessibility compliance

- [x] **Filter Controls**
  - Bet type toggle (Bonus/Turnover)
  - Stake input with validation
  - Bookie dropdown filter
  - Reset filters functionality

---

## 🔧 Phase 3: Core Functionality (Priority: High)

### 3.1 Opportunities System
- [x] **Opportunities Data Integration**
  - Connect to Supabase `opportunities` table
  - Implement data fetching with proper error handling
  - [ ] Add loading states and empty states
  - [ ] Set up real-time subscriptions for updates

- [x] **Bet Calculations Logic**
  - Port `bet-calculations.ts` reference code
  - Implement stake calculations based on user input
  - Calculate profit margins and payouts
  - Handle different bet types (bonus vs turnover)
  - Add betfair_scalar calculations

### 3.2 Filtering and Controls
- [x] **Filter Implementation**
  - Apply bet type filtering to opportunities
  - Implement bookie filtering
  - Add stake-based calculations
  - Create filter state management
  - [ ] Add URL parameter persistence

### 3.3 Refresh Mechanism
- [ ] **Data Freshness System**
  - [ ] Implement 60-second freshness threshold
  - [x] Add manual refresh button
  - [ ] Show data age indicators
  - [ ] Handle stale data warnings
  - [ ] Implement refresh loading states

---

## 📊 Phase 4: Bet Logging System (Priority: High)

### 4.1 Bet Logging Functionality
- [ ] **Log Bet Feature**
  - [ ] Create bet logging form/modal
  - [ ] Validate user inputs
  - [ ] Save to `bet_log` table with user_id
  - [ ] Add success/error notifications
  - [ ] Update UI optimistically

### 4.2 Logs Display
- [x] **Logs Tab Implementation**
  - [x] Fetch user-specific bet logs
  - [x] Display in consistent BetCard format
  - [ ] Add sorting and filtering options
  - [ ] Implement pagination for large datasets
  - [ ] Add export functionality

### 4.3 User Actions Tracking
- [ ] **Audit Trail System**
  - [ ] Log all user actions to `user_actions` table
  - [ ] Track login/logout events
  - [ ] Record bet logging activities
  - [ ] Add performance metrics tracking

---

## 🎯 Phase 5: Data Integration (Priority: Medium)

### 5.1 Odds Data Pipeline
- [ ] **Integrate bet_recoveries.js**
  - [ ] Set up odds API integration
  - [ ] Schedule regular data updates
  - [ ] Handle API rate limiting
  - [ ] Add error handling and retries
  - [ ] Monitor data quality

### 5.2 External API Management
- [ ] **Odds API Configuration**
  - [ ] Set up external odds API accounts
  - [ ] Configure API keys securely
  - [ ] Implement fallback mechanisms
  - [ ] Add usage monitoring

---

## 🔍 Phase 6: Code Refactoring (Priority: Medium)

### 6.1 Component Architecture Cleanup
- [ ] **Refactor Dashboard Components**
  - [ ] Split monolithic dashboard into focused components
  - [x] Extract Controls tab into separate component
  - [x] Extract Opportunities tab into separate component
  - [x] Extract Logs tab into separate component
  - [ ] Ensure consistent prop interfaces

### 6.2 Code Organization
- [ ] **Improve Code Structure**
  - [ ] Create shared utility functions
  - [ ] Implement consistent error boundaries
  - [x] Add proper TypeScript types throughout
  - [ ] Set up barrel exports for components
  - [ ] Add comprehensive JSDoc comments

---

## 🎨 Phase 7: UI/UX Polish (Priority: Medium)

### 7.1 Design System Implementation
- [ ] **Consistent Styling**
  - [ ] Implement design tokens
  - [ ] Ensure consistent spacing and typography
  - [ ] Add proper color scheme (light/dark mode support)
  - [ ] Create style guide documentation

### 7.2 User Experience Enhancements
- [ ] **UX Improvements**
  - [ ] Add skeleton loading states
  - [ ] Implement smooth transitions and animations
  - [ ] Add keyboard navigation support
  - [ ] Optimize for mobile devices
  - [ ] Add help tooltips and onboarding
