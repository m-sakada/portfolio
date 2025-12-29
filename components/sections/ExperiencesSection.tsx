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
        <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Career</span>
          <span className="text-sm sm:text-base font-normal text-muted-gray-text">- 経歴 -</span>
        </h2>

        {/* Table-style list with horizontal lines */}
        <div>
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
                <div className="mb-4 pb-4 border-b border-muted-border">
                  <a
                    href={selectedExperience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-blue-text hover:text-[#4a6a84] hover:underline text-sm"
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
