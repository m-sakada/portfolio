'use client';

import Image from 'next/image';
import { Skill } from '@/lib/types';

interface SkillCardProps {
  skill: Skill;
  onClick: () => void;
}

export default function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <article
      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${skill.name}の詳細を表示`}
    >
      {/* Icon */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <Image
          src={skill.icon.url}
          alt={`${skill.name}のアイコン`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 40px, 48px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
          {skill.name}
        </h3>

        {/* Category & Years */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm">
          <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
            {skill.category}
          </span>
          <span className="text-gray-600 text-xs sm:text-sm">
            {skill.yearsOfExperience}
          </span>
        </div>
      </div>
    </article>
  );
}
