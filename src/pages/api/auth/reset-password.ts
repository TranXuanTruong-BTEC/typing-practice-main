import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
  const { token } = req.query;
  const { newPassword } = req.body;
  if (!token || typeof token !== 'string' || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new ObjectId(payload.id) : payload.id });
    if (!user || user.resetPasswordToken !== token) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    const hash = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: user._id }, { $set: { password: hash }, $unset: { resetPasswordToken: '' } });
    return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch {
    return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
} 