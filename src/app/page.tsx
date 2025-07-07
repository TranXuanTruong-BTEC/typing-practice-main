'use client';

import React, { useState, useEffect } from 'react';
import { TypingText, getRandomText } from '@/data/typing-texts';
import { TypingStats } from '@/lib/typing-utils';
import TypingArea from '@/components/TypingArea';
import TextSelector from '@/components/TextSelector';
import Leaderboard from '@/components/Leaderboard';
import AdBanner from '@/components/AdBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Trophy, Home, User2, LogOut, History } from 'lucide-react';
import type { PracticeMode } from '@/components/TextSelector';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'selector' | 'practiceModeStep' | 'typing' | 'leaderboard'>('selector');
  const [selectedText, setSelectedText] = useState<TypingText | null>(null);
  const [currentStats, setCurrentStats] = useState<TypingStats | null>(null);
  const [resetSelector, setResetSelector] = useState(0);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>({ mode: 'full' });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('user_token');
      setIsUserLoggedIn(!!token);
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUserInfo(decoded);
        } catch {}
      } else {
        setUserInfo(null);
      }
    }
  }, []);

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

  const handleTextSelect = (text: TypingText, mode?: PracticeMode) => {
    setSelectedText(text);
    setPracticeMode(mode || { mode: 'full' });
    setCurrentView('typing');
  };

  const handleTypingComplete = (stats: TypingStats) => {
    setCurrentStats(stats);
    // Lưu lịch sử vào MongoDB
    if (selectedText) {
      fetch('/api/add-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textId: selectedText.id,
          title: selectedText.title,
          category: selectedText.category,
          language: selectedText.language,
          difficulty: selectedText.difficulty,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          timeElapsed: stats.timeElapsed,
          date: new Date().toISOString()
        })
      });
    }
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedText(null);
    setCurrentStats(null);
    setResetSelector((prev) => prev + 1);
  };

  const handleGoHome = () => {
    setCurrentView('selector');
    setSelectedText(null);
    setCurrentStats(null);
    setResetSelector((prev) => prev + 1);
  };

  const handleRandomText = () => {
    const randomText = getRandomText();
    setSelectedText(randomText);
    setCurrentView('typing');
  };

  const navigationItems = [
    { id: 'selector', label: 'Chọn bài', icon: Home },
    { id: 'typing', label: 'Luyện tập', icon: Keyboard, disabled: !selectedText },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoHome}
                className="flex items-center focus:outline-none group"
                aria-label="Về trang chủ"
              >
                <Keyboard className="w-8 h-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">TypingMaster</span>
              </button>
            </div>
            
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'selector') handleGoHome();
                      else setCurrentView(item.id as 'selector' | 'typing' | 'leaderboard');
                    }}
                    disabled={item.disabled}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
              {!isUserLoggedIn && (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors ml-2"
                  >
                    Đăng nhập
                  </a>
                  <a
                    href="/register"
                    className="px-4 py-2 bg-white border border-indigo-600 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-colors ml-2"
                  >
                    Đăng ký
                  </a>
                </>
              )}
              {isUserLoggedIn && userInfo && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition-colors shadow-sm focus:outline-none ml-2"
                  >
                    <User2 className="w-5 h-5" />
                    <span className="max-w-[120px] truncate">{userInfo.username}</span>
                    <svg className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.4a.75.75 0 0 1-1.08 0l-4.24-4.4a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" /></svg>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                        <User2 className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium">{userInfo.username}</span>
                      </div>
                      {userInfo.role === "admin" && (
                        <button
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-blue-50 transition-colors text-blue-700 font-semibold"
                          onClick={() => {
                            window.location.href = "/admin";
                            setShowDropdown(false);
                          }}
                        >
                          <Home className="w-5 h-5 text-blue-600" />
                          Dashboard
                        </button>
                      )}
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                        onClick={() => {
                          window.location.href = "/profile";
                          setShowDropdown(false);
                        }}
                      >
                        <User2 className="w-5 h-5 text-blue-500" />
                        Thông tin tài khoản
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                        onClick={() => {
                          window.location.href = "/history";
                          setShowDropdown(false);
                        }}
                      >
                        <History className="w-5 h-5 text-green-500" />
                        Lịch sử tập
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 rounded-b-xl"
                        onClick={() => {
                          localStorage.removeItem("user_token");
                          setShowDropdown(false);
                          window.location.reload();
                        }}
                      >
                        <LogOut className="w-5 h-5 text-red-500" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextSelector
                onSelectText={handleTextSelect}
                selectedText={selectedText}
                resetTrigger={resetSelector}
              />
              
              {/* Ad Banner */}
              <div className="px-6">
                <AdBanner type="banner" />
              </div>
            </motion.div>
          )}

          {currentView === 'typing' && selectedText && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                {/* Main Content */}
                <div className="flex-1">
                  <TypingArea
                    selectedText={selectedText as TypingText}
                    onComplete={handleTypingComplete}
                    practiceMode={practiceMode}
                  />
                </div>
                
                {/* Sidebar */}
                <div className="w-80 p-6 space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-gray-800 mb-3">Thao tác nhanh</h3>
                    <div className="space-y-2">
                      <button
                        onClick={handleRandomText}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Bài ngẫu nhiên
                      </button>
                      <button
                        onClick={handleBackToSelector}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Chọn bài khác
                      </button>
                    </div>
                  </div>

                  {/* Ad Sidebar */}
                  <AdBanner type="sidebar" category={selectedText.category} />
                  
                  {/* Tips */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-gray-800 mb-3">Mẹo luyện tập</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Giữ tư thế ngồi đúng</li>
                      <li>• Đặt ngón tay đúng vị trí</li>
                      <li>• Không nhìn xuống bàn phím</li>
                      <li>• Luyện tập đều đặn mỗi ngày</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard
                currentStats={currentStats}
                textTitle={selectedText?.title || ''}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">TypingMaster</h3>
              <p className="text-gray-600 text-sm">
                Nền tảng luyện gõ phím hàng đầu Việt Nam. Cải thiện tốc độ và độ chính xác gõ phím của bạn.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Tính năng</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Luyện gõ phím 10 ngón</li>
                <li>Đo tốc độ WPM</li>
                <li>Bảng xếp hạng</li>
                <li>Nhiều ngôn ngữ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Hỗ trợ</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Hướng dẫn sử dụng</li>
                <li>FAQ</li>
                <li>Liên hệ</li>
                <li>Báo lỗi</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Theo dõi</h4>
              <p className="text-sm text-gray-600 mb-3">
                Nhận thông báo về bài luyện tập mới và cập nhật.
              </p>
              <div className="flex space-x-2">
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-xs">F</span>
                </button>
                <button className="w-8 h-8 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-xs">T</span>
                </button>
                <button className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                  <span className="text-xs">Y</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2024 TypingMaster. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
