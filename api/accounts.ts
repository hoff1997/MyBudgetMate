import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../server/vercel-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withAuth(async (userId, storage) => {
    switch (req.method) {
      case 'GET':
        const accounts = await storage.getAccountsByUserId(userId);
        return res.json(accounts);

      case 'POST':
        const { name, type, balance } = req.body;
        
        if (!name || !type) {
          return res.status(400).json({ message: 'Account name and type are required' });
        }

        const newAccount = await storage.createAccount({
          userId: parseInt(userId),
          name,
          type,
          balance: balance || '0',
          isActive: true
        });

        return res.status(201).json(newAccount);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  }, req, res);
}