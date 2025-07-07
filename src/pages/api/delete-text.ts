import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
  // Cho phép cả POST và DELETE
  if (req.method !== 'DELETE' && req.method !== 'POST') return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = req.body;
    let deleteResult = null;
    try {
      // Thử xóa theo ObjectId (MongoDB _id)
      deleteResult = await db.collection('typingTexts').deleteOne({ _id: new ObjectId(id) });
    } catch {
      // Nếu id không phải ObjectId, thử xóa theo trường id (string)
      deleteResult = await db.collection('typingTexts').deleteOne({ id });
    }
    if (deleteResult && deleteResult.deletedCount > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Không tìm thấy bài tập để xóa.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
} 