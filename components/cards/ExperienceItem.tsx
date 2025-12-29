'use client';

import Image from 'next/image';
import { Experience } from '@/lib/types';

interface ExperienceItemProps {
  experience: Experience;
  onClick: () => void;
}

export default function ExperienceItem({ experience, onClick }: ExperienceItemProps) {
  return (
    <article
      className="flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-5 py-4 sm:py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${experience.companyName}の詳細を表示`}
    >
      {/* Company Logo */}
      <div className="relative w-20 h-10 sm:w-34 sm:h-12 flex-shrink-0">
        <Image
          src={experience.companyLogo.url}
          alt={`${experience.companyName}のロゴ`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 80px, 96px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full">
        {/* Company Name, Type & Duration - Single Line */}
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0">
            {experience.companyName}
          </h3>
          <span className="px-2 py-0.5 text-xs border border-gray-300 text-gray-800 rounded flex-shrink-0">
            {experience.companyType}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
            {experience.duration}
          </span>
        </div>

        {/* Job Title - Smaller Font */}
        <p className="text-xs sm:text-sm text-gray-700 mb-1">{experience.jobTitle}</p>

        {/* Work Experiences - Display All */}
        {experience.workExperiences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.workExperiences.map((exp, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
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
