'use client';

import { useState } from 'react';
import { Career } from '@/lib/types';
import CareerItem from '@/components/cards/CareerItem';
import Modal from '@/components/ui/Modal';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

interface CareerSectionProps {
  career: Career[];
}

export default function CareerSection({ career }: CareerSectionProps) {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const handleOpenModal = (careerItem: Career) => {
    setSelectedCareer(careerItem);
  };

  const handleCloseModal = () => {
    setSelectedCareer(null);
  };

  if (career.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="tracking-[.1em]">Career</span>
          <span className="text-sm sm:text-base font-normal text-muted-gray-text translate-y-[2px]">- 職歴 -</span>
        </h2>

        {/* Table-style list with horizontal lines */}
        <div>
          {career.map((careerItem) => (
            <CareerItem
              key={careerItem.id}
              career={careerItem}
              onClick={() => handleOpenModal(careerItem)}
            />
          ))}
        </div>

        <Modal
          isOpen={selectedCareer !== null}
          onClose={handleCloseModal}
          title={selectedCareer?.companyName || ''}
        >
          {selectedCareer && (
            <div>
              {/* Company URL Link */}
              {selectedCareer.url && (
                <div className="mb-4 pb-4 border-b border-muted-border">
                  <a
                    href={selectedCareer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-blue-text hover:text-[#4a6a84] hover:underline text-sm break-all"
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
                    {selectedCareer.url}
                  </a>
                </div>
              )}
              <MicroCmsHtml html={selectedCareer.details} />
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
