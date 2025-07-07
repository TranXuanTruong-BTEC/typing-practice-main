"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gmail, setGmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !password || !gmail) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, gmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
      } else {
        setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch {
      setError("Lỗi kết nối server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Đăng ký tài khoản</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Tên đăng nhập</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            autoFocus
            autoComplete="username"
            maxLength={32}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Mật khẩu</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
            maxLength={32}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            maxLength={32}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Gmail phục hồi</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={gmail}
            onChange={e => setGmail(e.target.value)}
            placeholder="Nhập gmail để phục hồi tài khoản"
            autoComplete="email"
            maxLength={64}
            required
          />
        </div>
        {error && <div className="mb-3 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        <div className="mt-6 text-xs text-gray-400 text-center">
          Đã có tài khoản? <a href="/login" className="text-indigo-600 hover:underline">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
} 