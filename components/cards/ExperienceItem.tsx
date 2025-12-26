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
      className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
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
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
        <Image
          src={experience.companyLogo.url}
          alt={`${experience.companyName}のロゴ`}
          fill
          className="object-contain rounded"
          sizes="(max-width: 640px) 48px, 64px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full">
        {/* Company Name & Type */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-full sm:max-w-none">
            {experience.companyName}
          </h3>
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded flex-shrink-0">
            {experience.companyType}
          </span>
        </div>

        {/* Job Title */}
        <p className="text-sm sm:text-base text-gray-700 mb-1">{experience.jobTitle}</p>

        {/* Duration */}
        <p className="text-xs sm:text-sm text-gray-500 mb-2">{experience.duration}</p>

        {/* Work Experiences */}
        {experience.workExperiences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.workExperiences.slice(0, 4).map((exp, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {exp}
              </span>
            ))}
            {experience.workExperiences.length > 4 && (
              <span className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
                +{experience.workExperiences.length - 4}
              </span>
            )}
          </div>
        )}

        {/* URL (optional display) - hidden on mobile */}
        {experience.url && (
          <div className="hidden sm:block mt-2 text-sm text-blue-600 truncate">
            {experience.url}
          </div>
        )}
      </div>
    </article>
  );
}
