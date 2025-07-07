import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getVercelStorage } from '../../server/vercel-storage';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-change-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password, username } = req.body;
    const storage = await getVercelStorage();

    // Demo authentication for Vercel deployment
    if (password === 'demo123' || password === 'budgetmate' || password === 'mybudgetmate') {
      let user = await storage.getUserByUsername(username || 'demo');
      
      if (!user) {
        // Create new user with basic info
        user = await storage.createUser({
          username: username || 'demo',
          password: null // No password for demo
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id.toString(), username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Use: demo123, budgetmate, or mybudgetmate' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}