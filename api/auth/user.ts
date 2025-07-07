import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, vercelStorage } from '../../server/vercel-simple-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return withAuth(async (userId) => {
    const user = await vercelStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  }, req, res);
}