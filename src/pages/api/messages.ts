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
  const messages = db.collection('messages');

  if (req.method === 'GET') {
    // Lấy danh sách tin nhắn của user (gửi đến user)
    const msgList = await messages.find({ to: new ObjectId(payload.id) }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(msgList);
  }

  if (req.method === 'POST') {
    // Gửi tin nhắn (chỉ admin)
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Chỉ admin mới được gửi tin nhắn' });
    const { to, subject, content } = req.body;
    if (!to || !subject || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
    const newMsg = {
      from: 'admin',
      to: new ObjectId(to),
      subject,
      content,
      isRead: false,
      createdAt: new Date()
    };
    await messages.insertOne(newMsg);
    return res.status(201).json({ success: true });
  }

  if (req.method === 'PATCH') {
    // Đánh dấu đã đọc tin nhắn
    const { msgId } = req.body;
    if (!msgId) return res.status(400).json({ message: 'Thiếu msgId' });
    await messages.updateOne({ _id: new ObjectId(msgId), to: new ObjectId(payload.id) }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
} 