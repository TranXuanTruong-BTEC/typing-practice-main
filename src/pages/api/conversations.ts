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
  const conversations = db.collection('conversations');

  if (req.method === 'GET') {
    // Lấy danh sách hội thoại của user
    const convs = await conversations.find({ members: new ObjectId(payload.id) }).sort({ updatedAt: -1 }).toArray();
    return res.status(200).json(convs);
  }

  if (req.method === 'POST') {
    // Tạo hội thoại mới giữa 2 user (nếu chưa có)
    const { otherUserId } = req.body;
    if (!otherUserId) return res.status(400).json({ message: 'Thiếu user nhận' });
    const members = [new ObjectId(payload.id), new ObjectId(otherUserId)].sort((a, b) => a.toString().localeCompare(b.toString()));
    let conv = await conversations.findOne({ members });
    if (!conv) {
      conv = {
        members,
        lastMessage: '',
        updatedAt: new Date()
      };
      const result = await conversations.insertOne(conv);
      conv._id = result.insertedId;
    }
    return res.status(200).json(conv);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
} 