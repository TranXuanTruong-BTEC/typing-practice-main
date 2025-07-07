import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Thêm header CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const { title, text, category, language, difficulty } = req.body;
    const result = await db.collection('typingTexts').insertOne({ title, text, category, language, difficulty });
    res.status(200).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('API /api/add-text error:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Internal Server Error', detail: message });
  }
} 