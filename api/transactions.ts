import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, vercelStorage } from '../server/vercel-simple-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withAuth(async (userId) => {
    switch (req.method) {
      case 'GET':
        const transactions = await vercelStorage.getTransactionsByUserId(userId);
        return res.json(transactions);

      case 'POST':
        const { merchant, amount, accountId, date, description } = req.body;
        
        if (!merchant || !amount || !accountId) {
          return res.status(400).json({ message: 'Merchant, amount, and account are required' });
        }

        const newTransaction = await vercelStorage.createTransaction({
          userId: parseInt(userId),
          accountId: parseInt(accountId),
          merchant,
          amount,
          date: date ? new Date(date) : new Date(),
          description: description || null,
          isApproved: false,
          receiptPath: null,
          bankReference: null,
          bankMemo: null,
          transactionHash: null
        });

        return res.status(201).json(newTransaction);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  }, req, res);
}