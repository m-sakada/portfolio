import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Web Developer",
    template: "%s | Portfolio",
  },
  description: "Web開発者のポートフォリオサイト。実績、経歴、スキルを紹介しています。",
  keywords: ["ポートフォリオ", "Web開発", "フロントエンド", "Next.js", "TypeScript"],
  authors: [{ name: "Portfolio Owner" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Portfolio",
    title: "Portfolio | Web Developer",
    description: "Web開発者のポートフォリオサイト。実績、経歴、スキルを紹介しています。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Web Developer",
    description: "Web開発者のポートフォリオサイト。実績、経歴、スキルを紹介しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
