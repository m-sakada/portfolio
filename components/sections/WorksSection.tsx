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
          実績
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
            <RichText content={selectedWork.details} />
          )}
        </Modal>
      </div>
    </section>
  );
}
