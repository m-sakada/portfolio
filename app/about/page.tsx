import { Metadata } from 'next';
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
  const defaultContent = `
    <section class="mb-8">
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        プロフィール
      </h2>
      <p class="text-gray-700 leading-relaxed">
        こんにちは！このページでは、仕事以外の私についてご紹介します。
        趣味や興味のあること、日常の過ごし方などをお伝えできればと思います。
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        趣味・興味
      </h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>新しい技術の学習と実験</li>
        <li>読書（技術書、ビジネス書）</li>
        <li>アウトドア活動</li>
        <li>音楽鑑賞</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        メッセージ
      </h2>
      <p class="text-gray-700 leading-relaxed">
        お仕事のご依頼やご質問がございましたら、お気軽にお問い合わせください。
        一緒に素晴らしいプロジェクトを作り上げていきましょう！
      </p>
    </section>
  `;

  return (
    <main className="min-h-screen py-12 px-4 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
          About
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10">
          <MicroCmsHtml 
            html={settings?.aboutContent || defaultContent}
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none"
          />
        </div>
      </div>
    </main>
  );
}
