interface IntroductionProps {
  text?: string;
}

export default function Introduction({ text }: IntroductionProps) {
  const defaultText = 'ポートフォリオサイトへようこそ。このサイトでは、私の実績・経歴・スキルをご紹介しています。';

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          自己紹介
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
          {text || defaultText}
        </p>
      </div>
    </section>
  );
}
