import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { gmail } = req.body;
  if (!gmail) return res.status(400).json({ message: 'Thiếu gmail' });
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ gmail });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản với gmail này' });
    // Sinh token reset
    const resetToken = jwt.sign({ id: user._id, gmail: user.gmail }, JWT_SECRET, { expiresIn: '30m' });
    await users.updateOne({ _id: user._id }, { $set: { resetPasswordToken: resetToken } });
    // Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });
    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: `Typing Practice <${GMAIL_USER}>`,
      to: user.gmail,
      subject: 'Khôi phục mật khẩu tài khoản Typing Practice',
      html: `<p>Chào ${user.username},</p><p>Nhấn vào link sau để đặt lại mật khẩu mới cho tài khoản của bạn (có hiệu lực trong 30 phút):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`
    });
    return res.status(200).json({ message: 'Đã gửi email khôi phục mật khẩu' });
  } catch (e) {
    return res.status(500).json({ message: 'Lỗi gửi email hoặc server' });
  }
} 