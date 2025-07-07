import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    const history = await db.collection('typingHistory').find({}).sort({ date: -1 }).toArray();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
} 