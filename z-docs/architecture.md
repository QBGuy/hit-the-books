# 🏗️ Technical Architecture

**Project**: Hit the Books  
**Version**: 1.0  
**Last Updated**: December 2024

---

## 🎯 System Overview

Hit the Books is a full-stack web application built on a modern React/Next.js architecture with Supabase as the backend-as-a-service provider. The system follows a client-server model with real-time data synchronization and user authentication.

---

## 🏛️ Architecture Patterns

### Frontend Architecture
- **Pattern**: Jamstack (JavaScript, APIs, Markup)
- **Framework**: Next.js 15 with App Router
- **State Management**: React hooks (useState, useEffect, useContext)
- **Component Strategy**: Composition over inheritance
- **Styling**: Utility-first with TailwindCSS + shadcn/ui

### Backend Architecture
- **Pattern**: Serverless + Database-as-a-Service
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with OAuth providers
- **API Layer**: Supabase auto-generated REST/GraphQL APIs
- **Real-time**: Supabase real-time subscriptions

---

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Odds APIs     │───▶│  bet_recoveries  │───▶│   Supabase      │
│  (External)     │    │      .js         │    │ opportunities   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI    │◄───│ bet-calculations │◄───│   API Calls     │
│   Components    │    │      .ts         │    │  (Supabase)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│   User Actions  │──────────────────────────▶│   bet_log &     │
│   (Bet Logging) │                           │ user_actions    │
└─────────────────┘                           └─────────────────┘
```

---

## 📁 Ultimate Project Structure

```
hit-the-books/
├── app/                              # Next.js 15 App Router
│   ├── (auth)/                      # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts        # Auth callback handler
│   ├── (dashboard)/                 # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Main dashboard
│   │   │   └── loading.tsx         # Dashboard loading
│   │   └── layout.tsx              # Dashboard layout wrapper
│   ├── api/                        # API routes
│   │   ├── opportunities/
│   │   │   ├── route.ts           # Fetch opportunities
│   │   │   └── refresh/
│   │   │       └── route.ts       # Force refresh opportunities
│   │   ├── bets/
│   │   │   ├── route.ts           # CRUD bet logs
│   │   │   └── [id]/
│   │   │       └── route.ts       # Individual bet operations
│   │   └── user-actions/
│   │       └── route.ts           # Log user actions
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   ├── loading.tsx                 # Global loading component
│   └── not-found.tsx              # 404 page
├── components/                      # Feature components
│   ├── auth/                       # Authentication components
│   │   ├── login-button.tsx       # Google login button
│   │   ├── logout-button.tsx      # Logout functionality
│   │   ├── auth-provider.tsx      # Auth context provider
│   │   └── protected-route.tsx    # Route protection wrapper
│   ├── dashboard/                  # Dashboard feature components
│   │   ├── controls-panel.tsx         # All controls (bet type, stake, bookie, refresh) in one file
│   │   ├── opportunities/         # Opportunities tab components
│   │   │   ├── opportunity-card.tsx    # Individual opportunity
│   │   │   ├── opportunity-list.tsx    # List of opportunities
│   │   │   ├── log-bet-modal.tsx       # Bet logging modal
│   │   │   ├── profit-calculator.tsx   # Real-time calculations
│   │   │   └── data-freshness.tsx      # Freshness indicators
│   │   ├── logs/                  # Logs tab components
│   │   │   ├── bet-log-card.tsx        # Individual log entry
│   │   │   ├── bet-log-list.tsx        # List of logged bets
│   │   │   ├── log-filters.tsx         # Filter logged bets
│   │   │   └── export-logs.tsx         # Export functionality
│   │   ├── shared/                # Shared dashboard components
│   │   │   ├── bet-card.tsx            # Reusable bet display
│   │   │   └── dashboard-header.tsx    # Header with logo/user
│   │   └── dashboard-layout.tsx   # Main dashboard container
│   ├── landing/                   # Landing page components
│   │   ├── hero-section.tsx       # Main hero
│   │   ├── features-section.tsx   # Features showcase
│   │   ├── testimonials.tsx       # User testimonials
│   │   ├── pricing-section.tsx    # Pricing (if applicable)
│   │   └── cta-section.tsx        # Call to action
│   ├── ui/                        # shadcn/ui components
│   │   ├── [existing shadcn components]
│   │   └── ...
│   └── common/                    # Common reusable components
│       ├── loading-spinner.tsx    # Loading states
│       ├── error-boundary.tsx     # Error handling
│       ├── toast-notifications.tsx # Toast system
│       └── confirmation-dialog.tsx # Confirmation modals
├── lib/                           # Core utilities and configurations
│   ├── supabase/                  # Supabase integration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts         # Auth middleware
│   │   └── types.ts              # Database types
│   ├── betting/                   # Betting logic modules
│   │   ├── calculations.ts        # Bet calculations
│   │   ├── opportunities.ts       # Opportunity fetching
│   │   ├── data-refresh.ts        # Refresh logic
│   │   └── types.ts              # Betting types
│   ├── auth/                      # Authentication utilities
│   │   ├── session.ts            # Session management
│   │   ├── user-actions.ts       # Action logging
│   │   └── role-management.ts    # User roles
│   ├── api/                       # API utilities
│   │   ├── client.ts             # API client setup
│   │   ├── error-handling.ts     # Error handling
│   │   └── validation.ts         # Input validation
│   ├── utils.ts                   # General utilities
│   └── constants.ts               # App constants
├── hooks/                         # Custom React hooks
│   ├── use-auth.ts               # Authentication hook
│   ├── use-opportunities.ts      # Opportunities data hook
│   ├── use-bet-logs.ts           # Bet logs hook
│   ├── use-calculations.ts       # Bet calculations hook
│   ├── use-local-storage.ts      # Local storage hook
│   └── use-debounce.ts           # Debouncing hook
├── types/                         # TypeScript type definitions
│   ├── database.ts               # Database types
│   ├── betting.ts                # Betting-related types
│   ├── auth.ts                   # Auth types
│   └── api.ts                    # API response types
├── middleware.ts                  # Next.js middleware
├── public/                        # Static assets
│   ├── hit-the-books-logo.png   # App logo
│   ├── favicon.ico              # Favicon
│   └── images/                  # Image assets
├── styles/                        # Additional styles
│   └── globals.css              # Global CSS overrides
├── scripts/                       # Build and deployment scripts
│   ├── setup-db.ts              # Database setup
│   ├── migrate.ts               # Database migrations
│   └── seed-data.ts             # Sample data seeding
├── z-docs/                        # Documentation
│   ├── prd.md                   # Product requirements
│   ├── architecture.md          # Technical architecture
│   ├── tasks.md                 # Development tasks
│   └── api-docs.md              # API documentation
├── .env.local                     # Environment variables
├── .env.example                   # Environment template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── pnpm-lock.yaml               # Lock file
└── README.md                     # Project documentation
```

---

## 🔧 Technology Deep Dive

### Frontend Stack

#### Next.js 15 App Router
- **Routing**: File-system based routing
- **Rendering**: Server-side rendering (SSR) + Static generation
- **API Routes**: Edge functions for serverless operations
- **Optimization**: Automatic code splitting and image optimization

#### React + TypeScript
- **Components**: Functional components with hooks
- **Type Safety**: Strict TypeScript configuration
- **State Management**: useState, useEffect, useContext for local state
- **Performance**: React.memo, useMemo, useCallback for optimization

#### Styling System
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Design System**: Consistent tokens and spacing
- **Responsive**: Mobile-first responsive design

### Backend Stack

#### Supabase Infrastructure
- **Database**: PostgreSQL with row-level security
- **Authentication**: Multi-provider OAuth (Google)
- **Real-time**: WebSocket subscriptions
- **Storage**: File storage for assets
- **Edge Functions**: Serverless compute (if needed)

#### Database Design
- **Security**: Row-level security (RLS) policies
- **Performance**: Strategic indexing on query columns
- **Data Integrity**: Foreign key constraints and validation
- **Audit Trail**: Comprehensive logging in user_actions

---

## 🔐 Security Architecture

### Authentication Flow
```
User → Google OAuth → Supabase Auth → JWT Token → App Access
```

### Authorization Model
- **Row-Level Security**: Users only access their own bet_log entries
- **API Security**: Supabase handles token validation
- **Client-side**: User context and route protection
- **Audit Logging**: All actions tracked in user_actions table

### Data Protection
- **Encryption**: TLS in transit, encryption at rest (Supabase)
- **API Keys**: Secure storage of odds API keys
- **Environment Variables**: Sensitive config in env files
- **CORS**: Configured for production domains only

---

## 📊 Data Architecture

### Database Schema Relationships

```
auth.users (Supabase)
    │
    ├── bet_log (user_id FK)
    ├── user_actions (user_id FK)
    └── profiles (id FK) [optional]

