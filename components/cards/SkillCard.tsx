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
      className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
      <div className="relative w-8 h-8 flex-shrink-0">
        <Image
          src={skill.icon.url}
          alt={`${skill.name}のアイコン`}
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {skill.name}
        </h3>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {skill.yearsOfExperience}
        </span>
      </div>
    </article>
  );
}
