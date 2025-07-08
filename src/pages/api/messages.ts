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
  const conversations = db.collection('conversations');

  if (req.method === 'GET') {
    // Lấy tin nhắn của hội thoại
    const { conversationId } = req.query;
    if (!conversationId) return res.status(400).json({ message: 'Thiếu conversationId' });
    const msgs = await messages.find({ conversationId: new ObjectId(conversationId as string) }).sort({ createdAt: 1 }).toArray();
    return res.status(200).json(msgs);
  }

  if (req.method === 'POST') {
    // Gửi tin nhắn mới
    const { conversationId, to, content } = req.body;
    if (!conversationId || !to || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
    const msg = {
      conversationId: new ObjectId(conversationId),
      from: new ObjectId(payload.id),
      to: new ObjectId(to),
      content,
      isRead: false,
      createdAt: new Date()
    };
    await messages.insertOne(msg);
    // Cập nhật lastMessage và updatedAt cho conversation
    await conversations.updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessage: content, updatedAt: new Date() } }
    );
    return res.status(201).json({ success: true });
  }

  if (req.method === 'PATCH') {
    // Đánh dấu đã đọc các tin nhắn trong hội thoại
    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).json({ message: 'Thiếu conversationId' });
    await messages.updateMany({ conversationId: new ObjectId(conversationId), to: new ObjectId(payload.id), isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
} 