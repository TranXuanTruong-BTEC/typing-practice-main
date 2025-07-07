'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, ShoppingCart, BookOpen } from 'lucide-react';

interface AdBannerProps {
  type: 'banner' | 'sidebar' | 'inline';
  category?: string;
}

interface AdContent {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  link: string;
  type: 'product' | 'course' | 'software';
}

export default function AdBanner({ type, category }: AdBannerProps) {
  // Mock ad content - in real implementation, this would be replaced with actual ad network code
  const getAdContent = (): AdContent => {
    const ads: AdContent[] = [
      {
        title: 'Bàn phím cơ chất lượng cao',
        description: 'Tăng tốc độ gõ phím với bàn phím cơ chuyên nghiệp',
        price: '1,200,000đ',
        originalPrice: '1,500,000đ',
        discount: '20%',
        image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Keyboard',
        link: '#',
        type: 'product'
      },
      {
        title: 'Khóa học gõ phím 10 ngón',
        description: 'Học gõ phím nhanh và chính xác chỉ trong 30 ngày',
        price: '299,000đ',
        originalPrice: '599,000đ',
        discount: '50%',
        image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Course',
        link: '#',
        type: 'course'
      },
      {
        title: 'Phần mềm luyện gõ phím Pro',
        description: 'Công cụ luyện tập chuyên nghiệp với 1000+ bài tập',
        price: '199,000đ',
        originalPrice: '399,000đ',
        discount: '50%',
        image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Software',
        link: '#',
        type: 'software'
      }
    ];

    // Filter by category if provided
    if (category) {
      const categoryAds = ads.filter(ad => 
        category.toLowerCase().includes('công nghệ') && ad.type === 'product' ||
        category.toLowerCase().includes('văn học') && ad.type === 'course' ||
        category.toLowerCase().includes('tin tức') && ad.type === 'software'
      );
      return categoryAds.length > 0 ? categoryAds[0] : ads[0];
    }

    return ads[Math.floor(Math.random() * ads.length)];
  };

  // Sửa lỗi hydration: chỉ render ad khi đã ở client
  const [ad, setAd] = React.useState<AdContent | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setAd(getAdContent());
    // eslint-disable-next-line
  }, []);

  if (!isClient || !ad) return null;

  const handleAdClick = () => {
    // Track ad click for analytics
    console.log('Ad clicked:', ad.title);
    // In real implementation, this would track with Google Analytics or similar
  };

  if (type === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                Quảng cáo
              </span>
              <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-medium">
                {ad.discount} giảm giá
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
            <p className="text-blue-100 mb-3">{ad.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{ad.price}</span>
              <span className="text-blue-200 line-through">{ad.originalPrice}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              {ad.type === 'product' && <ShoppingCart className="w-8 h-8" />}
              {ad.type === 'course' && <BookOpen className="w-8 h-8" />}
              {ad.type === 'software' && <Star className="w-8 h-8" />}
            </div>
            <button
              onClick={handleAdClick}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Xem ngay
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="text-center mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            Quảng cáo
          </span>
        </div>
        <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          {ad.type === 'product' && <ShoppingCart className="w-8 h-8 text-gray-400" />}
          {ad.type === 'course' && <BookOpen className="w-8 h-8 text-gray-400" />}
          {ad.type === 'software' && <Star className="w-8 h-8 text-gray-400" />}
        </div>
        <h4 className="font-semibold text-gray-800 mb-1">{ad.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-blue-600">{ad.price}</span>
          <span className="text-xs text-gray-500 line-through">{ad.originalPrice}</span>
        </div>
        <button
          onClick={handleAdClick}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Mua ngay
        </button>
      </div>
    );
  }

  // Inline ad
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          {ad.type === 'product' && <ShoppingCart className="w-6 h-6 text-blue-600" />}
          {ad.type === 'course' && <BookOpen className="w-6 h-6 text-blue-600" />}
          {ad.type === 'software' && <Star className="w-6 h-6 text-blue-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">Quảng cáo</span>
            <span className="px-1 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">
              {ad.discount}
            </span>
          </div>
          <h4 className="font-medium text-gray-800">{ad.title}</h4>
          <p className="text-sm text-gray-600">{ad.description}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-blue-600">{ad.price}</div>
          <button
            onClick={handleAdClick}
            className="text-xs text-blue-600 hover:underline"
          >
            Xem chi tiết →
          </button>
        </div>
      </div>
    </div>
  );
} 