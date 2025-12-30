'use client';

import { useState, useMemo } from 'react';
import { Skill, SkillCategory } from '@/lib/types';
import SkillCard from '@/components/cards/SkillCard';
import Modal from '@/components/ui/Modal';
import RichText from '@/components/ui/RichText';

interface SkillsSectionProps {
  skills: Skill[];
}

// Category display order
const CATEGORY_ORDER: SkillCategory[] = ['言語', 'OS', 'ツール', 'インフラ'];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups: Record<SkillCategory, Skill[]> = {
      '言語': [],
      'OS': [],
      'ツール': [],
      'インフラ': [],
    };

    skills.forEach((skill) => {
      if (groups[skill.category]) {
        groups[skill.category].push(skill);
      }
    });

    return groups;
  }, [skills]);

  const handleOpenModal = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  if (skills.length === 0) {
    return null;
  }

  return (
    <section className="relative pb-0 pt-8 px-4 sm:pt-12 md:pt-16 lg:pt-20 bg-gray-100">
      <div className="max-w-6xl mx-auto pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Skills</span>
          <span className="text-sm sm:text-base font-normal text-muted-gray-text">- スキル -</span>
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {CATEGORY_ORDER.map((category) => {
            const categorySkills = groupedSkills[category];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  {category}
                </h3>
                {/* Responsive grid: 1 col mobile, 2 cols tablet (768px+), 3 cols desktop (1024px+) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {categorySkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onClick={() => handleOpenModal(skill)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Modal
          isOpen={selectedSkill !== null}
          onClose={handleCloseModal}
          title={selectedSkill?.name || ''}
        >
          {selectedSkill && (
            <RichText content={selectedSkill.details} />
          )}
        </Modal>
      </div>
      
      {/* Animated Wave Border */}
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
