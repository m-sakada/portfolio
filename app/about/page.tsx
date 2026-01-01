import Image from 'next/image';
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
    <main className="min-h-screen bg-gray-50">
      {/* MV Image - Full width background */}
      {about.mvImage && (
        <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64">
          <Image
            src={about.mvImage.url}
            alt="メインビジュアル"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className={`px-4 relative z-10 ${about.mvImage ? '-mt-8 sm:-mt-10 md:-mt-12' : 'pt-12 md:pt-16 lg:pt-20'}`}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {about.title || 'About'}
          </h1>

          <MicroCmsHtml html={about.content} />
        </div>
      </div>

      <div className="pb-12 md:pb-16 lg:pb-20" />
    </main>
  );
}
