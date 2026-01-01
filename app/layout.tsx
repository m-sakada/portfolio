import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/microcms";
import "./globals.css";

const lato = Lato({
  weight: ["400", "700"],
  variable: "--font-lato",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();
  const name = settings?.name || "Portfolio Owner";
  const title = `${name} | ポートフォリオサイト`;
  const description = `${currentYear}年現在の${name}のポートフォリオサイトです。実績例、職歴、スキルを記載しています。`;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const settings = await getSettings();
  const showAbout = !!settings?.showAboutMenu;

  return (
    <html lang="ja">
      <body
        className={`${lato.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header showAbout={showAbout} nameEn={settings?.nameEn} />
        <main className="flex-1">
          {children}
        </main>
        <Footer nameEn={settings?.nameEn} />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
