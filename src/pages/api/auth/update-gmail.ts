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
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { gmail } = req.body;
  const auth = req.headers.authorization;
  if (!gmail || !auth) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    await users.updateOne({ _id: typeof payload.id === 'string' ? new ObjectId(payload.id) : payload.id }, { $set: { gmail } });
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new ObjectId(payload.id) : payload.id });
    if (!user) {
      return res.status(500).json({ message: 'Không tìm thấy user sau khi cập nhật.' });
    }
    const newToken = jwt.sign({ username: user.username, gmail: user.gmail, id: user._id, avatar: user.avatar || null, emailVerified: !!user.emailVerified }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ message: 'Cập nhật gmail thành công', token: newToken });
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc lỗi server' });
  }
} 