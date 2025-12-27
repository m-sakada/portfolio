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
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          経験サイト例
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
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <a
                    href={selectedWork.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
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
