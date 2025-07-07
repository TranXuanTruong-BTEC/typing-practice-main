import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const history = db.collection('history');
    const traffic = db.collection('traffic');
    // Tổng user
    const totalUsers = await users.countDocuments();
    // User đang hoạt động (lastActive trong 10 phút)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const activeUsers = await users.countDocuments({ lastActive: { $gte: tenMinutesAgo } });
    // Tổng lượt luyện tập
    const totalSessions = await history.countDocuments();
    // Lưu lượng truy cập (trong 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trafficCount = await traffic.countDocuments({ time: { $gte: oneDayAgo } });
    return res.status(200).json({ totalUsers, activeUsers, totalSessions, traffic: trafficCount });
  } catch {
    return res.status(500).json({ message: 'Lỗi server' });
  }
} 