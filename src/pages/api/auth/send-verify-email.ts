import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Định nghĩa interface cho payload JWT
interface JwtPayload {
  id: string;
  username: string;
  role: string;
  [key: string]: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const auth = req.headers.authorization;
  if (!auth) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: typeof payload.id === 'string' ? new (require('mongodb').ObjectId)(payload.id) : payload.id });
    if (!user || !user.gmail) return res.status(400).json({ message: 'Chưa có gmail phục hồi' });
    // Sinh token xác thực
    const verifyToken = jwt.sign({ id: user._id, gmail: user.gmail }, JWT_SECRET, { expiresIn: '1d' });
    await users.updateOne({ _id: user._id }, { $set: { emailVerifyToken: verifyToken, emailVerified: false } });
    // Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });
    const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${verifyToken}`;
    await transporter.sendMail({
      from: `Typing Practice <${GMAIL_USER}>`,
      to: user.gmail,
      subject: 'Xác thực email tài khoản Typing Practice',
      html: `<p>Chào ${user.username},</p><p>Nhấn vào link sau để xác thực email phục hồi cho tài khoản của bạn:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`
    });
    return res.status(200).json({ message: 'Đã gửi email xác thực' });
  } catch (e) {
    return res.status(500).json({ message: 'Lỗi gửi email hoặc token không hợp lệ' });
  }
} 