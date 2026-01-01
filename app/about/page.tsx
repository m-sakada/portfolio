import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAbout } from '@/lib/microcms';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About',
    description: 'プライベート紹介ページ',
  };
}

export default async function AboutPage() {
  const about = await getAbout();
  
  // aboutコンテンツがない場合は404
  if (!about?.content) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
          About
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10">
          <MicroCmsHtml html={about.content} />
        </div>
      </div>
    </main>
  );
}
