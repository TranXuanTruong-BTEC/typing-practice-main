'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TypingText } from '@/data/typing-texts';
import { getDifficultyColor } from '@/lib/typing-utils';
import { motion } from 'framer-motion';
import { Search, BookOpen, Globe, Zap } from 'lucide-react';

export interface PracticeMode {
  mode: 'full' | 'time' | 'length';
  value?: number;
}

interface TextSelectorProps {
  onSelectText: (text: TypingText, practiceMode?: PracticeMode) => void;
  selectedText: TypingText | null;
  resetTrigger?: number;
}

export default function TextSelector({ onSelectText, selectedText, resetTrigger }: TextSelectorProps) {
  const [typingTexts, setTypingTexts] = useState<TypingText[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    fetch('/api/texts')
      .then(res => res.json())
      .then(data => {
        setTypingTexts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
  }, [resetTrigger]);

  const categories = useMemo(() => {
    const cats = [...new Set(typingTexts.map(text => text.category))];
    return cats;
  }, [typingTexts]);

  const languageOptions = useMemo(() => {
    const langs = Array.from(new Set(typingTexts.map(text => text.language)));
    return langs;
  }, [typingTexts]);

  const languageLabels: Record<string, string> = {
    vi: 'Tiếng Việt',
    en: 'English',
    jp: '日本語',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    de: 'Deutsch',
    ru: 'Русский',
    it: 'Italiano',
    ko: '한국어'
  };

  // Thêm hàm loại bỏ dấu tiếng Việt
  function removeVietnameseTones(str: string) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  const filteredTexts = useMemo(() => {
    let filtered = typingTexts;
    if (searchTerm) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase().trim());
      filtered = filtered.filter(text => {
        const fields = [
          text.title,
          text.text,
          text.category,
          text.language,
          text.difficulty
        ].map(val => removeVietnameseTones(String(val).toLowerCase()));
        return fields.some(val => val.includes(normalizedSearch));
      });
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(text => text.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(text => text.difficulty === selectedDifficulty);
    }
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(text => text.language === selectedLanguage);
    }
    return filtered;
  }, [typingTexts, searchTerm, selectedCategory, selectedDifficulty, selectedLanguage]);

  const handleTextSelect = (text: TypingText) => {
    onSelectText(text);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Luyện gõ phím</h1>
        <p className="text-gray-600">Chọn bài luyện tập phù hợp với trình độ của bạn</p>
      </div>
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài luyện tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
            />
          </div>
          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-blue-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
              data-cy="category-select"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="inline w-4 h-4 mr-1" />
              Độ khó
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
              data-cy="difficulty-select"
            >
              <option value="all">Tất cả độ khó</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-1" />
              Ngôn ngữ
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
              data-cy="language-select"
            >
              <option value="all">Tất cả ngôn ngữ</option>
              {languageOptions.map(lang => (
                <option key={lang} value={lang}>{languageLabels[lang] || lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold">{filteredTexts.length}</span> bài luyện tập
        </p>
      </div>
      {/* Text List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTexts.map((text, index) => {
          const key = (text as { _id?: string; id?: string })._id || text.id || index;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleTextSelect(text)}
              className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                selectedText?.id === text.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{text.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(text.difficulty)}`}
                    key={`difficulty-${key}`}
                  >
                    {text.difficulty === 'easy' ? 'Dễ' : text.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
                    key={`category-${key}`}
                  >
                    {text.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium"
                    key={`lang-${key}`}
                  >
                    {languageLabels[text.language] || text.language}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {text.text.substring(0, 100)}...
              </p>
              <span key={`len-${key}`}>{text.text.length} ký tự</span>
              <span key={`words-${key}`}>{text.text.split(' ').length} từ</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 