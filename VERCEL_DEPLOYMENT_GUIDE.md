# My Budget Mate - Vercel Deployment Guide

## Quick Deployment Steps ✅

### 1. Connect GitHub Repository
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New..." → "Project"
- Import from GitHub: `https://github.com/hoff1997/MyBudgetMate`

### 2. Configure Build Settings
Vercel should auto-detect the configuration from `vercel.json`:
- **Build Command:** `npx vite build`
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`

### 3. Add Environment Variables
In the deployment configuration, add:

**Required:**
```
JWT_SECRET=mybudgetmate2025secretkey!@#$%^&*()_+1234567890
STORAGE_TYPE=memory
```

**Optional (for database):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Deploy
Click "Deploy" and wait for completion.

## What You Get ✅

**Complete Budgeting Application:**
- Envelope budgeting system
- Transaction management
- Account management
- JWT authentication
- Demo data included

**API Endpoints:**
- `/api/ping` - Health check
- `/api/auth/login` - Authentication
- `/api/auth/user` - User profile
- `/api/envelopes` - Envelope management
- `/api/transactions` - Transaction management
- `/api/accounts` - Account management

**Demo Credentials:**
- Username: `demo` / Password: `mybudgetmate`
- Username: `user` / Password: `demo123`
- Username: `test` / Password: `budgetmate`

## Testing After Deployment ✅

1. **Visit your deployment URL**
2. **Test health check:** `[your-url]/api/ping`
3. **Login with demo credentials**
4. **Explore features:**
   - View demo envelopes
   - Check transactions
   - Test account management

## Technical Features ✅

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS styling
- Responsive design
- Mobile-optimized interface

**Backend:**
- Serverless API functions
- JWT authentication
- Demo data with optional database
- Environment-based storage

**Architecture:**
- Zero server maintenance
- Scalable serverless design
- Optional database integration
- Production-ready configuration

Your My Budget Mate application is now ready for professional deployment on Vercel!