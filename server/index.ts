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
