"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Loader2, User2, Mail, KeyRound, LogOut, History } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function ProfileContent() {
  // Định nghĩa interface User
  interface User {
    id: string;
    username: string;
    gmail?: string;
    avatar?: string;
    emailVerified?: boolean;
    [key: string]: unknown; // Nếu có thêm field động, có thể thu hẹp lại nếu biết rõ schema
  }

  const [user, setUser] = useState<User | null>(null);
  const [gmail, setGmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function fetchUserInfo() {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data);
      setGmail(data.gmail || "");
      setAvatar(data.avatar || null);
      setEmailVerified(!!data.emailVerified);
    } catch {}
  }

  useEffect(() => {
    fetchUserInfo();
    // Thông báo xác thực email
    if (searchParams) {
      const verified = searchParams.get("verified");
      const newToken = searchParams.get("token");
      if (verified === "1") {
        setMsg("Xác thực email thành công!");
        setEmailVerified(true);
        if (newToken) localStorage.setItem("user_token", newToken);
        fetchUserInfo();
      } else if (verified === "0") {
        setErr("Xác thực email thất bại hoặc token hết hạn!");
      }
    }
  }, [searchParams]);

  const handleUpdateGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!gmail) { setErr("Gmail không được để trống"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/auth/update-gmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ gmail })
      });
      const data = await res.json();
      if (!res.ok) setErr(data.message || "Cập nhật thất bại");
      else {
        setMsg("Cập nhật gmail thành công! Đã gửi email xác thực.");
        setEmailVerified(false);
        sendVerifyEmail();
        fetchUserInfo();
        if (data.token) localStorage.setItem("user_token", data.token);
      }
    } catch {
      setErr("Lỗi kết nối server");
    }
    setLoading(false);
  };

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!oldPass || !newPass || !confirm) { setErr("Vui lòng nhập đủ thông tin"); return; }
    if (newPass.length < 6) { setErr("Mật khẩu mới phải từ 6 ký tự"); return; }
    if (newPass !== confirm) { setErr("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) setErr(data.message || "Đổi mật khẩu thất bại");
      else {
        setMsg("Đổi mật khẩu thành công!");
        if (data.token) localStorage.setItem("user_token", data.token);
      }
    } catch {
      setErr("Lỗi kết nối server");
    }
    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Chỉ chấp nhận file ảnh'); return; }
    if (file.size > 2 * 1024 * 1024) { setErr('Ảnh tối đa 2MB'); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !avatar) return;
    setAvatarLoading(true); setErr(""); setMsg("");
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/auth/upload-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar })
      });
      const data = await res.json();
      if (!res.ok) setErr(data.message || "Upload thất bại");
      else {
        setMsg("Cập nhật avatar thành công!");
        fetchUserInfo();
        if (data.token) localStorage.setItem("user_token", data.token);
      }
    } catch {
      setErr("Lỗi kết nối server");
    }
    setAvatarLoading(false);
    setAvatarFile(null);
  };

  const sendVerifyEmail = async () => {
    setVerifyLoading(true); setErr(""); setMsg("");
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/auth/send-verify-email", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) setErr(data.message || "Gửi email xác thực thất bại");
      else setMsg("Đã gửi email xác thực. Vui lòng kiểm tra hộp thư!");
    } catch {
      setErr("Lỗi kết nối server");
    }
    setVerifyLoading(false);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Vui lòng đăng nhập để xem thông tin tài khoản.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header lớn */}
      <div className="bg-white shadow-sm border-b py-8 px-4 md:px-12 flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white text-4xl font-bold shadow overflow-hidden">
            {avatar ? (
              <Image src={avatar} alt="avatar" width={80} height={80} className="w-full h-full object-cover rounded-full" />
            ) : (
              user.username?.[0]?.toUpperCase() || <User2 className="w-10 h-10" />
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{user.username}</div>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Mail className="w-4 h-4" />
              <span>{gmail || <span className="italic text-gray-400">Chưa cập nhật gmail</span>}</span>
              {gmail && (
                emailVerified ? (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Đã xác thực</span>
                ) : (
                  <>
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Chưa xác thực</span>
                    <button
                      onClick={sendVerifyEmail}
                      className="ml-2 px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium flex items-center gap-1"
                      disabled={verifyLoading}
                      type="button"
                    >
                      {verifyLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      Gửi lại xác thực
                    </button>
                  </>
                )
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">ID: {user.id}</div>
            {/* Upload avatar */}
            <div className="mt-3 flex items-center gap-2">
              <input type="file" accept="image/*" id="avatar-upload" className="hidden" onChange={handleAvatarChange} />
              <label htmlFor="avatar-upload" className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium cursor-pointer text-xs">Chọn ảnh</label>
              {avatarFile && (
                <button
                  onClick={handleUploadAvatar}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs flex items-center gap-1"
                  disabled={avatarLoading}
                  type="button"
                >
                  {avatarLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Lưu avatar
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end gap-4">
          <button
            onClick={() => router.push("/history")}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg border border-green-200 transition-colors shadow-sm"
          >
            <History className="w-5 h-5" />
            Lịch sử tập
          </button>
          <button
            onClick={() => { localStorage.removeItem("user_token"); router.push("/"); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg border border-red-200 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 mt-8 px-4 md:px-0">
        {/* Sidebar trái */}
        <aside className="w-full md:w-64 space-y-4 mb-8 md:mb-0">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <User2 className="w-6 h-6 text-indigo-500" />
              <span className="font-semibold text-gray-700">Thông tin cá nhân</span>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-blue-500" />
              <span className="font-semibold text-gray-700">Bảo mật</span>
            </div>
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-green-500" />
              <button onClick={() => router.push("/history")} className="text-left font-semibold text-gray-700 hover:text-green-700">Lịch sử tập</button>
            </div>
            <div className="flex items-center gap-3">
              <LogOut className="w-6 h-6 text-red-500" />
              <button onClick={() => { localStorage.removeItem("user_token"); router.push("/"); }} className="text-left font-semibold text-gray-700 hover:text-red-700">Đăng xuất</button>
            </div>
          </div>
        </aside>
        {/* Nội dung chính */}
        <main className="flex-1 space-y-8">
          {/* Card thông tin cá nhân */}
          <section className="bg-white rounded-xl shadow p-8 mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><User2 className="w-5 h-5 text-indigo-500" /> Thông tin cá nhân</h3>
            <form onSubmit={handleUpdateGmail} className="max-w-md">
              <label className="block text-gray-700 mb-1 font-medium">Gmail phục hồi</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                  value={gmail}
                  onChange={e => setGmail(e.target.value)}
                  placeholder="Nhập gmail để phục hồi tài khoản"
                  autoComplete="email"
                  maxLength={64}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Cập nhật
                </button>
              </div>
            </form>
          </section>
          {/* Card bảo mật */}
          <section className="bg-white rounded-xl shadow p-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><KeyRound className="w-5 h-5 text-blue-500" /> Đổi mật khẩu</h3>
            <form onSubmit={handleChangePass} className="max-w-md">
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                value={oldPass}
                onChange={e => setOldPass(e.target.value)}
                placeholder="Mật khẩu hiện tại"
                autoComplete="current-password"
                maxLength={32}
              />
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                autoComplete="new-password"
                maxLength={32}
              />
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                autoComplete="new-password"
                maxLength={32}
              />
              {err && <div className="mb-3 text-red-500 text-sm text-center">{err}</div>}
              {msg && <div className="mb-3 text-green-600 text-sm text-center">{msg}</div>}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Đổi mật khẩu
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>}>
      <ProfileContent />
    </Suspense>
  );
} 