import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
  const { oldPassword, newPassword } = req.body;
  const auth = req.headers.authorization;
  if (!oldPassword || !newPassword || !auth) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new (require('mongodb').ObjectId)(payload.id) : payload.id });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    const hash = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: user._id }, { $set: { password: hash } });
    const updatedUser = await users.findOne({ _id: user._id });
    const newToken = jwt.sign({ username: updatedUser.username, gmail: updatedUser.gmail, id: updatedUser._id, avatar: updatedUser.avatar || null, emailVerified: !!updatedUser.emailVerified }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ message: 'Đổi mật khẩu thành công', token: newToken });
  } catch (e) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc lỗi server' });
  }
} 