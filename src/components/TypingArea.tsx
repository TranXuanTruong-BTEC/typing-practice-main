'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TypingText } from '@/data/typing-texts';
import { TypingStats, calculateStats, formatTime, getWPMColor, getAccuracyColor, getDifficultyColor } from '@/lib/typing-utils';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Target, Clock } from 'lucide-react';

interface PracticeMode {
  mode: 'full' | 'time' | 'length';
  value?: number;
}

interface TypingAreaProps {
  selectedText: TypingText;
  onComplete: (stats: TypingStats) => void;
  practiceMode?: PracticeMode;
}

export default function TypingArea({ selectedText, onComplete, practiceMode = { mode: 'full' } }: TypingAreaProps) {
  const [typedText, setTypedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [forceCorrect, setForceCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [endReason, setEndReason] = useState<null | 'timeout' | 'completed'>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Date.now() - (startTime || 0));
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, isPaused, isCompleted, startTime]);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    const finalStats = calculateStats(selectedText.text, typedText, currentTime);
    setStats(finalStats);
    if (typedText.length >= selectedText.text.length) {
      setEndReason('completed');
    } else {
      setEndReason('timeout');
    }
    onComplete(finalStats);
  }, [selectedText.text, typedText, currentTime, onComplete]);

  useEffect(() => {
    if (practiceMode.mode === 'time' && isStarted && !isPaused && !isCompleted && practiceMode.value) {
      if (currentTime >= practiceMode.value * 1000) {
        if (!isCompleted) {
          setEndReason('timeout');
          setIsCompleted(true);
          const finalStats = calculateStats(selectedText.text, typedText, currentTime);
          setStats(finalStats);
          onComplete(finalStats);
        }
      }
    }
  }, [practiceMode, isStarted, isPaused, isCompleted, currentTime, handleComplete, selectedText.text, typedText, onComplete]);

  useEffect(() => {
    if (practiceMode.mode === 'length' && isStarted && !isCompleted && practiceMode.value) {
      if (typedText.length >= practiceMode.value) {
        setEndReason('completed');
        handleComplete();
      }
    }
  }, [practiceMode, isStarted, isCompleted, typedText.length, handleComplete]);

  const handleStart = () => {
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
      setCurrentTime(0);
    }
    setIsPaused(false);
    inputRef.current?.focus();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTypedText('');
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setStartTime(null);
    setCurrentTime(0);
    setStats(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!isStarted && value.length > 0) {
      handleStart();
    }
    if (forceCorrect) {
      const original = selectedText.text;
      let allow = true;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== original[i]) {
          allow = false;
          break;
        }
      }
      if (!allow) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }
    }
    setTypedText(value);
  };

  const renderText = () => {
    const originalChars = selectedText.text.split('');
    const typedChars = typedText.split('');

    return originalChars.map((char, index) => {
      let className = 'text-gray-700 px-1';
      let style: React.CSSProperties = {};
      if (index < typedChars.length) {
        if (typedChars[index] === char) {
          className = 'bg-green-600 text-white rounded px-1';
        } else {
          className = 'bg-red-600 text-white rounded px-1 underline underline-offset-2';
          style = { textDecorationColor: '#ef4444', textDecorationThickness: 3 };
        }
      } else if (index === typedChars.length) {
        className = 'border-b-2 border-blue-800 text-blue-800 bg-white px-1 font-bold';
      }
      return (
        <span key={index} className={className} style={style}>
          {char}
        </span>
      );
    });
  };

  const currentStats = isStarted ? calculateStats(selectedText.text, typedText, currentTime) : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedText.title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedText.difficulty)}`}>
            {selectedText.difficulty === 'easy' ? 'Dễ' : selectedText.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            {selectedText.category}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
            {selectedText.language === 'vi' ? 'Tiếng Việt' : 'English'}
          </span>
        </div>
        <div className="mt-2 text-blue-700 text-sm font-medium">
          {practiceMode.mode === 'full' && 'Chế độ: Toàn bộ nội dung'}
          {practiceMode.mode === 'time' && `Chế độ: Theo thời gian (${practiceMode.value || 60} giây)`}
          {practiceMode.mode === 'length' && `Chế độ: Theo độ dài (${practiceMode.value || 100} ký tự)`}
        </div>
      </div>

      {/* Chế độ bắt sửa lỗi */}
      <div className="mb-4 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={forceCorrect} onChange={e => setForceCorrect(e.target.checked)} />
          Bắt buộc sửa lỗi mới được gõ tiếp
        </label>
        {forceCorrect && <span className="text-xs text-red-600">(Không cho phép gõ tiếp nếu sai)</span>}
      </div>

      {/* Stats Display */}
      {isStarted && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">WPM</span>
            </div>
            <div className={`text-2xl font-bold ${getWPMColor(currentStats?.wpm || 0)}`}>
              {currentStats?.wpm || 0}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Độ chính xác</span>
            </div>
            <div className={`text-2xl font-bold ${getAccuracyColor(currentStats?.accuracy || 100)}`}>
              {currentStats?.accuracy || 100}%
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">Thời gian</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Tiến độ</div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round((typedText.length / selectedText.text.length) * 100)}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        {!isStarted ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Bắt đầu
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>
          </>
        )}
      </div>

      {/* Text Display */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="text-lg leading-relaxed font-mono">
          {renderText()}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleInputChange}
          onPaste={(e) => e.preventDefault()}
          disabled={isCompleted}
          placeholder="Bắt đầu gõ để luyện tập..."
          className={`w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-lg text-blue-700 ${shake ? 'animate-shake' : ''}`}
          spellCheck={true}
        />
      </div>

      {/* Completion Stats */}
      {isCompleted && stats && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Kết quả luyện tập</h3>
          {endReason === 'timeout' && typedText.length < selectedText.text.length && (
            <div className="mb-4 text-lg font-semibold text-yellow-200">⏰ Hết thời gian! Bạn chưa hoàn thành bài luyện tập.</div>
          )}
          {endReason === 'completed' && (
            <div className="mb-4 text-lg font-semibold text-green-200">🎉 Chúc mừng! Bạn đã hoàn thành trước thời gian. Kỷ lục mới!</div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm opacity-90">WPM</div>
              <div className="text-2xl font-bold">{stats.wpm}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Độ chính xác</div>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Thời gian</div>
              <div className="text-2xl font-bold">{formatTime(stats.timeElapsed)}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Lỗi</div>
              <div className="text-2xl font-bold">{stats.errors}</div>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
} 