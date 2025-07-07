# TypingMaster - Nền tảng luyện gõ phím kiếm thu nhập

## 🎯 Tổng quan

TypingMaster là một trang web luyện gõ phím hiện đại được xây dựng với Next.js, TypeScript và Tailwind CSS. Trang web không chỉ giúp người dùng cải thiện kỹ năng gõ phím mà còn tạo cơ hội kiếm thu nhập thông qua quảng cáo và affiliate marketing.

## ✨ Tính năng chính

### 🎮 Luyện gõ phím
- **Đo tốc độ WPM** (Words Per Minute) chính xác
- **Tính độ chính xác** theo từng ký tự
- **Hiển thị lỗi real-time** với màu sắc trực quan
- **Tạm dừng và làm lại** bài tập
- **Nhiều ngôn ngữ**: Tiếng Việt và English

### 📚 Bài tập đa dạng
- **10+ bài tập** với nhiều chủ đề khác nhau
- **3 cấp độ**: Dễ, Trung bình, Khó
- **Chủ đề phong phú**: Công nghệ, Văn học, Tin tức, Business
- **Tìm kiếm và lọc** bài tập theo nhu cầu

### 🏆 Bảng xếp hạng
- **Top 10 người gõ nhanh nhất**
- **Lưu trữ điểm số** trong localStorage
- **Thống kê chi tiết**: WPM trung bình, độ chính xác, số lượt tham gia
- **Hiệu ứng animation** đẹp mắt

### 💰 Monetization
- **Google AdSense** integration
- **Affiliate marketing** cho bàn phím và khóa học
- **Sponsored content** areas
- **Premium features** (có thể phát triển thêm)

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt
```bash
# Clone dự án
git clone <repository-url>
cd typing-practice

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Build production
```bash
# Build dự án
npm run build

# Chạy production server
npm start
```

## 💡 Chiến lược kiếm thu nhập

### 1. Google AdSense
```javascript
// Đã tích hợp sẵn trong layout.tsx
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" />
```

**Cách setup:**
1. Đăng ký Google AdSense
2. Thay `YOUR_PUBLISHER_ID` bằng Publisher ID thật
3. Thêm ad units vào các vị trí:
   - Header banner
   - Sidebar ads
   - Inline content ads

### 2. Affiliate Marketing
**Sản phẩm phù hợp:**
- Bàn phím cơ (Logitech, Razer, Corsair)
- Khóa học gõ phím online
- Phần mềm luyện gõ phím
- Sách hướng dẫn

**Platforms:**
- Amazon Associates
- Shopee Affiliate
- Lazada Affiliate
- Tiki Affiliate

### 3. Sponsored Content
- Quảng cáo từ các trường học
- Partnership với các platform giáo dục
- Review sản phẩm liên quan

### 4. Premium Features (Tương lai)
- Bài tập nâng cao
- Thống kê chi tiết hơn
- Custom themes
- Export kết quả

## 📊 SEO & Marketing

### SEO Optimization
- ✅ Meta tags đầy đủ
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Structured data
- ✅ Sitemap (cần tạo)
- ✅ Robots.txt (cần tạo)

### Keywords chính
- "luyện gõ phím"
- "typing practice"
- "gõ phím 10 ngón"
- "WPM test"
- "tốc độ gõ phím"
- "typing speed test"

### Content Marketing
- Blog posts về kỹ thuật gõ phím
- Video tutorials
- Infographics về lợi ích gõ phím nhanh
- Case studies của người dùng

## 🔧 Cấu trúc dự án

```
typing-practice/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout chính với metadata
│   │   └── page.tsx            # Trang chủ
│   ├── components/
│   │   ├── TypingArea.tsx      # Component luyện gõ chính
│   │   ├── TextSelector.tsx    # Chọn bài luyện tập
│   │   ├── Leaderboard.tsx     # Bảng xếp hạng
│   │   └── AdBanner.tsx        # Component quảng cáo
│   ├── data/
│   │   └── typing-texts.ts     # Dữ liệu bài luyện tập
│   └── lib/
│       └── typing-utils.ts     # Utility functions
├── public/                     # Static files
└── package.json
```

## 🎨 UI/UX Features

- **Responsive design** cho mọi thiết bị
- **Dark/Light mode** (có thể thêm)
- **Smooth animations** với Framer Motion
- **Modern UI** với Tailwind CSS
- **Accessibility** friendly

## 📈 Analytics & Tracking

### Google Analytics
```javascript
// Đã tích hợp trong layout.tsx
gtag('config', 'GA_MEASUREMENT_ID');
```

### Custom Events
- Typing session start/complete
- Text selection
- Ad clicks
- User engagement metrics

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### VPS/Shared Hosting
```bash
npm run build
# Upload .next folder to server
```

## 💰 Ước tính thu nhập

### Traffic cần thiết
- **1,000 visitors/day** = ~$50-100/month
- **5,000 visitors/day** = ~$200-500/month
- **10,000 visitors/day** = ~$500-1,000/month

### Chiến lược tăng traffic
1. **SEO optimization**
2. **Social media marketing**
3. **Content marketing**
4. **Partnership với trường học**
5. **Viral content** (typing challenges)

## 🔮 Roadmap

### Phase 1 (Hiện tại)
- ✅ Core typing functionality
- ✅ Basic monetization
- ✅ Leaderboard system

### Phase 2 (Tương lai)
- 🔄 User accounts & profiles
- 🔄 Advanced statistics
- 🔄 Custom text input
- 🔄 Multiplayer typing races

### Phase 3 (Advanced)
- 🔄 AI-powered text generation
- 🔄 Voice typing practice
- 🔄 Mobile app
- 🔄 API for developers

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Liên hệ

- Email: contact@typingmaster.vn
- Website: https://typingmaster.vn
- GitHub: https://github.com/your-username/typing-practice

---

**Lưu ý**: Đây là dự án demo. Để sử dụng cho mục đích thương mại, hãy:
1. Thay đổi Google AdSense ID
2. Thêm affiliate links thật
3. Tùy chỉnh branding
4. Thêm privacy policy và terms of service
5. Setup proper analytics tracking
