import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/microcms';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings?.name || "Portfolio Owner";
  
  return {
    title: `About | ${name}`,
    description: 'プライベート紹介ページ',
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  
  // aboutContentがない場合は404
  if (!settings?.aboutContent) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
          About
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10">
          <MicroCmsHtml 
            html={settings.aboutContent}
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none"
          />
        </div>
      </div>
    </main>
  );
}
