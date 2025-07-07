import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../../server/storage';
import { insertEnvelopeSchema } from '../../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getAuthenticatedUser(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userIdStr = getAuthenticatedUser(req);
  if (!userIdStr) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(userIdStr);

  try {
    switch (req.method) {
      case 'GET':
        const envelopes = await storage.getEnvelopesByUserId(userId.toString());
        return res.json(envelopes);

      case 'POST':
        const validation = insertEnvelopeSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ message: 'Invalid envelope data' });
        }
        
        const envelopeData = { ...validation.data, userId };
        const newEnvelope = await storage.createEnvelope(envelopeData);
        return res.status(201).json(newEnvelope);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Envelopes API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}