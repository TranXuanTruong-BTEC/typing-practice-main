import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface JwtPayload {
  id: string;
  username: string;
  role: string;
  [key: string]: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Thiếu token' });
  let payload: JwtPayload;
  try {
    const token = auth.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
  const client = await clientPromise;
  const db = client.db();
  const notifications = db.collection('notifications');

  if (req.method === 'GET') {
    // Lấy danh sách thông báo của user, mới nhất trước
    const notiList = await notifications.find({ userId: new ObjectId(payload.id) }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(notiList);
  }

  if (req.method === 'POST') {
    // Tạo thông báo mới (chỉ admin hoặc hệ thống)
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Chỉ admin mới được gửi thông báo' });
    const { userId, type, title, content } = req.body;
    if (!userId || !type || !title || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
    const newNoti = {
      userId: new ObjectId(userId),
      type,
      title,
      content,
      isRead: false,
      createdAt: new Date()
    };
    await notifications.insertOne(newNoti);
    return res.status(201).json({ success: true });
  }

  if (req.method === 'PATCH') {
    // Đánh dấu đã đọc thông báo
    const { notiId } = req.body;
    if (!notiId) return res.status(400).json({ message: 'Thiếu notiId' });
    await notifications.updateOne({ _id: new ObjectId(notiId), userId: new ObjectId(payload.id) }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
} 