opportunities (global data)
    └── [no direct relationships]
```

### Data Flow Patterns

#### 1. Odds Collection Pipeline
```
External APIs → bet_recoveries.js → opportunities table → UI calculations
```

#### 2. User Interaction Flow
```
User Input → React State → Supabase API → Database → Real-time Updates
```

#### 3. Audit Trail
```
Any User Action → user_actions table → Analytics/Monitoring
```

---

## 🔄 Component Architecture

### Component Hierarchy
```
App Layout (Root)
├── Landing Page (/) - Unauthenticated
│   ├── Hero Section
│   ├── Features Section
│   ├── Testimonials
│   └── CTA Section
└── Dashboard Layout (/dashboard) - Authenticated
    ├── Dashboard Header
    │   ├── Logo
    │   ├── User Menu
    │   └── Logout Button
    ├── Controls Panel (Sidebar)
    │   ├── Bet Type Toggle
    │   ├── Stake Input
    │   ├── Bookie Filter
    │   └── Refresh Button
    └── Main Content (Tabs)
        ├── Opportunities Tab
        │   ├── Data Freshness Indicator
        │   ├── Opportunity List
        │   │   └── Opportunity Card (reusable)
        │   │       ├── Profit Calculator
        │   │       └── Log Bet Modal
        │   └── Empty State
        └── Logs Tab
            ├── Log Filters
            ├── Bet Log List
            │   └── Bet Log Card (reusable)
            ├── Export Logs
            └── Empty State
