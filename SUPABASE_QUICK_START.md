# Quick Start: Connect to Supabase Database

Your budgeting app is ready to connect to Supabase for permanent data storage. Follow these steps:

## 1. Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name: "My Budget Mate" 
4. Set a database password (save it!)
5. Click "Create new project"

## 2. Set Up Database Tables (1 minute)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy ALL contents from `server/supabase-schema.sql`
4. Paste and click "Run"

## 3. Get Your Connection Details (30 seconds)

1. Go to **Settings** > **API** in Supabase
2. Copy these two values:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **anon public key** (starts with: `eyJ...`)

## 4. Add to Replit Secrets (30 seconds)

1. In Replit, click the **Secrets** tab (🔒 icon)
2. Add secret: `SUPABASE_URL` = your Project URL
3. Add secret: `SUPABASE_KEY` = your anon public key

## 5. Restart and Test (30 seconds)

1. Restart your Replit app
2. Look for: `✅ Connected to Supabase database - all data will be persisted`
3. Your app now uses permanent cloud storage!

## What You Get

- **Never lose data** - survives restarts, deployments, code changes
- **Real-time sync** - changes saved instantly to cloud database  
- **Multi-user ready** - can handle multiple users and accounts
- **Professional grade** - same database used by major companies

## Troubleshooting

**Still seeing "in-memory storage"?**
- Check your secrets are named exactly: `SUPABASE_URL` and `SUPABASE_KEY`
- Verify you ran the SQL schema in Step 2
- Make sure your Supabase project is active (not paused)

**Need help?** Check `SUPABASE_SETUP.md` for detailed instructions.

---

**Total setup time: ~4 minutes**  
**Result: Professional cloud database with permanent data storage**