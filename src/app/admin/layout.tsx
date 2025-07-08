"use client";
import React, { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User2 } from "lucide-react";
import Image from "next/image";
import SendNotificationCard from '@/components/admin/SendNotificationCard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkAdmin() {
      const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
      if (!token) {
        setIsAdmin(false);
        setChecked(true);
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.role === "admin") {
          setIsAdmin(true);
          setAdminName(data.username || "Admin");
        } else {
          setIsAdmin(false);
          localStorage.removeItem("user_token");
          router.replace("/login");
        }
      } catch {
        setIsAdmin(false);
        localStorage.removeItem("user_token");
        router.replace("/login");
      }
      setChecked(true);
    }
    checkAdmin();
  }, [router, pathname]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!checked) return null;
  if (!isAdmin) return null;

  // Nếu đã đăng nhập thì render giao diện admin
  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 border-r border-blue-200 shadow-xl flex flex-col justify-between">
        <div>
          <Link href="/admin" className="flex items-center gap-2 px-6 py-6 border-b hover:bg-blue-100 transition-colors group">
            <Avatar className="group-hover:scale-110 group-hover:ring-2 group-hover:ring-blue-400 transition-transform">
              <Image src="/favicon.ico" alt="Admin" width={32} height={32} />
            </Avatar>
            <span className="font-bold text-lg group-hover:text-blue-700 transition-colors">Admin Panel</span>
          </Link>
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link href="/admin" className={`py-2 px-3 rounded-l-lg font-medium transition-all flex items-center gap-2 ${(pathname || '') === "/admin" ? "bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 text-blue-900 border-l-4 border-gradient-l" : "hover:bg-blue-100 hover:text-blue-700"}`}>Dashboard</Link>
            <Link href="/admin/texts" className={`py-2 px-3 rounded-l-lg transition-all flex items-center gap-2 ${(pathname || '').startsWith("/admin/texts") ? "bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 text-blue-900 border-l-4 border-gradient-l" : "hover:bg-blue-100 hover:text-blue-700"}`}>Quản lý văn bản</Link>
            <Link href="/admin/users" className={`py-2 px-3 rounded-l-lg transition-all flex items-center gap-2 ${(pathname || '').startsWith("/admin/users") ? "bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 text-blue-900 border-l-4 border-gradient-l" : "hover:bg-blue-100 hover:text-blue-700"}`}>Quản lý người dùng</Link>
            <Link href="/admin/history" className={`py-2 px-3 rounded-l-lg transition-all flex items-center gap-2 ${(pathname || '').startsWith("/admin/history") ? "bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 text-blue-900 border-l-4 border-gradient-l" : "hover:bg-blue-100 hover:text-blue-700"}`}>Lịch sử luyện tập</Link>
            <Link href="/admin/notifications" className={`py-2 px-3 rounded-l-lg transition-all flex items-center gap-2 ${(pathname || '').startsWith("/admin/notifications") ? "bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 text-blue-900 border-l-4 border-gradient-l" : "hover:bg-blue-100 hover:text-blue-700"}`}>Thông báo</Link>
          </nav>
        </div>
        <div className="px-6 py-4 border-t text-xs text-muted-foreground">&copy; 2024 TypingMaster</div>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-b-gradient shadow flex items-center px-8 justify-between sticky top-0 z-30">
          <h1 className="font-semibold text-xl tracking-tight">Admin Dashboard</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition-colors shadow-sm focus:outline-none"
              title="Tài khoản admin"
            >
              <User2 className="w-5 h-5" />
              <span className="max-w-[120px] truncate">{adminName}</span>
              <svg className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.4a.75.75 0 0 1-1.08 0l-4.24-4.4a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" /></svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <User2 className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">{adminName}</span>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 rounded-b-xl"
                  onClick={() => {
                    localStorage.removeItem("user_token");
                    setShowDropdown(false);
                    router.replace("/login");
                  }}
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>
        <Separator />
        <section className="flex-1 p-8 bg-muted overflow-auto">{children}</section>
      </main>
    </div>
  );
} 