import Image from 'next/image';
import { MicroCMSImage } from '@/lib/types';

interface IntroductionProps {
  text?: string;
  profileImage?: MicroCMSImage;
  name?: string;
  nameEn?: string;
  mvImage?: MicroCMSImage;
}

export default function Introduction({ text, profileImage, name, nameEn, mvImage }: IntroductionProps) {
  const defaultText = 'ポートフォリオサイトへようこそ。このサイトでは、私の実績・職歴・スキルをご紹介しています。';
  const displayName = name || 'Portfolio Owner';

  return (
    <section>
      {/* MV Image - Full width background */}
      {mvImage && (
        <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64">
          <Image
            src={mvImage.url}
            alt="メインビジュアル"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      {/* Profile Content */}
      <div className="bg-white py-6 px-4 sm:py-8 md:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
            {/* Profile Image */}
            {profileImage && (
              <div className="flex-shrink-0 -mt-18 sm:-mt-36">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <Image
                    src={profileImage.url}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
            
            {/* Name and Introduction */}
            <div className={profileImage ? 'text-center sm:text-left' : 'text-center w-full'}>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {displayName}
                {nameEn && (
                  <span className="block text-base sm:text-lg md:text-xl text-gray-700 mt-1 tracking-[.1em]">
                    {nameEn}
                  </span>
                )}
              </h1>
              <p className="text-left text-gray-700 lexed whitespace-pre-line" style={{ fontSize: 'var(--text-sm)' }}>
                {text || defaultText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
