import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb', // Giới hạn ảnh 2MB
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { avatar } = req.body;
  const auth = req.headers.authorization;
  if (!avatar || !auth) return res.status(400).json({ message: 'Thiếu thông tin' });
  if (typeof avatar !== 'string' || !avatar.startsWith('data:image/')) return res.status(400).json({ message: 'Ảnh không hợp lệ' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    await users.updateOne({ _id: typeof payload.id === 'string' ? new (require('mongodb').ObjectId)(payload.id) : payload.id }, { $set: { avatar } });
    return res.status(200).json({ avatar });
  } catch (e) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc lỗi server' });
  }
} 