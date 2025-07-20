# 🏗️ Technical Architecture

**Project**: Hit the Books  
**Version**: 1.1  
**Last Updated**: January 2025

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

## ENV that already exist
ODDS_API_KEY

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

SUPABASE_URL=https://aurvdzwvfpirvjdegupc.supabase.co
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

---

## 📁 Current Project Structure

```
hit-the-books/
├── app/                              # Next.js 15 App Router
│   ├── (auth)/                      # Auth route group
│   │   ├── auth/                    # Auth handlers
│   │   ├── auth-code-error/         # Auth error page
│   │   └── login/                   # Login page
│   │       └── page.tsx            
│   ├── (dashboard)/                 # Protected dashboard routes
│   │   └── dashboard/              # Main dashboard
│   │       └── page.tsx            
│   ├── (dashboard)dashboard/        # Alternative dashboard route
│   ├── api/                        # API routes
│   │   ├── opportunities/          # Fetch opportunities
│   │   ├── bets/                   # CRUD bet logs  
│   │   └── user-actions/           # Log user actions
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/                      # Feature components
│   ├── auth/                       # Authentication components
│   │   └── auth-provider.tsx      # Auth context provider
│   ├── commons/                    # Common reusable components
│   ├── dashboard/                  # Dashboard feature components
│   │   ├── controls-panel.tsx     # All controls (bet type, stake, bookie, refresh)
│   │   ├── dashboard-layout.tsx   # Main dashboard container
│   │   ├── opportunities/         # Opportunities tab components
│   │   ├── logs/                  # Logs tab components
│   │   └── shared/                # Shared dashboard components
│   │       ├── bet-card.tsx       # Reusable bet display
│   │       ├── bet-logging-modal.tsx # Bet logging functionality
│   │       ├── dashboard-header.tsx # Header with logo/user
│   │       └── data-freshness-indicator.tsx # Data age indicator
│   ├── landing/                   # Landing page components
│   ├── theme-provider.tsx         # Theme context provider
│   └── ui/                        # shadcn/ui components

├── hooks/                         # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection hook
│   ├── use-opportunities.ts      # Opportunities data hook
│   ├── use-toast.ts             # Toast notifications hook
│   └── use-user-actions.ts      # User actions logging hook
├── lib/                           # Core utilities and configurations
│   ├── api/                      # API utilities
│   ├── auth/                     # Authentication utilities
│   ├── betting/                  # Betting logic modules
│   │   ├── bet_recoveries.ts     # Bet recovery processing
│   │   ├── bet_recoveries_standalone.ts # Standalone recovery logic
│   │   ├── calculations.ts       # Bet calculations
│   │   └── opportunities.ts      # Opportunity fetching
│   ├── supabase/                 # Supabase integration
│   │   ├── client.ts            # Browser client
│   │   ├── middleware.ts        # Auth middleware
│   │   └── server.ts            # Server client
│   └── utils.ts                  # General utilities
├── types/                         # TypeScript type definitions
│   └── database.ts               # Database types
├── hooks/                         # Additional custom hooks (duplicate noted)
├── public/                        # Static assets
│   └── hit-the-books-logo.png   # App logo
├── reference/                     # Legacy/reference implementations
│   ├── auth-supabase/           # Reference auth implementation
│   ├── bet-opportunities/       # Reference betting logic
│   └── ui/                      # Reference UI components
├── scripts/                       # Build and deployment scripts
│   └── setup-database.sql       # Database setup script
├── styles/                        # Additional styles
│   └── globals.css              # Global CSS overrides
├── test/                          # Test files and utilities
│   ├── check-fresh-data.ts      # Data freshness testing
│   ├── debug-database.ts        # Database debugging
│   ├── README.md                # Test documentation
│   ├── run-bet-recoveries.js    # Bet recovery testing
│   ├── run-test.js              # General test runner
│   ├── simple-test.ts           # Simple test cases
│   ├── test-bet-recoveries.ts   # Bet recovery tests
│   └── test-calculations-alignment.ts # Calculation tests
├── z-docs/                        # Documentation
│   ├── architecture.md          # Technical architecture (this file)
│   ├── instructions.md          # Development instructions
│   ├── prd.md                   # Product requirements
│   └── tasks.md                 # Development tasks
├── components.json               # shadcn/ui configuration
├── middleware.ts                 # Next.js middleware
├── next-env.d.ts                # Next.js type definitions
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── pnpm-lock.yaml              # Package lock file
├── postcss.config.mjs          # PostCSS configuration
├── prd.md                      # Product requirements (root level)
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```
│   │   ├── auth-provider.tsx      # Auth context provider
│   ├── commons/                   # Common reusable components  
│   ├── dashboard/                  # Dashboard feature components
│   │   ├── controls-panel.tsx     # All controls (bet type, stake, bookie, refresh) in one file
│   │   ├── opportunities/         # Opportunities tab components
│   │   │   ├── opportunity-card.tsx    # Individual opportunity
│   │   │   ├── opportunity-list.tsx    # List of opportunities
│   │   ├── logs/                  # Logs tab components
│   │   │   ├── bet-log-list.tsx        # List of logged bets
│   │   │   └── export-logs.tsx         # Export functionality
│   │   ├── shared/                # Shared dashboard components
│   │   │   ├── bet-card.tsx            # Reusable bet display for logs and opps
│   │   │   ├── bet-logging-modal.tsx   # Bet logging functionality
│   │   │   ├── dashboard-header.tsx    # Header with logo/user
│   │   │   └── data-freshness-indicator.tsx # Data age and refresh indicator
│   │   └── dashboard-layout.tsx   # Main dashboard container
│   ├── landing/                   # Landing page components
│   │   ├── hero-section.tsx       # Main hero
│   │   ├── features-section.tsx   # Features showcase
│   │   ├── testimonials.tsx       # User testimonials
│   │   ├── pricing-section.tsx    # Pricing (if applicable)
│   │   └── cta-section.tsx        # Call to action
│   ├── theme-provider.tsx         # Theme context provider (Dark/Light mode)
│   ├── ui/                        # shadcn/ui components
│   │   ├── [comprehensive shadcn component library]
│   │   └── ...
│   └── commons/                   # Common reusable components (Note: appears in both locations)
│       ├── loading-spinner.tsx    # Loading states
│       ├── error-boundary.tsx     # Error handling
│       ├── toast-notifications.tsx # Toast system
│       └── confirmation-dialog.tsx # Confirmation modals
├── lib/                           # Core utilities and configurations
│   ├── supabase/                  # Supabase integration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   ├── betting/                   # Betting logic modules
│   │   ├── bet_recoveries.ts     # Bet recovery processing
│   │   ├── bet_recoveries_standalone.ts # Standalone recovery logic  
│   │   ├── calculations.ts        # Bet calculations
│   │   └── opportunities.ts       # Opportunity fetching
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
│   ├── use-mobile.tsx            # Mobile detection hook
│   ├── use-opportunities.ts      # Opportunities data hook
│   ├── use-toast.ts             # Toast notifications hook
│   └── use-user-actions.ts      # User actions logging hook
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
├── reference/                     # Legacy/reference implementations
│   ├── auth-supabase/           # Reference auth implementation
│   ├── bet-opportunities/       # Reference betting logic
│   └── ui/                      # Reference UI components
├── scripts/                       # Build and deployment scripts
│   ├── setup-database.sql       # Database setup script
│   ├── migrate.ts               # Database migrations (future)
│   └── seed-data.ts             # Sample data seeding (future)
├── styles/                        # Additional styles
│   └── globals.css              # Global CSS overrides
├── test/                          # Test files and utilities
│   ├── check-fresh-data.ts      # Data freshness testing
│   ├── debug-database.ts        # Database debugging
│   ├── README.md                # Test documentation
│   ├── run-bet-recoveries.js    # Bet recovery testing
│   ├── run-test.js              # General test runner
│   ├── simple-test.ts           # Simple test cases
│   ├── test-bet-recoveries.ts   # Bet recovery tests
│   └── test-calculations-alignment.ts # Calculation tests
├── z-docs/                        # Documentation
│   ├── architecture.md          # Technical architecture (this file)
│   ├── instructions.md          # Development instructions
│   ├── prd.md                   # Product requirements
│   └── tasks.md                 # Development tasks
├── components.json               # shadcn/ui configuration
├── .env.local                     # Environment variables
├── .env.example                   # Environment template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── pnpm-lock.yaml               # Lock file
├── postcss.config.mjs           # PostCSS configuration
├── prd.md                       # Product requirements (root level)
└── README.md                     # Project documentation
```

---

## 🆕 Recent Implementation Updates

### New Key Components Implemented

#### Data Freshness System
- **`data-freshness-indicator.tsx`**: Real-time data age monitoring with visual indicators
- **Features**: Age calculation, refresh states, Sydney timezone display  
- **Integration**: Used across opportunities and logs views for data transparency

#### Enhanced Bet Management
- **`bet-logging-modal.tsx`**: Centralized bet logging functionality
- **`bet-card.tsx`**: Unified bet display component for opportunities and logs
- **Improved UX**: Consistent bet interaction patterns across the application

#### Theme Management
- **`theme-provider.tsx`**: Dark/light mode support
- **Integration**: Consistent theming across all UI components

#### Comprehensive UI Library
- **Complete shadcn/ui implementation**: 40+ production-ready components
- **Mobile-responsive**: All components optimized for mobile devices
- **Accessibility**: WCAG compliant implementations

#### Advanced Betting Logic
- **`bet_recoveries.ts`**: Production bet recovery processing
- **`bet_recoveries_standalone.ts`**: Standalone recovery logic for testing
- **Enhanced calculations**: More sophisticated betting mathematics

#### Testing Infrastructure
- **Comprehensive test suite**: Data freshness, calculations, and database testing
- **Debug utilities**: Database debugging and testing tools
- **Quality assurance**: Alignment testing for betting calculations

### Structural Improvements

#### Route Organization
- **Route groups**: Proper separation of authenticated and public routes
- **Alternative routing**: Multiple dashboard access patterns implemented
- **API structure**: Well-organized API endpoints for different functionalities

#### Hook Architecture
- **Custom hooks**: Specialized hooks for opportunities, user actions, and mobile detection
- **State management**: Efficient state handling across components
- **Reusability**: Shared logic extraction into custom hooks

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
├── Theme Provider (Dark/Light mode)
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
        │   │   ├── Age Display (seconds/minutes/hours)
        │   │   ├── Refresh Status (Fresh/Stale/Refreshing)
        │   │   ├── Sydney Time Display
        │   │   └── Manual Refresh Button
        │   ├── Opportunity List
        │   │   └── Bet Card (reusable)
        │   │       ├── Profit Calculator
        │   │       └── Bet Logging Modal
        │   │           ├── Bet Details Form
        │   │           ├── Stake Validation
        │   │           └── Confirmation Actions
        │   └── Empty State
        └── Logs Tab
            ├── Data Freshness Indicator
            ├── Log Filters
            ├── Bet Log List
            │   └── Bet Card (reusable)
            │       ├── Edit/Delete Actions
            │       └── Performance Metrics
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
- **BetCard**: Unified bet display for opportunities and logs with contextual actions
- **DataFreshnessIndicator**: Real-time data age monitoring with timezone awareness
- **BetLoggingModal**: Centralized bet logging with validation and confirmation
- **ThemeProvider**: Dark/light mode support with system preference detection
- **TabNavigation**: Consistent tab switching with state management
- **ControlsPanel**: Centralized filtering and configuration
- **LoadingStates**: Skeleton loading for different content types (Spinner, Skeleton)
- **ErrorBoundary**: Graceful error handling at component level
- **ConfirmationDialog**: Standard confirmation patterns
- **MobileDetection**: Responsive behavior adaptation (via use-mobile hook)

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

## 🔄 Migration Status and Next Steps

### ✅ Completed Migrations

The following components have been successfully migrated from the `reference/` folder:

| Reference Component | Target Location | Status | Notes |
|-------------------|----------------|--------|-------|
| `reference/ui/` components | `components/ui/` | ✅ Complete | Full shadcn/ui implementation |
| `reference/bet-opportunities/bet-calculations.ts` | `lib/betting/calculations.ts` | ✅ Complete | Moved and enhanced with TypeScript |
| `reference/bet-opportunities/bet_recoveries.js` | `lib/betting/bet_recoveries.ts` | ✅ Complete | Converted to TypeScript with standalone version |
| `reference/auth-supabase/` | `lib/supabase/` & `components/auth/` | ✅ Complete | Separated client/server code |
| Core dashboard structure | `components/dashboard/` | ✅ Complete | Broken into focused modules |

### 🚧 Remaining Migration Tasks

| Reference Component | Target Location | Priority | Notes |
|-------------------|----------------|----------|-------|
| `reference/ui/landing-page.tsx` | `components/landing/` | High | Split into smaller feature components |
| API route implementations | `app/api/` | High | Complete API endpoint implementations |
| Error handling patterns | `lib/api/error-handling.ts` | Medium | Standardize error handling |
| Testing migration | Update test files | Medium | Update tests for new structure |

### Current Implementation Status

#### ✅ Fully Implemented
- **Component Architecture**: Modular dashboard with shared components
- **UI System**: Complete shadcn/ui integration with theming
- **Data Management**: Hooks for opportunities, user actions, mobile detection
- **Betting Logic**: Advanced calculations and recovery processing
- **Database Integration**: Supabase client/server separation
- **Testing Infrastructure**: Comprehensive test suite

#### 🔄 In Progress
- **API Routes**: Basic structure exists, needs completion
- **Landing Page**: Components exist but need final integration
- **Authentication Flow**: Core implemented, needs refinement

#### 📋 Planned
- **Error Handling**: Standardized error patterns
- **Performance Optimization**: Bundle analysis and optimization
- **Documentation**: API documentation completion

### Development Workflow

#### Current Development Process
1. **Feature Development**: Use existing component patterns and hooks
2. **Testing**: Run comprehensive test suite before deployment  
3. **Code Quality**: TypeScript strict mode and consistent patterns
4. **Performance**: Monitor bundle size and component performance

#### Next Development Priorities
1. **Complete API Routes**: Finish remaining endpoint implementations
2. **Landing Page Integration**: Complete landing page component assembly
3. **Error Handling**: Implement standardized error handling patterns
4. **Performance Optimization**: Bundle analysis and optimization
5. **Documentation**: Complete API and component documentation

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