```

### Component Design Principles
- **Reusability**: Shared components across tabs (BetCard pattern)
- **Separation of Concerns**: Each component has a single responsibility
- **Composability**: Smaller components compose into larger features
- **Consistency**: Uniform styling and behavior patterns
- **Accessibility**: WCAG compliant with proper ARIA labels

### Key Reusable Components
- **BetCard**: Unified bet display for opportunities and logs
- **TabNavigation**: Consistent tab switching with state management
- **ControlsPanel**: Centralized filtering and configuration
- **LoadingStates**: Skeleton loading for different content types
- **ErrorBoundary**: Graceful error handling at component level
- **ConfirmationDialog**: Standard confirmation patterns

---

## ⚡ Performance Architecture

### Frontend Optimization
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: Browser caching + SWR for data fetching
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimization
- **Database Indexing**: Strategic indexes on filter columns
- **Query Optimization**: Efficient Supabase queries
- **Caching Strategy**: Opportunities data caching (60s threshold)
- **Connection Pooling**: Supabase handles connection management

### Real-time Updates
- **Selective Subscriptions**: Only subscribe to relevant data changes
- **Debouncing**: User input debouncing for calculations
- **Optimistic Updates**: UI updates before server confirmation

---

## 🚀 Deployment Architecture

### Development Environment
- **Local Development**: Next.js dev server + Supabase local
- **Environment Variables**: .env.local for sensitive config
- **Package Management**: pnpm for fast, efficient installs

### Production Environment
- **Hosting**: Vercel (recommended) or Netlify
- **Database**: Supabase production instance
- **Domain**: Custom domain with SSL
- **Monitoring**: Vercel Analytics + Supabase Dashboard

### CI/CD Pipeline
```
Git Push → GitHub Actions → Build & Test → Deploy to Vercel → Health Check
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- **Serverless**: Auto-scaling with serverless functions
- **Database**: Supabase handles connection pooling
- **CDN**: Global content delivery network

### Vertical Scaling
- **Database**: Easy Supabase plan upgrades
- **Compute**: Vercel function scaling
- **Storage**: Supabase storage scaling

