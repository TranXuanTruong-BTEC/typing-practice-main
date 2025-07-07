'use client';

import React, { useState, useEffect } from 'react';
import { TypingStats } from '@/lib/typing-utils';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Target, Clock, Zap } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  date: string;
  textTitle: string;
}

interface LeaderboardProps {
  currentStats: TypingStats | null;
  textTitle: string;
}

export default function Leaderboard({ currentStats, textTitle }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userName, setUserName] = useState('');
  const [showAddScore, setShowAddScore] = useState(false);

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('typing-leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Save leaderboard to localStorage
  useEffect(() => {
    localStorage.setItem('typing-leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const addScore = () => {
    if (!userName.trim() || !currentStats) return;

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: userName.trim(),
      wpm: currentStats.wpm,
      accuracy: currentStats.accuracy,
      timeElapsed: currentStats.timeElapsed,
      date: new Date().toLocaleDateString('vi-VN'),
      textTitle
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10); // Keep top 10

    setLeaderboard(updatedLeaderboard);
    setUserName('');
    setShowAddScore(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-gray-400 font-bold">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-50 border-yellow-200';
      case 1:
        return 'bg-gray-50 border-gray-200';
      case 2:
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bảng xếp hạng</h2>
              <p className="text-gray-600">Top 10 người gõ nhanh nhất</p>
            </div>
            {currentStats && !showAddScore && (
              <button
                onClick={() => setShowAddScore(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm điểm số
              </button>
            )}
          </div>
        </div>

        {/* Add Score Form */}
        {showAddScore && currentStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 border-b border-gray-200 bg-blue-50"
          >
            <h3 className="text-lg font-semibold mb-4">Thêm điểm số của bạn</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">WPM</div>
                <div className="text-xl font-bold text-blue-600">{currentStats.wpm}</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">Độ chính xác</div>
                <div className="text-xl font-bold text-green-600">{currentStats.accuracy}%</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">Thời gian</div>
                <div className="text-xl font-bold text-orange-600">
                  {Math.floor(currentStats.timeElapsed / 1000)}s
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tên của bạn..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
              <button
                onClick={addScore}
                disabled={!userName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowAddScore(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có điểm số</h3>
              <p className="text-gray-500">Hoàn thành bài luyện tập để thêm điểm số vào bảng xếp hạng</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-4 rounded-lg border ${getRankColor(index)}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-4">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{entry.name}</h4>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.textTitle}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">WPM</div>
                      <div className="text-lg font-bold text-blue-600">{entry.wpm}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Độ chính xác</div>
                      <div className="text-lg font-bold text-green-600">{entry.accuracy}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Thời gian</div>
                      <div className="text-lg font-bold text-orange-600">
                        {Math.floor(entry.timeElapsed / 1000)}s
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {leaderboard.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Thống kê</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(leaderboard.reduce((sum, entry) => sum + entry.wpm, 0) / leaderboard.length)}
              </div>
              <div className="text-sm text-gray-600">WPM trung bình</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(leaderboard.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboard.length)}
              </div>
              <div className="text-sm text-gray-600">Độ chính xác TB</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {leaderboard[0]?.wpm || 0}
              </div>
              <div className="text-sm text-gray-600">WPM cao nhất</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {leaderboard.length}
              </div>
              <div className="text-sm text-gray-600">Lượt tham gia</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 