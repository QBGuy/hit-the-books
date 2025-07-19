**Goal**: A web application that identifies profitable sports betting opportunities and allows logged-in users to track and log their bets.

Use /reference to build out the application. Rules
- ensure that the code is neat and 

/reference/auth-supabase - use this to set up the auth for google

/reference/bet-opportunities/: contains code 
    - bet_recoveries.js: to pull odds data and post it to supabase "opportunities" (previously btb_opps). this was originally based on bet_recoveries.py
    - bet-calculations.ts: calculate interim steps for UI from teh data from bet_recoveries to assist with the "Opportunities Table" in the UI (e.g. outlay, payout, given stake)

/reference/ui/landing-page.tsx - landing page; 
    - make this the default page to start
    - set up Google Auth when logging in

/reference/ui/sports-betting-dashboard - main user page
    - contains the core UI code for the dashboard. I have styled it to my preference already.
    - however, the code is messy and not factored nicely - think carefully and refactor where sensible.
    - e.g. split out the "Controls", "Opportunities", "Logs" tabs into separate tsx.
            - define a re-usable card for each one of the bets for cleanliness
            - use these across both the Logs and Opportunities page  
    - Controls
        - Bet Type: filters the "Opportunities" for Bonus vs Turnover (alias "bonus" and "low-hold" in the data)
        - Stake: is the stake for the bookie_1 
        - Bookie: is a filter for bookie_1
    - Opportunities
        - base data comes from teh "Opportunities" table from SUPABASE
        - data is filtered and modified based on the "Controls"
        - Clickdown
            - "Log bet" posts the bet to the BET_LOG table for the user

    - "Refresh": button refreshes the opportunities OR log table depending on what screen is showing
    - Log: displays reshaped data from the BET_LOG table
    
    



SUPABASE TABLES
OPPORTUNITIES - returned from the bet_recoveries.js
| Column          | Type      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| sport           | text      | e.g. "NRL"                           |
| bookie\_1       | text      |                                      |
| odds\_1         | decimal   |                                      |
| team\_1         | text      |                                      |
| bookie\_2       | text      |                                      |
| odds\_2         | decimal   |                                      |
| team\_2         | text      |                                      |
| stake\_2        | decimal   | assuming $1 stake on bookie_1        |
| profit          | decimal   | assuming $1 bet                      |
| betfair\_scalar | decimal   | Used in effective odds calc          |
| bookie          | text      | For filtering                        |
| bet\_type       | text      | "turnover" or "bonus"                |
| timestamp       | timestamp | ISO format, used for freshness check |

BET_LOG - logs every action 
| Column          | Type      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| user\_id        | uuid      | From Supabase Auth                 |
| username        | text      | from auth                            |
| sport           | text      | e.g. "NRL"                           |
| bookie\_1       | text      |                                      |
| odds\_1         | decimal   |                                      |
| team\_1         | text      |                                      |
| stake\_1        | text      |                                      |
| bookie\_2       | text      |                                      |
| odds\_2         | decimal   |                                      |
| team\_2         | text      |                                      |
| stake\_2        | decimal   |                                      |
| profit          | decimal   |                                      |
| profit_actual   | decimal   | actual dollar profit                 |
| betfair\_scalar | decimal   | Used in effective odds calc          |
| bookie          | text      | For filtering                        |
| bet\_type       | text      | "turnover" or "bonus"                |
| timestamp       | timestamp | ISO format, used for freshness check |

USER_LOGINS - logs log-in, log-out, bets
CREATE TABLE user_actions (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     username TEXT,
     email TEXT,
     action_type TEXT NOT NULL,
     action_details JSONB,
     timestamp TIMESTAMP DEFAULT NOW()
);