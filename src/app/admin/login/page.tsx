"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PHONE_HASH = "MDM5NDE2NDg1Nw=="; // base64 của 0394164857
const ADMIN_PASS_HASH = "dHJ1b25nMTgwNTIwMDE="; // base64 của truong18052001

function encodeBase64(str: string) {
  if (typeof window !== "undefined") {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return "";
}

export default function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (
      encodeBase64(phone) === ADMIN_PHONE_HASH &&
      encodeBase64(password) === ADMIN_PASS_HASH
    ) {
      localStorage.setItem("admin_logged_in", "1");
      localStorage.setItem("admin_name", phone);
      router.push("/admin");
    } else {
      setError("Số điện thoại hoặc mật khẩu không đúng!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Đăng nhập Admin</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Số điện thoại</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            autoFocus
            autoComplete="username"
            maxLength={20}
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
      </form>
    </div>
  );
} 