'use client';

import Image from 'next/image';
import { Career } from '@/lib/types';

interface CareerItemProps {
  career: Career;
  onClick: () => void;
}

export default function CareerItem({ career, onClick }: CareerItemProps) {
  return (
    <article
      className="flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-5 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${career.companyName}の詳細を表示`}
    >
      {/* Company Logo */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-100 rounded px-3 py-1">
        <div className="relative w-32 h-8 sm:w-28 sm:h-10">
          <Image
            src={career.companyLogo.url}
            alt={`${career.companyName}のロゴ`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full">
        {/* Company Name, Type & Duration - Single Line */}
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-shrink-0">
            {career.companyName}
          </h3>
          <span className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 rounded flex-shrink-0">
            {career.companyType}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
            {career.duration}
          </span>
        </div>

        {/* Job Title - Smaller Font */}
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1">{career.jobTitle}</p>

        {/* Work Experiences - Display All */}
        {career.workExperiences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {career.workExperiences.map((exp, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded"
              >
                {exp}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
