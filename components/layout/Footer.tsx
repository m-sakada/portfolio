interface FooterProps {
  nameEn?: string;
}

export default function Footer({ nameEn }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} {nameEn ? `${nameEn}'s Portfolio` : 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
