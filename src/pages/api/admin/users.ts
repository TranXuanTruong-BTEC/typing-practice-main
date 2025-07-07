import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Thiếu token' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const client = await clientPromise;
    const db = client.db();
    // Kiểm tra quyền admin từ database
    const user = await db.collection('users').findOne({ _id: typeof payload.id === 'string' ? new (require('mongodb').ObjectId)(payload.id) : payload.id });
    if (!user || user.role !== 'admin') {
      // Log truy cập trái phép
      await db.collection('adminLogs').insertOne({
        type: 'unauthorized_access',
        userId: payload.id,
        username: payload.username,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        time: new Date(),
        action: 'GET /api/admin/users',
      });
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    // Log truy cập hợp lệ
    await db.collection('adminLogs').insertOne({
      type: 'access',
      userId: user._id,
      username: user.username,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      time: new Date(),
      action: 'GET /api/admin/users',
    });
    const users = await db.collection('users')
      .find({}, { projection: { username: 1, gmail: 1, avatar: 1, status: 1, role: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(users);
  } catch (e) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
} 