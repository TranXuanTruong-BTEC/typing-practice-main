import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    // Tạo JWT
    const token = jwt.sign({ username: user.username, gmail: user.gmail, id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
} 