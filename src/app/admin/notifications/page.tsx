"use client";
import React, { useEffect, useState, useRef } from "react";

interface User {
  _id: string;
  username: string;
  gmail: string;
}
interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifyAll, setNotifyAll] = useState(true);
  const [receiver, setReceiver] = useState("");
  const [notiTitle, setNotiTitle] = useState("");
  const [notiContent, setNotiContent] = useState("");
  const [sending, setSending] = useState(false);
  const [notiMsg, setNotiMsg] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState<Notification[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setHistory(data.filter((n: Notification) => n.type === "admin"));
  };

  useEffect(() => {
    if (userQuery.length === 0) setFilteredUsers([]);
    else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
            u.gmail.toLowerCase().includes(userQuery.toLowerCase())
        )
      );
    }
  }, [userQuery, users]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotiMsg("");
    if (!notiTitle || !notiContent || (!notifyAll && !receiver)) {
      setNotiMsg("Vui lòng nhập đủ thông tin");
      return;
    }
    if (notifyAll && !window.confirm("Bạn chắc chắn muốn gửi thông báo cho TẤT CẢ user?")) return;
    setSending(true);
    try {
      const token = localStorage.getItem("user_token");
      if (notifyAll) {
        for (const u of users) {
          await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              userId: u._id,
              type: "admin",
              title: notiTitle,
              content: notiContent
            })
          });
        }
        setNotiMsg("Đã gửi thông báo cho tất cả user!");
      } else {
        await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: receiver,
            type: "admin",
            title: notiTitle,
            content: notiContent
          })
        });
        setNotiMsg("Đã gửi thông báo cho user!");
      }
      setNotiTitle("");
      setNotiContent("");
      setReceiver("");
      setUserQuery("");
      titleRef.current?.focus();
      fetchHistory();
    } catch {
      setNotiMsg("Lỗi gửi thông báo!");
    }
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Gửi thông báo</h1>
      <form className="space-y-4" onSubmit={handleSendNotification} autoComplete="off">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" checked={notifyAll} onChange={() => setNotifyAll(true)} />
            Tất cả user
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!notifyAll} onChange={() => setNotifyAll(false)} />
            1 user cụ thể
          </label>
          {!notifyAll && (
            <div className="relative">
              <input
                type="text"
                className="border rounded px-2 py-1"
                placeholder="Tìm username hoặc email"
                value={userQuery}
                onChange={e => {
                  setUserQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                style={{ minWidth: 180 }}
                autoComplete="off"
              />
              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-50 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
                  {filteredUsers.map(u => (
                    <div
                      key={u._id}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setReceiver(u._id);
                        setUserQuery(u.username + " (" + u.gmail + ")");
                        setShowDropdown(false);
                      }}
                    >
                      {u.username} <span className="text-xs text-gray-500">({u.gmail})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <input
          ref={titleRef}
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Tiêu đề thông báo"
          value={notiTitle}
          onChange={e => setNotiTitle(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 w-full min-h-[80px]"
          placeholder="Nội dung thông báo"
          value={notiContent}
          onChange={e => setNotiContent(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
          disabled={sending}
        >
          {sending ? "Đang gửi..." : "Gửi thông báo"}
        </button>
        {notiMsg && <div className="text-sm text-green-600 mt-2">{notiMsg}</div>}
      </form>
      <div className="mt-8">
        <h2 className="font-semibold mb-2 text-lg">Lịch sử thông báo đã gửi</h2>
        <div className="max-h-64 overflow-y-auto divide-y">
          {history.length === 0 ? (
            <div className="text-gray-400 text-sm p-2">Chưa có thông báo nào</div>
          ) :
            history.slice(0, 20).map(noti => (
              <div key={noti._id} className="p-2">
                <div className="font-medium text-gray-800">{noti.title}</div>
                <div className="text-gray-600 text-sm mb-1">{noti.content}</div>
                <div className="text-xs text-gray-400">{new Date(noti.createdAt).toLocaleString()}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 