### Performance Monitoring
- **Metrics**: Response times, error rates, user engagement
- **Alerting**: Error tracking and performance degradation alerts
- **Analytics**: User behavior and feature usage tracking

---

## 🔄 Migration Strategy from Reference Code

### Current State Analysis
The `reference/` folder contains working implementations that need to be refactored and integrated:

| Reference Component | Target Location | Migration Notes |
|-------------------|----------------|-----------------|
| `reference/ui/landing-page.tsx` | `components/landing/` | Split into smaller feature components |
| `reference/ui/sports-betting-dashboard.tsx` | `components/dashboard/` | Break monolithic component into focused modules |
| `reference/bet-opportunities/bet-calculations.ts` | `lib/betting/calculations.ts` | Move logic to lib, create React hooks wrapper |
| `reference/bet-opportunities/get-opportunities.ts` | `lib/betting/opportunities.ts` | Refactor for Next.js API routes |
| `reference/bet-opportunities/bet_recoveries.js` | `scripts/` or `lib/betting/` | Convert to TypeScript, integrate with API routes |
| `reference/auth-supabase/` | `lib/supabase/` & `components/auth/` | Separate client/server code, create auth components |

### Migration Steps

#### Phase 1: Foundation Setup
1. **Create Ultimate Structure**: Set up the folder structure as defined above
2. **Move Supabase Config**: Migrate auth setup from `reference/auth-supabase/` to `lib/supabase/`
3. **TypeScript Types**: Create comprehensive types in `types/` folder
4. **Environment Setup**: Configure `.env.local` with all required variables

#### Phase 2: Core Module Migration
1. **Betting Logic**: Move `bet-calculations.ts` to `lib/betting/calculations.ts`
2. **Database Integration**: Port database connection logic to `lib/supabase/`
3. **API Layer**: Create Next.js API routes in `app/api/`
4. **Middleware**: Set up authentication middleware

#### Phase 3: Component Refactoring
1. **Landing Page**: Break down monolithic landing page into feature components
2. **Dashboard Breakdown**: Split dashboard into Controls, Opportunities, and Logs components
3. **Shared Components**: Extract reusable BetCard and other shared elements
4. **Auth Components**: Create login/logout and auth wrapper components

#### Phase 4: Integration & Testing
1. **Hook Creation**: Build custom hooks for data fetching and state management
2. **Error Handling**: Implement error boundaries and validation
3. **Testing Setup**: Add unit tests for all new components
4. **Clean-up**: Remove `reference/` folder after successful migration

### Refactoring Guidelines

#### Component Size and Responsibility
- **Max 200 lines per component**: Split larger components
- **Single Responsibility**: Each component should have one clear purpose
- **Prop Interface**: Define clear TypeScript interfaces for all props
- **Error States**: Handle loading, error, and empty states

#### State Management Strategy
- **Local State**: Use `useState` for component-specific state
- **Shared State**: Use React Context for auth and global settings
- **Server State**: Use custom hooks with SWR/React Query patterns
- **URL State**: Persist filter states in URL parameters

#### Styling Consistency
- **Tailwind Classes**: Use consistent spacing and color tokens
- **Component Variants**: Create reusable component variants
- **Dark Mode Support**: Implement theme switching capability
- **Mobile Responsiveness**: Ensure all components work on mobile

### Code Quality Standards

#### TypeScript Usage
- **Strict Mode**: Enable all TypeScript strict checks
- **Interface Definitions**: Define interfaces for all data structures
- **Generic Types**: Use generics for reusable components
- **Type Guards**: Implement runtime type checking where needed

#### Performance Optimization
- **Code Splitting**: Lazy load dashboard components
- **Memoization**: Use React.memo for expensive components
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Use Next.js Image component

#### Security Considerations
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Protection**: Sanitize user-generated content
- **CSRF Protection**: Implement proper CSRF tokens

---

## 🔮 Future Architecture Considerations

### Potential Enhancements
- **Microservices**: Split betting logic into separate services
- **Caching Layer**: Redis for high-frequency data
- **Background Jobs**: Queue system for odds processing
- **Mobile App**: React Native sharing business logic
- **Multi-tenant**: Support for multiple user organizations
