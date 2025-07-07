import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { username, password, gmail } = req.body;
  if (!username || !password || !gmail) return res.status(400).json({ message: 'Thiếu thông tin' });
  if (typeof username !== 'string' || typeof password !== 'string' || typeof gmail !== 'string') return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    // Kiểm tra trùng username
    const existed = await users.findOne({ username });
    if (existed) return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại' });
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hash, gmail, createdAt: new Date() });
    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (e) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
} 