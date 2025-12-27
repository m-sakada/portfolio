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
            <div>
              {/* Company URL Link */}
              {selectedExperience.url && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <a
                    href={selectedExperience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {selectedExperience.url}
                  </a>
                </div>
              )}
              <RichText content={selectedExperience.details} />
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
