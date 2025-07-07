import { IStorage } from './storage';
import type { User, Account, Envelope, Transaction, TransactionEnvelope, InsertUser, InsertAccount, InsertEnvelope, InsertTransaction } from '@shared/schema';

// Vercel-compatible storage using environment variables for database connection
let storage: IStorage | null = null;

export async function getVercelStorage(): Promise<IStorage> {
  if (storage) return storage;
  
  // Use environment variable to determine storage backend
  const storageType = process.env.STORAGE_TYPE || 'memory';
  
  if (storageType === 'supabase' && process.env.SUPABASE_URL) {
    const { SupabaseStorage } = await import('./supabase-storage');
    storage = new SupabaseStorage();
    return storage;
  }
  
  // Fallback to memory storage for development/testing
  const { MemStorage } = await import('./storage');
  storage = new MemStorage();
  
  // Initialize with demo data if needed
  await (storage as any).initialize?.();
  
  return storage;
}

// Helper function for Vercel serverless functions
export async function withAuth<T>(
  handler: (userId: string, storage: IStorage) => Promise<T>,
  req: any,
  res: any
): Promise<T | void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  try {
    const jwt = await import('jsonwebtoken');
    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const storage = await getVercelStorage();
    return await handler(decoded.userId, storage);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}