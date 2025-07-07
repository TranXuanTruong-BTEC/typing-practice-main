"use client";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  gmail: string;
  avatar?: string;
  status?: string;
  role?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banLoading, setBanLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể lấy danh sách user");
      const data = await res.json();
      setUsers(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditData({ ...user });
    setModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditData((prev) => ({ ...prev, avatar: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: editUser._id,
          gmail: editData.gmail,
          role: editData.role,
          status: editData.status,
          avatar: editData.avatar,
        }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setModalOpen(false);
      setEditUser(null);
      setEditData({});
      fetchUsers();
      toast.success("Cập nhật user thành công!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  };

  const handleBan = (user: User) => {
    setBanUser(user);
    setBanReason("");
  };

  const handleConfirmBan = async () => {
    if (!banUser) return;
    setBanLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: banUser._id,
          status: "banned",
          banReason,
        }),
      });
      if (!res.ok) throw new Error("Ban user thất bại");
      setBanUser(null);
      setBanReason("");
      fetchUsers();
      toast.success("Đã ban user thành công!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "Lỗi không xác định");
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Quản lý người dùng (Admin)</h1>
      {/* Modal xem/sửa user */}
      {modalOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300 ease-out transform animate-drop-modal"
            style={{
              animation: 'dropModal 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
              onClick={() => setModalOpen(false)}
              title="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Xem/Sửa user</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {editData.avatar ? (
                  <Image src={editData.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border" width={64} height={64} />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl border">
                    ?
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="block mt-2"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <label className="block">
                <span className="text-gray-700 font-medium">Username:</span>
                <input
                  type="text"
                  value={editData.username || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Gmail:</span>
                <input
                  type="email"
                  name="gmail"
                  value={editData.gmail || ""}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Role:</span>
                <select
                  name="role"
                  value={editData.role || "user"}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Trạng thái:</span>
                <select
                  name="status"
                  value={editData.status || "active"}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                >
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bảng user */}
      {loading ? (
        <p>Đang tải danh sách user...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left rounded-tl-xl">Avatar</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Gmail</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`border-b last:border-b-0 hover:bg-blue-50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}
                >
                  <td className="py-2 px-4">
                    {user.avatar ? (
                      <Image src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border" width={64} height={64} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg border">
                        ?
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold">{user.username}</td>
                  <td className="py-2 px-4">{user.gmail}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {user.status === 'banned' ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                      title="Xem/Sửa"
                      onClick={() => handleEdit(user)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18" /></svg>
                      Xem/Sửa
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-sm font-medium"
                      title="Ban"
                      onClick={() => handleBan(user)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M12 2v2m0 16v2m8-10h2M2 12H4" /></svg>
                      Ban
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                      title="Xóa"
                      disabled
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal ban user */}
      {banUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300 ease-out transform animate-drop-modal"
            style={{ animation: 'dropModal 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
              onClick={() => setBanUser(null)}
              title="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Ban tài khoản</h2>
            <div className="mb-4">Bạn có chắc chắn muốn ban user <b>{banUser.username}</b> không?</div>
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Lý do ban:</span>
              <textarea
                className="w-full px-3 py-2 border rounded-lg mt-1"
                rows={3}
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="Nhập lý do ban..."
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={() => setBanUser(null)}
                disabled={banLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700"
                onClick={handleConfirmBan}
                disabled={banLoading || !banReason.trim()}
              >
                {banLoading ? "Đang ban..." : "Xác nhận ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* Thêm style cho hiệu ứng drop */
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes dropModal {0% {opacity:0;transform:translateY(-60px) scale(0.98);}100% {opacity:1;transform:translateY(0) scale(1);}}`;
  if (!document.getElementById('drop-modal-style')) {
    style.id = 'drop-modal-style';
    document.head.appendChild(style);
  }
} 