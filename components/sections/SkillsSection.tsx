'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Skill } from '@/lib/types';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; arrowLeft: number }>({ top: 0, arrowLeft: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ホバー中のスキルデータを取得
  const hoveredSkillData = skills.find(s => s.id === hoveredSkill);

  // 画面幅の監視
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // スキルホバー時にツールチップの位置を計算（モバイルのみ）
  useEffect(() => {
    if (!hoveredSkill || !containerRef.current || !isMobile) return;
    
    const skillEl = skillRefs.current.get(hoveredSkill);
    if (!skillEl) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const skillRect = skillEl.getBoundingClientRect();
    
    // ツールチップのtop位置（スキルの下端からの相対位置）
    const top = skillRect.bottom - containerRect.top + 8;
    
    // 三角の位置（コンテナ幅に対するスキル中心の%）
    const skillCenter = skillRect.left + skillRect.width / 2;
    const arrowLeft = ((skillCenter - containerRect.left) / containerRect.width) * 100;
    
    setTooltipPosition({
      top,
      arrowLeft: Math.max(10, Math.min(90, arrowLeft)),
    });
  }, [hoveredSkill, isMobile]);

  // Generate consistent random positions based on skill id
  const skillsWithAnimation = useMemo(() => {
    return skills.map((skill, index) => {
      // Use index for deterministic "randomness" to avoid hydration issues
      const seed = index;
      const duration = 3 + (seed % 3); // 3-5s
      const delay = (seed * 0.3) % 2; // 0-2s delay
      const floatRange = 8 + (seed % 8); // 8-15px float range
      
      return {
        ...skill,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        floatRange,
      };
    });
  }, [skills]);

  if (skills.length === 0) {
    return null;
  }

  return (
    <section className="relative pb-0 pt-8 px-4 sm:pt-12 md:pt-16 lg:pt-20 bg-gray-100">
      <div className="max-w-4xl mx-auto pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="tracking-[.1em]">Skills</span>
          <span className="text-sm sm:text-base font-normal text-muted-gray-text translate-y-[2px]">- スキル -</span>
        </h2>

        {/* Floating tag cloud */}
        <div ref={containerRef} className="relative flex flex-wrap justify-center gap-3 sm:gap-4">
          {skillsWithAnimation.map((skill) => (
            <div
              key={skill.id}
              ref={(el) => {
                if (el) skillRefs.current.set(skill.id, el);
              }}
              className={`relative inline-flex flex-col items-center px-3 py-2 sm:px-4 sm:py-3 bg-white rounded-xl shadow-sm border border-gray-100 animate-float cursor-pointer hover:shadow-md hover:border-gray-200 transition-shadow ${hoveredSkill === skill.id ? 'z-40' : 'z-0'}`}
              style={{
                animationDuration: skill.animationDuration,
                animationDelay: skill.animationDelay,
                ['--float-range' as string]: `${skill.floatRange}px`,
              }}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Icon */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <Image
                  src={skill.icon.url}
                  alt={`${skill.name}のアイコン`}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>

              {/* Years */}
              <span className="text-xs text-gray-500 mt-1">
                {skill.yearsOfExperience}
              </span>

              {/* Tooltip - PC: 各スキルの真下に表示 */}
              {!isMobile && (
                <div 
                  className={`
                    absolute z-100 top-full mt-2 left-1/2 -translate-x-1/2 w-72 p-3 bg-white rounded-lg shadow-lg border border-gray-200 transition-opacity duration-150
                    ${hoveredSkill === skill.id ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                  `}
                >
                  {/* Arrow pointing up */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-6px]">
                    <div className="w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
                  </div>
                  
                  {/* Category badge with skill name */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {skill.category}
                    </span>
                    <span className="text-base font-bold text-gray-800">
                      {skill.name}
                    </span>
                  </div>
                  
                  {/* Details */}
                  {skill.details && (
                    <div className="text-sm max-h-40 overflow-y-auto">
                      <MicroCmsHtml html={skill.details} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Tooltip - モバイル: コンテナ幅いっぱいに表示 */}
          {isMobile && (
            <div 
              className={`
                absolute z-100 left-0 right-0 p-3 bg-white rounded-lg shadow-lg border border-gray-200 transition-opacity duration-150
                ${hoveredSkill ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
              `}
              style={{ top: tooltipPosition.top }}
            >
              {/* Arrow pointing up */}
              <div 
                className="absolute bottom-full mb-[-6px]"
                style={{ left: `${tooltipPosition.arrowLeft}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
              </div>
              
              {hoveredSkillData && (
                <>
                  {/* Category badge with skill name */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {hoveredSkillData.category}
                    </span>
                    <span className="text-base font-bold text-gray-800">
                      {hoveredSkillData.name}
                    </span>
                  </div>
                  
                  {/* Details */}
                  {hoveredSkillData.details && (
                    <div className="text-sm max-h-40 overflow-y-auto">
                      <MicroCmsHtml html={hoveredSkillData.details} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Wave Border */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="animate-wave"
            fill="#ffffff"
            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
