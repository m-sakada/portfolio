import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/microcms";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();
  const name = settings?.name || "Portfolio Owner";
  const title = `${name} | ポートフォリオサイト`;
  const description = `${currentYear}年現在の${name}のポートフォリオサイトです。経験サイト、経歴、スキルを記載しています。`;

  return {
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    authors: [{ name }],
    icons: settings?.favicon?.url ? {
      icon: settings.favicon.url,
      shortcut: settings.favicon.url,
      apple: settings.favicon.url,
    } : undefined,
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: title,
      title,
      description,
      images: settings?.mvImage?.url ? [
        {
          url: settings.mvImage.url,
          width: settings.mvImage.width,
          height: settings.mvImage.height,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings?.mvImage?.url ? [settings.mvImage.url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
