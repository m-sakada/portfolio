'use client';

import { useState } from 'react';
import { Experience } from '@/lib/types';
import ExperienceItem from '@/components/cards/ExperienceItem';
import Modal from '@/components/ui/Modal';
import RichText from '@/components/ui/RichText';

interface ExperiencesSectionProps {
  experiences: Experience[];
}

export default function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const handleOpenModal = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleCloseModal = () => {
    setSelectedExperience(null);
  };

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          経歴
        </h2>

        {/* Responsive list: single column on mobile, can expand on larger screens */}
        <div className="space-y-3 sm:space-y-4">
          {experiences.map((experience) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              onClick={() => handleOpenModal(experience)}
            />
          ))}
        </div>

        <Modal
          isOpen={selectedExperience !== null}
          onClose={handleCloseModal}
          title={selectedExperience?.companyName || ''}
        >
          {selectedExperience && (
            <RichText content={selectedExperience.details} />
          )}
        </Modal>
      </div>
    </section>
  );
}
