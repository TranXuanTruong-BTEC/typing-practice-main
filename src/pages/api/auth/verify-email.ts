import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  if (!token || typeof token !== 'string') return res.redirect('/profile?verified=0');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new (require('mongodb').ObjectId)(payload.id) : payload.id });
    if (!user || user.emailVerifyToken !== token) return res.redirect('/profile?verified=0');
    await users.updateOne({ _id: user._id }, { $set: { emailVerified: true }, $unset: { emailVerifyToken: '' } });
    const newToken = jwt.sign({ username: user.username, gmail: user.gmail, id: user._id, avatar: user.avatar || null, emailVerified: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.redirect(`/profile?verified=1&token=${newToken}`);
  } catch (e) {
    return res.redirect('/profile?verified=0');
  }
} 