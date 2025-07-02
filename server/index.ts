import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startDateAdvancementScheduler } from "./dateAdvancement";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize database storage
async function initializeDatabase() {
  if (process.env.REPLIT_DB_URL) {
    log('✅ Connected to Replit Database - all data will be persisted');
    log('🎯 Using Replit\'s built-in key-value storage for persistence');
    
    // Initialize demo data if database is empty
    const { storage } = await import("./storage");
    const existingUsers = await storage.getAllUsers();
    if (existingUsers.length === 0) {
      log('🎯 Initializing demo data for new Replit Database...');
      await initializeReplitDemoData(storage);
    }
  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    const { testSupabaseConnection } = await import("./supabase");
    const { initializeSupabaseData } = await import("./supabase-init");
    
    const success = await testSupabaseConnection();
    if (success) {
      log('✅ Connected to Supabase database - all data will be persisted');
      // Initialize demo data if database is empty
      await initializeSupabaseData();
    } else {
      log('⚠️ Supabase connection failed - using in-memory storage (data will be lost on restart)');
    }
  } else {
    log('⚠️ No persistent storage configured - using in-memory storage (data will be lost on restart)');
    log('💡 Data will persist on Replit automatically with built-in database');
  }
}

(async () => {
  // Initialize database connection
  await initializeDatabase();
  
  // Start date advancement scheduler
  startDateAdvancementScheduler();
  
  // Start Akahu automatic sync scheduler
  const { startAkahuScheduler } = await import("./akahu-scheduler");
  startAkahuScheduler();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

// Function to initialize demo data for Replit Database
async function initializeReplitDemoData(storage: any) {
  try {
    // Create demo user
    const demoUser = await storage.upsertUser({
      id: "1",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    });

    console.log('👤 Created demo user');

    // Create demo accounts
    const accounts = [
      {
        userId: 1,
        name: 'ASB Everyday Account',
        type: 'checking',
        balance: '2847.63'
      },
      {
        userId: 1,
        name: 'ANZ Savings Account',
        type: 'savings',
        balance: '15420.50'
      },
      {
        userId: 1,
        name: 'Westpac Credit Card',
        type: 'credit',
        balance: '-1250.30'
      },
      {
        userId: 1,
        name: 'Credit Card Holding',
        type: 'checking',
        balance: '1250.30'
      }
    ];

    for (const account of accounts) {
      await storage.createAccount(account);
    }

    console.log('🏦 Created demo accounts');

    // Create envelope categories
    const categories = [
      { userId: 1, name: 'Income', icon: '💰', color: '#059669', sortOrder: 0 },
      { userId: 1, name: 'Essential Expenses', icon: '🏠', color: '#dc2626', sortOrder: 1 },
      { userId: 1, name: 'Lifestyle & Discretionary', icon: '🎬', color: '#7c3aed', sortOrder: 2 },
      { userId: 1, name: 'Personal Care & Health', icon: '🏥', color: '#0891b2', sortOrder: 3 },
      { userId: 1, name: 'Transportation & Travel', icon: '🚗', color: '#ea580c', sortOrder: 4 },
      { userId: 1, name: 'Utilities & Services', icon: '💡', color: '#0d9488', sortOrder: 5 },
      { userId: 1, name: 'Savings & Investments', icon: '💰', color: '#059669', sortOrder: 6 }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const created = await storage.createEnvelopeCategory(category);
      createdCategories.push(created);
    }

    console.log('📂 Created envelope categories');

    // Create demo envelopes
    const envelopes = [
      {
        userId: 1,
        categoryId: createdCategories[0].id, // Income
        name: "Greg's Salary",
        budgetedAmount: '3200.00',
        currentBalance: '0.00',
        budgetFrequency: 'fortnightly',
        envelopeType: 'income',
        isMonitored: false
      },
      {
        userId: 1,
        categoryId: createdCategories[2].id, // Lifestyle
        name: 'Groceries',
        budgetedAmount: '400.00',
        currentBalance: '127.35',
        budgetFrequency: 'monthly',
        envelopeType: 'expense',
        isMonitored: true
      },
      {
        userId: 1,
        categoryId: createdCategories[2].id, // Lifestyle
        name: 'Spending Deb',
        budgetedAmount: '200.00',
        currentBalance: '89.20',
        budgetFrequency: 'fortnightly',
        envelopeType: 'expense',
        isMonitored: true
      },
      {
        userId: 1,
        categoryId: createdCategories[1].id, // Essential
        name: 'Rent',
        budgetedAmount: '1800.00',
        currentBalance: '1800.00',
        budgetFrequency: 'monthly',
        envelopeType: 'expense'
      },
      {
        userId: 1,
        categoryId: createdCategories[4].id, // Transportation
        name: 'Fuel',
        budgetedAmount: '120.00',
        currentBalance: '45.75',
        budgetFrequency: 'monthly',
        envelopeType: 'expense'
      }
    ];

    for (const envelope of envelopes) {
      await storage.createEnvelope(envelope);
    }

    console.log('💰 Created demo envelopes');

    // Create demo transactions
    const transactions = [
      {
        userId: 1,
        accountId: 1,
        amount: '-45.67',
        merchant: 'Countdown',
        description: 'Weekly groceries',
        date: new Date('2025-01-01'),
        isApproved: true
      },
      {
        userId: 1,
        accountId: 1,
        amount: '-12.50',
        merchant: 'Coffee Supreme',
        description: 'Morning coffee',
        date: new Date('2025-01-02'),
        isApproved: false
      }
    ];

    for (const transaction of transactions) {
      await storage.createTransaction(transaction);
    }

    console.log('💳 Created demo transactions');
    console.log('✅ Demo data initialization complete!');

  } catch (error) {
    console.error('❌ Error initializing demo data:', error);
  }
}
