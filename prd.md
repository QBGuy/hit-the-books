# 📘 Product Reference Document (PRD v1.1)

**Project**: Hit the Books
**Goal**: A web application that identifies profitable sports betting opportunities and allows logged-in users to track and log their bets.

---

## 🔧 Tech Stack

| Layer      | Tech / Library                     |
| ---------- | ---------------------------------- |
| Frontend   | Next.js 15 App Router + TypeScript |
| Styling    | TailwindCSS + shadcn/ui            |
| Icons      | lucide-react                       |
| Auth       | Supabase Auth (Google login only)  |
| Database   | Supabase (Postgres)                |
| State Mgmt | React state (useState/useEffect)   |

---

## 🔐 Authentication & User Management

| Feature             | Details                                                |
| ------------------- | ------------------------------------------------------ |
| Auth provider       | Google via Supabase Auth                               |
| Access restriction  | Only authenticated users can access the main interface |
| User-scoped data    | Bets are logged per user and only visible to that user |
| API key handling    | Users can store their own `odds_api_key` in `profiles` |
| Free usage fallback | Use global `ODDS_API_KEY` up to 15 times per user      |

---

## 🗃️ Database Schema (Supabase)

### `opportunities` Table

| Column          | Type      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| sport           | text      | e.g. "NRL"                           |
| bookie\_1       | text      |                                      |
| odds\_1         | decimal   |                                      |
| team\_1         | text      |                                      |
| bookie\_2       | text      |                                      |
| odds\_2         | decimal   |                                      |
| team\_2         | text      |                                      |
| stake\_2        | decimal   |                                      |
| profit          | decimal   |                                      |
| betfair\_scalar | decimal   | Used in effective odds calc          |
| bookie          | text      | For filtering                        |
| bet\_type       | text      | "turnover" or "bonus"                |
| timestamp       | timestamp | ISO format, used for freshness check |

---

### `bets` Table

| Column    | Type      | Notes                              |
| --------- | --------- | ---------------------------------- |
| user\_id  | uuid      | From Supabase Auth                 |
| bookie\_1 | text      |                                    |
| stake\_1  | decimal   |                                    |
| odds\_1   | decimal   |                                    |
| bookie\_2 | text      |                                    |
| stake\_2  | decimal   |                                    |
| odds\_2   | decimal   |                                    |
| profit    | decimal   |                                    |
| type      | text      | "turnover" or "bonus"              |
| team      | text      | Optional, derived from opportunity |
| payout    | decimal   | Calculated optionally on insert    |
| timestamp | timestamp | Auto-generated when bet is logged  |

---

### `profiles` Table (optional)

| Column          | Type | Notes                            |
| --------------- | ---- | -------------------------------- |
| id              | uuid | Supabase user ID                 |
| odds\_api\_key  | text | User-supplied API key            |
| uses\_remaining | int  | Used to count fallback key usage |

---

## 💡 Core Features


### 📈 Opportunity Refresh Logic

| Description         | Value/Notes                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| Freshness threshold | 60 seconds (modifiable constant)                                               |
| Refresh trigger     | Button click or force flag                                                     |
| If data < 60s old   | Use Supabase cached table                                                      |
| If data ≥ 60s old   | fetch odds and calculate

---

#### Logs Table Columns

| Column   | Notes                                    |
| -------- | ---------------------------------------- |
| bet      | Display as team\_1 vs team\_2            |
| bet-date | `timestamp`                              |
| bookie   | `bookie_1`                               |
| team     | `team_1`                                 |
| odds     | `odds_1`                                 |
| stake    | `stake_1`                                |
| payout   | `stake * effective_odds`  |
| recovery | `profit`                                 |
| type     | `bonus` or `turnover`                    |

---
