"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [gmail, setGmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!gmail) { setError("Vui lòng nhập gmail phục hồi"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail })
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Gửi email thất bại");
      else {
        setSuccess("Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!");
        setTimeout(() => router.push("/login"), 3000);
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
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Quên mật khẩu</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Gmail phục hồi</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={gmail}
            onChange={e => setGmail(e.target.value)}
            placeholder="Nhập gmail đã đăng ký"
            autoFocus
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
          {loading ? "Đang gửi..." : "Gửi email khôi phục"}
        </button>
        <div className="mt-6 text-xs text-gray-400 text-center">
          Đã nhớ mật khẩu? <a href="/login" className="text-indigo-600 hover:underline">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
} 