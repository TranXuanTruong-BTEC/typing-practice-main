import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Đóng popup khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (notiId: string) => {
    const token = localStorage.getItem("user_token");
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notiId })
    });
    setNotifications(nots => nots.map(n => n._id === notiId ? { ...n, isRead: true } : n));
  };

  return (
    <div className="relative" ref={popupRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setShowPopup(v => !v)}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {showPopup && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold text-gray-700">Thông báo</div>
          {loading ? (
            <div className="p-4 text-center text-gray-400">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Không có thông báo nào</div>
          ) : (
            notifications.map(noti => (
              <div
                key={noti._id}
                className={`px-4 py-3 border-b last:border-b-0 cursor-pointer ${noti.isRead ? "bg-white" : "bg-blue-50"}`}
                onClick={() => handleMarkRead(noti._id)}
              >
                <div className="font-medium text-gray-800 mb-1">{noti.title}</div>
                <div className="text-gray-600 text-sm mb-1">{noti.content}</div>
                <div className="text-xs text-gray-400">{new Date(noti.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 