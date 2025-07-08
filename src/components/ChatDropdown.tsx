"use client";
import React, { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";

interface Conversation {
  _id: string;
  members: string[];
  lastMessage: string;
  updatedAt: string;
}
interface User {
  _id: string;
  username: string;
  gmail: string;
  avatar?: string;
}

export default function ChatDropdown({ onOpenChat }: { onOpenChat: (conv: Conversation, preloadMessages?: any[]) => void }) {
  const [show, setShow] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [myId, setMyId] = useState<string>("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const [cacheMessages, setCacheMessages] = useState<Record<string, any[]>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyId(payload.id);
      } catch {}
    }
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    setUserMap(Object.fromEntries(users.map(u => [u._id, u])));
  }, [users]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false);
      }
    }
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  const fetchConversations = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/conversations", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setConversations(data);
    // Đếm số tin nhắn chưa đọc cho từng hội thoại và preload messages
    const token2 = localStorage.getItem("user_token");
    const myId2 = token2 ? JSON.parse(atob(token2.split(".")[1])).id : "";
    const unread: Record<string, number> = {};
    const msgCache: Record<string, any[]> = {};
    for (const conv of data) {
      const resMsg = await fetch(`/api/messages?conversationId=${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const msgs = await resMsg.json();
      unread[conv._id] = msgs.filter((m: any) => m.to === myId2 && !m.isRead).length;
      msgCache[conv._id] = msgs;
    }
    setUnreadMap(unread);
    setCacheMessages(msgCache);
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setShow(v => !v)}
        aria-label="Tin nhắn"
      >
        <MessageCircle className="w-6 h-6 text-blue-600" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {totalUnread}
          </span>
        )}
      </button>
      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold text-gray-700 flex items-center justify-between">
            Tin nhắn
            <button className="text-xs text-blue-600 hover:underline" onClick={fetchConversations}>Làm mới</button>
          </div>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Chưa có hội thoại nào</div>
          ) : (
            conversations.map(conv => {
              const otherId = conv.members.find(id => id !== myId);
              const other = userMap[otherId || ""];
              return (
                <div
                  key={conv._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => { setShow(false); onOpenChat(conv, cacheMessages[conv._id]); }}
                >
                  {other?.avatar ? (
                    <img src={other.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-base">{other?.username?.[0]?.toUpperCase()}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{other?.username || "Người dùng"}</div>
                    <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                  </div>
                  {unreadMap[conv._id] > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow">{unreadMap[conv._id]}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
} 