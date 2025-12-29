'use client';

import Image from 'next/image';
import { Work } from '@/lib/types';

interface WorkCardProps {
  work: Work;
  onClick: () => void;
}

export default function WorkCard({ work, onClick }: WorkCardProps) {
  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${work.title}の詳細を表示`}
    >
      {/* Eyecatch Image */}
      <div className="relative aspect-video">
        <Image
          src={work.eyecatch.url}
          alt={work.title}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {work.title}
        </h3>

        {/* Category & Duration */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
          <span className="px-2 py-1 border border-gray-300 text-gray-800 rounded whitespace-nowrap">
            {work.category}
          </span>
          <span className="whitespace-nowrap">{work.duration}</span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {work.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {tech}
            </span>
          ))}
          {work.technologies.length > 5 && (
            <span className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
              +{work.technologies.length - 5}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
