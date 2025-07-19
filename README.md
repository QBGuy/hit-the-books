# 📘 Hit the Books

A sports betting arbitrage application that identifies profitable betting opportunities and allows authenticated users to track and log their bets.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Google Cloud Console account (for OAuth)

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Odds API
ODDS_API_KEY=your_odds_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Supabase (NEXT_PUBLIC_ prefix for client-side access)
NEXT_PUBLIC_SUPABASE_URL=https://aurvdzwvfpirvjdegupc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `scripts/setup-database.sql`
4. This will create all necessary tables and Row-Level Security policies

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://aurvdzwvfpirvjdegupc.supabase.co/auth/v1/callback` (for Supabase)
   - `http://localhost:3000/auth/callback` (for local development)
6. Copy Client ID and Client Secret to your `.env.local`

### 5. Configure Supabase Auth

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. In Authentication → URL Configuration, add these URLs:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 6. Run the Application

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the landing page.

## 🏗️ Project Structure

```
hit-the-books/
├── app/                              # Next.js 15 App Router
│   ├── (auth)/                      # Auth route group
│   ├── (dashboard)/                 # Protected dashboard routes
│   ├── api/                        # API routes
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/                      # Feature components
│   ├── auth/                       # Authentication components
│   ├── dashboard/                  # Dashboard components
│   ├── ui/                         # shadcn/ui components
│   └── common/                     # Common reusable components
├── lib/                            # Core utilities and configurations
│   ├── supabase/                   # Supabase integration
│   ├── betting/                    # Betting logic modules
│   └── utils.ts                    # General utilities
├── types/                          # TypeScript type definitions
├── scripts/                        # Database and deployment scripts
└── z-docs/                         # Documentation
```

## 🔧 Technology Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 📊 Database Schema

### Tables

- **opportunities**: Betting opportunities from external APIs
- **bet_log**: User-specific logged bets
- **user_actions**: Audit trail of user interactions

### Key Features

- Row-Level Security (RLS) for data isolation
- Automatic user action logging
- Performance-optimized indexes
- Proper foreign key relationships

## 🎯 Features

### Current (MVP)
- ✅ Google Authentication
- ✅ Landing page with feature showcase
- ✅ Basic dashboard with tabs
- ✅ Responsive design
- ✅ Database schema with RLS

### Phase 2 (In Development)
- 🔄 Betting opportunities display
- 🔄 Bet calculations and profit display
- 🔄 Bet logging functionality
- 🔄 User-specific bet history

### Phase 3 (Planned)
- ⏳ Real-time data refresh
- ⏳ Advanced filtering
- ⏳ Export functionality
- ⏳ Profit analytics

## 🚀 Deployment

### Environment Variables for Production

Update your production environment with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secure_random_secret
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Production Setup

1. Update Google OAuth redirect URLs for production domain
2. Configure production environment variables
3. Run database migrations in production

## 📖 API Documentation

### Opportunities API

```typescript
GET /api/opportunities?betType=bonus&bookie=sportsbet
```

Returns filtered betting opportunities with real-time calculations.

### Bet Logging API

```typescript
POST /api/bets
```

Logs a new bet for the authenticated user.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Tasks

See `z-docs/tasks.md` for detailed development roadmap and current progress.

## 📄 License

This project is private and proprietary.

## 🆘 Support

For setup issues or questions, please check:
1. `z-docs/architecture.md` - Technical architecture
2. `z-docs/prd.md` - Product requirements
3. `scripts/setup-database.sql` - Database setup

---

**Hit the Books** - Smart Sports Betting Arbitrage Platform 