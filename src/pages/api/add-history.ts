import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('typingHistory').insertOne(req.body);
    res.status(200).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
} 