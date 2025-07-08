"use client";
import React, { useEffect, useState, useRef } from "react";

export interface Conversation {
  _id: string;
  members: string[];
  lastMessage: string;
  updatedAt: string;
}
export interface Message {
  _id?: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  error?: boolean; // Thêm trạng thái lỗi
}
export interface User {
  _id: string;
  username: string;
  gmail: string;
  avatar?: string;
}

export default function ChatPage({ conversationId, userMap: userMapProp, preloadMessages }: { conversationId?: string, userMap?: Record<string, User>, preloadMessages?: Message[] }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(preloadMessages || []);
  const [hasFetched, setHasFetched] = useState(!!preloadMessages);
  const [users, setUsers] = useState<User[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>(userMapProp || {});
  const [newMsg, setNewMsg] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(!preloadMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [myId, setMyId] = useState<string>("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const pollingConvRef = useRef<NodeJS.Timeout | null>(null);
  const pollingMsgRef = useRef<NodeJS.Timeout | null>(null);
  const [sending, setSending] = useState(false);
  const [pendingMsgs, setPendingMsgs] = useState<Message[]>([]);

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyId(payload.id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!userMapProp) setUserMap(Object.fromEntries(users.map(u => [u._id, u])));
  }, [users, userMapProp]);

  useEffect(() => {
    if (searchUser.length === 0) setFilteredUsers([]);
    else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u._id !== myId &&
            (u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
              u.gmail.toLowerCase().includes(searchUser.toLowerCase()))
        )
      );
    }
  }, [searchUser, users, myId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling hội thoại: luôn chạy
  useEffect(() => {
    fetchConversations();
    if (pollingConvRef.current) clearInterval(pollingConvRef.current);
    pollingConvRef.current = setInterval(() => {
      fetchConversations();
    }, 1500);
    return () => {
      if (pollingConvRef.current) clearInterval(pollingConvRef.current);
    };
  }, []);

  // Polling tin nhắn: chỉ khi mở hội thoại
  useEffect(() => {
    if (!selectedConv) return;
    fetchMessages(selectedConv._id, true); // chỉ show loading khi chuyển hội thoại
    if (pollingMsgRef.current) clearInterval(pollingMsgRef.current);
    pollingMsgRef.current = setInterval(() => {
      fetchMessages(selectedConv._id, false); // không show loading khi polling
    }, 1500);
    return () => {
      if (pollingMsgRef.current) clearInterval(pollingMsgRef.current);
    };
  }, [selectedConv]);

  // Nếu có conversationId, tự động chọn hội thoại đó
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c._id === conversationId);
      if (conv) setSelectedConv(conv);
    }
  }, [conversationId, conversations]);

  // Khi đổi hội thoại, reset badge chưa đọc
  useEffect(() => {
    if (selectedConv) {
      setUnreadMap(map => ({ ...map, [selectedConv._id]: 0 }));
    }
  }, [selectedConv]);

  // Khi conversationId đổi, nếu có preloadMessages thì ưu tiên, không loading
  useEffect(() => {
    if (preloadMessages && preloadMessages.length > 0) {
      setMessages(preloadMessages);
      setLoadingMsg(false);
      setHasFetched(true);
    } else if (!hasFetched) {
      setLoadingMsg(true);
    }
    // eslint-disable-next-line
  }, [conversationId]);

  const fetchConversations = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/conversations", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { setConversations([]); return; }
    const data = await res.json();
    if (!Array.isArray(data)) { setConversations([]); return; }
    setConversations(data);
    // Đếm số tin nhắn chưa đọc cho từng hội thoại
    const token2 = localStorage.getItem("user_token");
    const myId2 = token2 ? JSON.parse(atob(token2.split(".")[1])).id : "";
    const unread: Record<string, number> = {};
    for (const conv of data) {
      const resMsg = await fetch(`/api/messages?conversationId=${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resMsg.ok) { unread[conv._id] = 0; continue; }
      const msgs: Message[] = await resMsg.json();
      if (!Array.isArray(msgs)) { unread[conv._id] = 0; continue; }
      unread[conv._id] = msgs.filter((m: Message) => m.to === myId2 && !m.isRead).length;
    }
    setUnreadMap(unread);
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { setUsers([]); return; }
    const data = await res.json();
    if (!Array.isArray(data)) { setUsers([]); return; }
    setUsers(data);
  };

  const fetchMessages = async (conversationId: string, showLoading = false) => {
    if (showLoading) setLoadingMsg(true);
    const token = localStorage.getItem("user_token");
    const res = await fetch(`/api/messages?conversationId=${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { setMessages([]); if (showLoading) setLoadingMsg(false); return; }
    const data: Message[] = await res.json();
    if (!Array.isArray(data)) { setMessages([]); if (showLoading) setLoadingMsg(false); return; }
    setMessages(prev => {
      if (
        prev.length !== data.length ||
        data.some((msg: Message, i: number) =>
          !prev[i] || prev[i]._id !== msg._id || prev[i].content !== msg.content || prev[i].createdAt !== msg.createdAt
        )
      ) {
        return data;
      }
      return prev;
    });
    if (showLoading) setLoadingMsg(false);
    // Đánh dấu đã đọc
    await fetch("/api/messages", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ conversationId })
    });
    fetchConversations();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedConv) return;
    const token = localStorage.getItem("user_token");
    const to = selectedConv.members.find((id) => id !== myId);
    const tempId = `pending-${Date.now()}`;
    const optimisticMsg: Message = {
      _id: tempId,
      conversationId: selectedConv._id,
      from: myId,
      to: to || "",
      content: newMsg,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setPendingMsgs((prev) => [...prev, optimisticMsg]);
    setNewMsg("");
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId: selectedConv._id, to, content: optimisticMsg.content })
      });
      if (res.ok) {
        // Lấy lại messages từ server để đồng bộ
        await fetchMessages(selectedConv._id);
      } else {
        // Đánh dấu lỗi gửi
        setPendingMsgs((prev) => prev.map(m => m._id === tempId ? { ...m, error: true } : m));
      }
    } catch {
      setPendingMsgs((prev) => prev.map(m => m._id === tempId ? { ...m, error: true } : m));
    }
    setSending(false);
  };

  const handleCreateConversation = async (userId: string) => {
    const token = localStorage.getItem("user_token");
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ otherUserId: userId })
    });
    const conv = await res.json();
    setSelectedConv(conv);
    fetchConversations();
    setShowUserDropdown(false);
    setSearchUser("");
  };

  // Hiển thị messages + pendingMsgs (pending ở cuối, không trùng _id)
  const allMessages = [...messages, ...pendingMsgs.filter(pm => !messages.some(m => m._id === pm._id))];

  return (
    <div className="flex h-full w-full bg-white" style={{minWidth: 340, minHeight: 400}}>
      {/* Sidebar hội thoại trái: chỉ hiện nếu không có conversationId */}
      {!conversationId && (
        <aside className="w-20 bg-white border-r flex flex-col items-center py-2 gap-2 overflow-y-auto">
          <button
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center mb-2 shadow-md transition-all"
            title="Nhắn tin mới"
            onClick={() => setShowUserDropdown(v => !v)}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
          </button>
          {showUserDropdown && (
            <div className="absolute left-28 top-8 z-50 bg-white border rounded-xl shadow-lg w-64 p-3">
              <input
                type="text"
                className="border rounded-lg px-3 py-2 w-full text-sm mb-2"
                placeholder="Tìm username hoặc email"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredUsers.map(u => (
                  <div
                    key={u._id}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleCreateConversation(u._id)}
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">{u.username[0]?.toUpperCase()}</span>
                    )}
                    <span className="font-medium text-gray-800 text-sm">{u.username}</span>
                    <span className="text-xs text-gray-400">({u.gmail})</span>
                  </div>
                ))}
                {filteredUsers.length === 0 && <div className="text-gray-400 text-xs px-2 py-1">Không tìm thấy</div>}
              </div>
            </div>
          )}
          {conversations.length === 0 ? (
            <div className="text-gray-400 text-xs mt-4">Chưa có hội thoại</div>
          ) : (
            conversations.map(conv => {
              const otherId = conv.members.find(id => id !== myId);
              const other = userMap[otherId || ""];
              return (
                <div
                  key={conv._id}
                  className={`relative w-14 h-14 flex flex-col items-center justify-center mb-1 cursor-pointer group ${selectedConv?._id === conv._id ? "bg-blue-100" : "hover:bg-gray-100"} rounded-xl transition-all border-2 ${selectedConv?._id === conv._id ? "border-blue-500" : "border-transparent"}`}
                  onClick={() => setSelectedConv(conv)}
                >
                  {other?.avatar ? (
                    <img src={other.avatar} alt="avatar" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow group-hover:border-blue-400" />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg border-2 border-white shadow group-hover:border-blue-400">{other?.username?.[0]?.toUpperCase()}</span>
                  )}
                  <span className="text-xs text-gray-700 font-medium truncate w-full text-center mt-1">{other?.username?.split(" ")[0] || "?"}</span>
                  {unreadMap[conv._id] > 0 && (
                    <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold shadow">{unreadMap[conv._id]}</span>
                  )}
                </div>
              );
            })
          )}
        </aside>
      )}
      {/* Khung chat Messenger style */}
      <main className="flex-1 flex flex-col bg-white relative">
        {selectedConv ? (
          <>
            {/* Header tên người dùng phía dưới header xanh: chỉ render nếu không có conversationId */}
            {!conversationId && (
              <div className="flex items-center gap-3 border-b px-5 py-3 bg-white shadow-sm">
                {(() => {
                  const otherId = selectedConv?.members.find(id => id !== myId);
                  const other = userMap[otherId || ""];
                  return (
                    <>
                      {other?.avatar ? (
                        <img src={other.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-base">{other?.username?.[0]?.toUpperCase()}</span>
                      )}
                      <span className="font-semibold text-base text-gray-900">{other?.username || "Người dùng"}</span>
                    </>
                  );
                })()}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-white custom-scrollbar">
              {allMessages.length === 0 && loadingMsg ? (
                <div className="text-gray-400 text-center py-8">Đang tải tin nhắn...</div>
              ) : allMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-8">Chưa có tin nhắn nào</div>
              ) : (
                allMessages.map(msg => (
                  <div
                    key={msg._id || msg.createdAt}
                    className={`mb-1 flex ${msg.from === myId ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`rounded-2xl px-3 py-1.5 max-w-[55%] shadow-sm text-sm ${msg.from === myId ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} ${msg.error ? "border border-red-500" : ""}`} style={{wordBreak: 'break-word', opacity: msg._id?.toString().startsWith('pending-') ? 0.6 : 1}}>
                      {msg.content}
                      <div className="text-[10px] text-gray-300 mt-0.5 text-right leading-none">
                        {msg.error ? <span className="text-red-500">Lỗi gửi</span> : new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="flex gap-2 px-4 py-3 border-t bg-white sticky bottom-0" onSubmit={handleSend} autoComplete="off">
              <input
                type="text"
                className="flex-1 border-none bg-gray-100 rounded-2xl px-4 py-2 shadow focus:ring-2 focus:ring-blue-200 text-sm"
                placeholder="Nhập tin nhắn..."
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                autoFocus
                style={{outline: 'none'}}
              />
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 shadow text-sm"
                disabled={sending || !newMsg.trim()}
              >
                {sending ? "Đang gửi..." : "Gửi"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-base select-none">
            Chọn hội thoại hoặc nhắn tin mới để bắt đầu trò chuyện
          </div>
        )}
      </main>
    </div>
  );
} 