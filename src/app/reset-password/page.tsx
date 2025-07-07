"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!newPass || !confirm) { setError("Vui lòng nhập đủ thông tin"); return; }
    if (newPass.length < 6) { setError("Mật khẩu mới phải từ 6 ký tự"); return; }
    if (newPass !== confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (!token) { setError("Thiếu token xác thực"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Đặt lại mật khẩu thất bại");
      else {
        setSuccess("Đặt lại mật khẩu thành công! Đang chuyển sang đăng nhập...");
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError("Lỗi kết nối server");
    }
    setLoading(false);
  };

  if (!token) return <div className="min-h-screen flex items-center justify-center text-red-500">Thiếu token xác thực!</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Đặt lại mật khẩu</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            autoFocus
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
        {error && <div className="mb-3 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
        <div className="mt-6 text-xs text-gray-400 text-center">
          Đã nhớ mật khẩu? <a href="/login" className="text-indigo-600 hover:underline">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
} 