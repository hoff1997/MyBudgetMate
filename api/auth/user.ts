import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../../server/vercel-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return withAuth(async (userId, storage) => {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  }, req, res);
}