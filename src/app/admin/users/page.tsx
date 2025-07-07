"use client";
import React, { useEffect, useState } from "react";

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
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Quản lý người dùng (Admin)</h1>
      {loading ? (
        <p>Đang tải danh sách user...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 600, borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Username</th>
                <th>Gmail</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ?
                      </div>
                    )}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.gmail}</td>
                  <td>{user.status || "active"}</td>
                  <td>
                    <button>Xem/Sửa</button>
                    <button style={{ marginLeft: 8 }}>Ban</button>
                    <button style={{ marginLeft: 8, color: "red" }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
} 