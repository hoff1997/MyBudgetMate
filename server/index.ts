import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Removed for Vercel compatibility

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
    
    // Force comprehensive demo data initialization for existing deployment
    let envelopeCount = 0;
    try {
      const envelopes = await storage.getEnvelopesByUserId(1);
      envelopeCount = envelopes.length;
    } catch (error) {
      // User might not exist yet
      envelopeCount = 0;
    }
    
    if (existingUsers.length === 0 || envelopeCount < 30) {
      log('🎯 Initializing comprehensive demo data for Replit Database...');
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
  // Note: Date advancement scheduler not needed for basic demo
  
  // Note: Akahu scheduler not needed for basic demo
  
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

    // Skip account creation - user will create their own accounts

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

    // Create comprehensive demo envelopes
    const envelopes = [
      // Income category
      { userId: 1, categoryId: createdCategories[0].id, name: "Greg's Salary", budgetedAmount: "3200.00", currentBalance: "0.00", budgetFrequency: "fortnightly", envelopeType: "income", icon: "💼", isMonitored: false },
      { userId: 1, categoryId: createdCategories[0].id, name: "Deb's Salary", budgetedAmount: "2800.00", currentBalance: "0.00", budgetFrequency: "fortnightly", envelopeType: "income", icon: "💼" },
      { userId: 1, categoryId: createdCategories[0].id, name: "Greg's Bonus", budgetedAmount: "3000.00", currentBalance: "200.00", budgetFrequency: "annually", envelopeType: "income", icon: "🎁" },
      { userId: 1, categoryId: createdCategories[0].id, name: "Other Income", budgetedAmount: "1200.00", currentBalance: "0.00", budgetFrequency: "monthly", envelopeType: "income", icon: "💰" },
      { userId: 1, categoryId: createdCategories[0].id, name: "Investment Returns", budgetedAmount: "1800.00", currentBalance: "150.00", budgetFrequency: "monthly", envelopeType: "income", icon: "📊" },
      
      // Essential Expenses
      { userId: 1, categoryId: createdCategories[1].id, name: "Rent/Mortgage", budgetedAmount: "1800.00", currentBalance: "1800.00", budgetFrequency: "monthly", envelopeType: "expense", icon: "🏠" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Groceries", budgetedAmount: "400.00", currentBalance: "127.35", budgetFrequency: "monthly", envelopeType: "expense", isMonitored: true, icon: "🛒" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Power", budgetedAmount: "180.00", currentBalance: "80.00", budgetFrequency: "monthly", envelopeType: "expense", icon: "⚡" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Water", budgetedAmount: "120.00", currentBalance: "40.00", budgetFrequency: "quarterly", envelopeType: "expense", icon: "💧" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Internet", budgetedAmount: "780.00", currentBalance: "60.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🌐" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Phone", budgetedAmount: "600.00", currentBalance: "50.00", budgetFrequency: "annually", envelopeType: "expense", icon: "📱" },
      { userId: 1, categoryId: createdCategories[1].id, name: "House Insurance", budgetedAmount: "2400.00", currentBalance: "100.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🛡️" },
      { userId: 1, categoryId: createdCategories[1].id, name: "Council Rates", budgetedAmount: "3600.00", currentBalance: "0.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🏛️" },
      
      // Lifestyle & Discretionary
      { userId: 1, categoryId: createdCategories[2].id, name: "Entertainment", budgetedAmount: "100.00", currentBalance: "75.50", budgetFrequency: "monthly", envelopeType: "expense", icon: "🎬" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Dining Out", budgetedAmount: "150.00", currentBalance: "92.30", budgetFrequency: "monthly", envelopeType: "expense", icon: "🍽️" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Hobbies", budgetedAmount: "80.00", currentBalance: "45.20", budgetFrequency: "monthly", envelopeType: "expense", icon: "🎨" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Spending Deb", budgetedAmount: "200.00", currentBalance: "89.20", budgetFrequency: "fortnightly", envelopeType: "expense", isMonitored: true, icon: "💳" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Clothing", budgetedAmount: "900.00", currentBalance: "75.00", budgetFrequency: "annually", envelopeType: "expense", icon: "👕" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Gifts", budgetedAmount: "1200.00", currentBalance: "100.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🎁" },
      { userId: 1, categoryId: createdCategories[2].id, name: "Coffee/Takeaways", budgetedAmount: "120.00", currentBalance: "89.50", budgetFrequency: "monthly", envelopeType: "expense", icon: "☕" },
      
      // Personal Care & Health
      { userId: 1, categoryId: createdCategories[3].id, name: "Healthcare", budgetedAmount: "1440.00", currentBalance: "120.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🏥" },
      { userId: 1, categoryId: createdCategories[3].id, name: "Dental", budgetedAmount: "720.00", currentBalance: "60.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🦷" },
      { userId: 1, categoryId: createdCategories[3].id, name: "Personal Care", budgetedAmount: "50.00", currentBalance: "32.75", budgetFrequency: "monthly", envelopeType: "expense", icon: "💄" },
      { userId: 1, categoryId: createdCategories[3].id, name: "Gym/Fitness", budgetedAmount: "780.00", currentBalance: "65.00", budgetFrequency: "annually", envelopeType: "expense", icon: "💪" },
      { userId: 1, categoryId: createdCategories[3].id, name: "Supplements", budgetedAmount: "360.00", currentBalance: "30.00", budgetFrequency: "annually", envelopeType: "expense", icon: "💊" },
      
      // Transportation & Travel
      { userId: 1, categoryId: createdCategories[4].id, name: "Petrol", budgetedAmount: "120.00", currentBalance: "45.75", budgetFrequency: "monthly", envelopeType: "expense", icon: "⛽" },
      { userId: 1, categoryId: createdCategories[4].id, name: "Vehicle Maintenance", budgetedAmount: "1020.00", currentBalance: "85.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🔧" },
      { userId: 1, categoryId: createdCategories[4].id, name: "Vehicle Insurance", budgetedAmount: "1200.00", currentBalance: "100.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🚗" },
      { userId: 1, categoryId: createdCategories[4].id, name: "Registration & WOF", budgetedAmount: "300.00", currentBalance: "25.00", budgetFrequency: "annually", envelopeType: "expense", icon: "📋" },
      { userId: 1, categoryId: createdCategories[4].id, name: "Travel/Holidays", budgetedAmount: "2400.00", currentBalance: "200.00", budgetFrequency: "annually", envelopeType: "expense", icon: "✈️" },
      
      // Utilities & Services
      { userId: 1, categoryId: createdCategories[5].id, name: "Banking Fees", budgetedAmount: "180.00", currentBalance: "15.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🏦" },
      { userId: 1, categoryId: createdCategories[5].id, name: "Subscriptions", budgetedAmount: "540.00", currentBalance: "35.99", budgetFrequency: "annually", envelopeType: "expense", icon: "📺" },
      { userId: 1, categoryId: createdCategories[5].id, name: "Software/Apps", budgetedAmount: "360.00", currentBalance: "19.99", budgetFrequency: "annually", envelopeType: "expense", icon: "💻" },
      { userId: 1, categoryId: createdCategories[5].id, name: "Professional Services", budgetedAmount: "600.00", currentBalance: "0.00", budgetFrequency: "annually", envelopeType: "expense", icon: "👔" },
      
      // Savings & Investments
      { userId: 1, categoryId: createdCategories[6].id, name: "Emergency Fund", budgetedAmount: "300.00", currentBalance: "1250.00", budgetFrequency: "monthly", envelopeType: "expense", icon: "🆘" },
      { userId: 1, categoryId: createdCategories[6].id, name: "House Deposit", budgetedAmount: "6000.00", currentBalance: "8500.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🏠" },
      { userId: 1, categoryId: createdCategories[6].id, name: "KiwiSaver", budgetedAmount: "1800.00", currentBalance: "150.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🥝" },
      { userId: 1, categoryId: createdCategories[6].id, name: "Investments", budgetedAmount: "2400.00", currentBalance: "200.00", budgetFrequency: "annually", envelopeType: "expense", icon: "📈" },
      { userId: 1, categoryId: createdCategories[6].id, name: "Holiday Fund", budgetedAmount: "1200.00", currentBalance: "450.00", budgetFrequency: "annually", envelopeType: "expense", icon: "🏖️" }
    ];

    for (const envelope of envelopes) {
      await storage.createEnvelope(envelope);
    }

    console.log('💰 Created demo envelopes');
    console.log('✅ Demo data initialization complete!');

  } catch (error) {
    console.error('❌ Error initializing demo data:', error);
  }
}
