import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, vercelStorage } from '../server/vercel-simple-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withAuth(async (userId) => {
    switch (req.method) {
      case 'GET':
        const envelopes = await vercelStorage.getEnvelopesByUserId(userId);
        return res.json(envelopes);

      case 'POST':
        const { name, icon, budgetedAmount, categoryId } = req.body;
        
        if (!name) {
          return res.status(400).json({ message: 'Envelope name is required' });
        }

        const newEnvelope = await vercelStorage.createEnvelope({
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