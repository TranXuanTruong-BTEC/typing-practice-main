import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Định nghĩa interface cho payload JWT
interface JwtPayload {
  id: string;
  username: string;
  role: string;
  [key: string]: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Thiếu token' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new ObjectId(payload.id) : payload.id });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    return res.status(200).json({
      username: user.username,
      gmail: user.gmail,
      avatar: user.avatar || null,
      emailVerified: !!user.emailVerified,
      id: user._id,
      role: user.role || "user"
    });
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
} 