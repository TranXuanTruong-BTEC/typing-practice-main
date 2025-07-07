"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.reason) {
          setError(`${data.message}: ${data.reason}`);
        } else {
          setError(data.message || "Đăng nhập thất bại");
        }
      } else {
        localStorage.setItem("user_token", data.token);
        router.push("/"); // hoặc chuyển hướng sang dashboard user nếu có
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
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Đăng nhập</h2>
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
            autoComplete="current-password"
            maxLength={32}
            required
          />
        </div>
        {error && <div className="mb-3 text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <div className="mt-4 text-xs text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">Quên mật khẩu?</a>
        </div>
        <div className="mt-6 text-xs text-gray-400 text-center">
          Chưa có tài khoản? <a href="/register" className="text-indigo-600 hover:underline">Đăng ký</a>
        </div>
      </form>
    </div>
  );
} 