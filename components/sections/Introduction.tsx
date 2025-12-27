import Image from 'next/image';
import { MicroCMSImage } from '@/lib/types';

interface IntroductionProps {
  text?: string;
  profileImage?: MicroCMSImage;
  name?: string;
  nameEn?: string;
}

export default function Introduction({ text, profileImage, name, nameEn }: IntroductionProps) {
  const defaultText = 'ポートフォリオサイトへようこそ。このサイトでは、私の実績・経歴・スキルをご紹介しています。';
  const displayName = name || 'Portfolio Owner';

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto text-center">
        {profileImage && (
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
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
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          {displayName}
          {nameEn && (
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mt-2">
              {nameEn}
            </span>
          )}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
          {text || defaultText}
        </p>
      </div>
    </section>
  );
}
