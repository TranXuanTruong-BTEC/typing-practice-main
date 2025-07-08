"use client";
import React, { useEffect, useState } from "react";
import ChatPage from "../app/profile/chat/page";
import type { Conversation, Message } from "@/app/profile/chat/page";

export default function ChatFloatingWindows({
  openConversations,
  onClose,
}: {
  openConversations: { conv: Conversation, preloadMessages?: Message[] }[];
  onClose: (convId: string) => void;
}) {
  // Quản lý trạng thái thu nhỏ từng cửa sổ
  const [minimized, setMinimized] = useState<Record<string, boolean>>({});
  const [userMap, setUserMap] = useState<Record<string, any>>({});

  // Lấy userMap để hiển thị avatar, tên
  useEffect(() => {
    async function fetchUsers() {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserMap(Object.fromEntries(data.map((u: any) => [u._id, u])));
    }
    fetchUsers();
  }, []);

  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-row-reverse gap-4">
      {openConversations.map(({ conv, preloadMessages }) => {
        // Lấy user còn lại trong hội thoại
        const myId = (() => {
          const token = localStorage.getItem("user_token");
          if (!token) return "";
          try { return JSON.parse(atob(token.split(".")[1])).id; } catch { return ""; }
        })();
        const otherId = conv.members.find(id => id !== myId);
        const other = userMap[otherId || ""];
        return (
          <div
            key={conv._id}
            className={`w-96 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-fade-in ${minimized[conv._id] ? "h-12" : "h-[520px]"}`}
          >
            {/* Header Messenger style */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-blue-600 text-white select-none rounded-t-2xl">
              <div className="flex items-center gap-2">
                {other?.avatar ? (
                  <img src={other.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden border text-blue-600 font-bold text-lg">{other?.username?.[0]?.toUpperCase() || "?"}</span>
                )}
                <span className="font-semibold text-base truncate">{other?.username || "Tin nhắn"}</span>
              </div>
              <div className="flex gap-1">
                <button
                  className="text-white hover:text-gray-200 text-lg font-bold px-1"
                  onClick={e => { e.stopPropagation(); setMinimized((m) => ({ ...m, [conv._id]: !m[conv._id] })); }}
                  title={minimized[conv._id] ? "Mở rộng" : "Thu nhỏ"}
                >
                  {minimized[conv._id] ? "▢" : "_"}
                </button>
                <button
                  className="text-white hover:text-gray-200 text-lg font-bold px-1"
                  onClick={e => { e.stopPropagation(); onClose(conv._id); }}
                  title="Đóng"
                >
                  ×
                </button>
              </div>
            </div>
            {/* Nội dung chat Messenger style */}
            {!minimized[conv._id] && (
              <div className="flex-1 bg-white">
                <ChatPage conversationId={conv._id} userMap={userMap} preloadMessages={preloadMessages} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 