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
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          スキル
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {CATEGORY_ORDER.map((category) => {
            const categorySkills = groupedSkills[category];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  {category}
                </h3>
                {/* Responsive grid: 1 col mobile, 2 cols tablet (768px+), 3 cols desktop (1024px+) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
    </section>
  );
}
