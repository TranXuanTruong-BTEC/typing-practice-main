"use client";
import React, { useEffect, useState } from "react";
import { BookText, Layers, Languages, BarChart3 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useRouter } from "next/navigation";

const CARD_STYLE = "flex items-center gap-4 bg-white rounded-xl shadow p-6 min-w-[180px] flex-1 border border-gray-100";
const COLORS = ["#3b82f6", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#6366f1", "#f87171", "#10b981", "#f59e42", "#818cf8"];

interface TypingText {
  id?: string;
  title?: string;
  text?: string;
  category?: string;
  language?: string;
  difficulty?: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [texts, setTexts] = useState<TypingText[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalSessions: 0, traffic: 0 });

  useEffect(() => {
    fetchRecentTexts();
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentTexts = async () => {
    try {
      const res = await fetch("/api/texts");
      if (!res.ok) return;
      const data = await res.json();
      setTexts(Array.isArray(data) ? data : (data.texts || []));
    } catch {}
  };

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
  }

  // Thống kê theo thể loại
  const categoryStats = Object.entries(
    texts.reduce((acc, t) => {
      if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Thống kê theo ngôn ngữ
  const languageStats = Object.entries(
    texts.reduce((acc, t) => {
      if (t.language) acc[t.language] = (acc[t.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Thống kê theo độ khó
  const difficultyStats = Object.entries(
    texts.reduce((acc, t) => {
      if (t.difficulty) acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Top 3 thể loại/ngôn ngữ
  const topCategories = [...categoryStats].sort((a, b) => b.value - a.value).slice(0, 3);
  const topLanguages = [...languageStats].sort((a, b) => b.value - a.value).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      <h2 className="font-bold text-3xl mb-8 mt-2">Dashboard Quản trị</h2>
      {/* Card thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-10">
        <div className={CARD_STYLE}>
          <BookText className="w-8 h-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold">{texts.length}</div>
            <div className="text-gray-500 text-sm">Bài tập</div>
          </div>
        </div>
        <div className={CARD_STYLE}>
          <Layers className="w-8 h-8 text-purple-500" />
          <div>
            <div className="text-2xl font-bold">{categoryStats.length}</div>
            <div className="text-gray-500 text-sm">Thể loại</div>
          </div>
        </div>
        <div className={CARD_STYLE}>
          <Languages className="w-8 h-8 text-pink-500" />
          <div>
            <div className="text-2xl font-bold">{languageStats.length}</div>
            <div className="text-gray-500 text-sm">Ngôn ngữ</div>
          </div>
        </div>
        <div className={CARD_STYLE}>
          <BarChart3 className="w-8 h-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-gray-500 text-sm">Lượt luyện tập</div>
          </div>
        </div>
        {/* --- Card real-time user/traffic --- */}
        <div className={CARD_STYLE}>
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m6-2.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm6 2.13A4 4 0 0 0 17 20m0 0a4 4 0 0 0-3-3.87" /></svg>
          <div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-gray-500 text-sm">Tổng user</div>
          </div>
        </div>
        <div className={CARD_STYLE}>
          <svg className="w-8 h-8 text-lime-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" /></svg>
          <div>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <div className="text-gray-500 text-sm">User đang hoạt động</div>
          </div>
        </div>
        <div className={CARD_STYLE}>
          <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 15l3-3 4 4 5-5" /></svg>
          <div>
            <div className="text-2xl font-bold">{stats.traffic}</div>
            <div className="text-gray-500 text-sm">Lưu lượng truy cập 24h</div>
          </div>
        </div>
      </div>
      {/* Biểu đồ & thống kê nâng cao */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <h3 className="font-semibold text-lg mb-4">Biểu đồ số bài tập theo thể loại</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryStats}>
              <XAxis dataKey="name" fontSize={13} />
              <YAxis allowDecimals={false} fontSize={13} />
              <RTooltip />
              <Bar dataKey="value" fill="#6366f1">
                {categoryStats.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <h3 className="font-semibold text-lg mb-4">Tỷ lệ ngôn ngữ sử dụng</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={languageStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {languageStats.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <h3 className="font-semibold text-lg mb-4">Top 3 thể loại</h3>
          <ul className="space-y-2">
            {topCategories.length === 0 && <li className="text-gray-400">Chưa có dữ liệu</li>}
            {topCategories.map((cat, idx) => (
              <li key={cat.name} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{background: COLORS[idx % COLORS.length]}}>{idx+1}</span>
                <span className="font-medium">{cat.name}</span>
                <span className="ml-auto text-gray-500">{cat.value} bài tập</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <h3 className="font-semibold text-lg mb-4">Top 3 ngôn ngữ</h3>
          <ul className="space-y-2">
            {topLanguages.length === 0 && <li className="text-gray-400">Chưa có dữ liệu</li>}
            {topLanguages.map((lang, idx) => (
              <li key={lang.name} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{background: COLORS[idx % COLORS.length]}}>{idx+1}</span>
                <span className="font-medium">{lang.name}</span>
                <span className="ml-auto text-gray-500">{lang.value} bài tập</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-10">
        <h3 className="font-semibold text-lg mb-4">Số lượng bài tập theo độ khó</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-2 px-3 text-left font-semibold">Độ khó</th>
              <th className="py-2 px-3 text-left font-semibold">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {difficultyStats.length === 0 && <tr><td colSpan={2} className="text-gray-400 py-3">Chưa có dữ liệu</td></tr>}
            {difficultyStats.map((dif, idx) => (
              <tr key={dif.name} className="border-b last:border-b-0">
                <td className="py-2 px-3">{dif.name}</td>
                <td className="py-2 px-3">{dif.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Bảng bài tập mới nhất */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">5 bài tập mới nhất</h3>
          <Link href="/admin/texts" className="text-blue-600 text-sm hover:underline">Xem tất cả</Link>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-2 px-3 text-left font-semibold">Tiêu đề</th>
              <th className="py-2 px-3 text-left font-semibold">Thể loại</th>
              <th className="py-2 px-3 text-left font-semibold">Ngôn ngữ</th>
              <th className="py-2 px-3 text-left font-semibold">Độ khó</th>
            </tr>
          </thead>
          <tbody>
            {texts.length === 0 && (
              <tr><td colSpan={4} className="text-center text-gray-400 py-4">Chưa có dữ liệu</td></tr>
            )}
            {texts.slice(-5).reverse().map((text) => (
              <tr key={text._id} className="border-b last:border-b-0 hover:bg-blue-50/40 transition-colors">
                <td className="py-2 px-3 font-medium text-gray-900 align-top max-w-[160px] truncate" title={text.title}>{text.title}</td>
                <td className="py-2 px-3 text-gray-700 align-top">{text.category || '-'}</td>
                <td className="py-2 px-3 text-gray-700 align-top">{text.language || '-'}</td>
                <td className="py-2 px-3 text-gray-700 align-top">{text.difficulty || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 