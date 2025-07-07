import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../server/vercel-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withAuth(async (userId, storage) => {
    switch (req.method) {
      case 'GET':
        const envelopes = await storage.getEnvelopesByUserId(userId);
        return res.json(envelopes);

      case 'POST':
        const { name, icon, budgetedAmount, categoryId } = req.body;
        
        if (!name) {
          return res.status(400).json({ message: 'Envelope name is required' });
        }

        const newEnvelope = await storage.createEnvelope({
          name,
          icon: icon || '📁',
          budgetedAmount: budgetedAmount || '0',
          categoryId: categoryId || null,
          userId: parseInt(userId),
          currentBalance: '0',
          openingBalance: '0',
          isActive: true,
          isMonitored: false,
          isSpendingAccount: false,
          frequency: 'none',
          sortOrder: 0
        });

        return res.status(201).json(newEnvelope);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  }, req, res);
}