"use client";
import React, { useEffect, useState } from "react";

interface Message {
  _id: string;
  from: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      const token = localStorage.getItem("user_token");
      await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ msgId: msg._id })
      });
      setMessages(msgs => msgs.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Hòm thư</h1>
      <div className="flex gap-6">
        <div className="w-1/2 border rounded-lg bg-white shadow divide-y">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Đang tải...</div>
          ) : messages.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Không có tin nhắn nào</div>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                className={`p-4 cursor-pointer ${msg.isRead ? "bg-white" : "bg-blue-50 font-semibold"} ${selected?._id === msg._id ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => handleSelect(msg)}
              >
                <div className="text-sm text-gray-500 mb-1">Từ: {msg.from === 'admin' ? 'Admin' : msg.from}</div>
                <div className="text-base text-gray-800 truncate">{msg.subject}</div>
                <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="flex-1 border rounded-lg bg-white shadow p-6 min-h-[200px]">
          {selected ? (
            <>
              <div className="text-lg font-bold mb-2">{selected.subject}</div>
              <div className="text-sm text-gray-500 mb-4">Từ: {selected.from === 'admin' ? 'Admin' : selected.from}</div>
              <div className="mb-4 whitespace-pre-line text-gray-800">{selected.content}</div>
              <div className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</div>
            </>
          ) : (
            <div className="text-gray-400">Chọn một tin nhắn để xem nội dung</div>
          )}
        </div>
      </div>
    </div>
  );
} 