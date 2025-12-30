'use client';

import { useState } from 'react';
import { Work } from '@/lib/types';
import WorkCard from '@/components/cards/WorkCard';
import Carousel from '@/components/ui/Carousel';
import Modal from '@/components/ui/Modal';
import RichText from '@/components/ui/RichText';

interface WorksSectionProps {
  works: Work[];
}

export default function WorksSection({ works }: WorksSectionProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const handleOpenModal = (work: Work) => {
    setSelectedWork(work);
  };

  const handleCloseModal = () => {
    setSelectedWork(null);
  };

  if (works.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20  bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="tracking-[.1em]">Works</span>
          <span className="text-sm sm:text-base font-normal text-muted-gray-text translate-y-[2px]">- 実績例 -</span>
        </h2>

        <Carousel>
          {works.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onClick={() => handleOpenModal(work)}
            />
          ))}
        </Carousel>

        <Modal
          isOpen={selectedWork !== null}
          onClose={handleCloseModal}
          title={selectedWork?.title || ''}
        >
          {selectedWork && (
            <div>
              {/* Site URL */}
              {selectedWork.url && (
                <div className="mb-4 pb-4 border-b border-muted-border">
                  <a
                    href={selectedWork.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-blue-text hover:text-[#4a6a84] hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span className="break-all">{selectedWork.url}</span>
                  </a>
                </div>
              )}
              <RichText content={selectedWork.details} />
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
