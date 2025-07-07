import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "TypingMaster - Luyện gõ phím 10 ngón miễn phí",
  description: "Nền tảng luyện gõ phím hàng đầu Việt Nam. Cải thiện tốc độ và độ chính xác gõ phím với các bài tập đa dạng, bảng xếp hạng và thống kê chi tiết.",
  keywords: "luyện gõ phím, typing practice, gõ phím 10 ngón, WPM, tốc độ gõ phím, typing speed test",
  authors: [{ name: "TypingMaster Team" }],
  creator: "TypingMaster",
  publisher: "TypingMaster",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://typingmaster.vn'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TypingMaster - Luyện gõ phím 10 ngón miễn phí",
    description: "Nền tảng luyện gõ phím hàng đầu Việt Nam. Cải thiện tốc độ và độ chính xác gõ phím với các bài tập đa dạng.",
    url: 'https://typingmaster.vn',
    siteName: 'TypingMaster',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TypingMaster - Luyện gõ phím 10 ngón',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TypingMaster - Luyện gõ phím 10 ngón miễn phí",
    description: "Nền tảng luyện gõ phím hàng đầu Việt Nam. Cải thiện tốc độ và độ chính xác gõ phím.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
