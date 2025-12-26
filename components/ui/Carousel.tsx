'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  children: React.ReactNode[];
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number | 'auto';
      spaceBetween?: number;
    };
  };
}

export default function Carousel({ 
  children, 
  slidesPerView = 1, 
  spaceBetween = 20,
  breakpoints
}: CarouselProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive breakpoints for different screen sizes
  // Mobile: 320px+ (1 slide)
  // Tablet: 768px+ (2 slides)
  // Desktop: 1024px+ (3 slides)
  const defaultBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 12,
    },
    480: {
      slidesPerView: 1.2,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 1.5,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  };

  // Show a simple grid layout during SSR and hydration
  if (!isClient) {
    return (
      <div className="carousel-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {children.map((child, index) => (
            <div key={index} className="pb-2">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          dynamicBullets: true,
        }}
        breakpoints={breakpoints || defaultBreakpoints}
        className="w-full"
        grabCursor={true}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index} className="pb-2">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons - Hidden on mobile via CSS */}
      <div className="swiper-button-prev !text-blue-600 !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !left-0 md:!left-2 !bg-white !rounded-full !shadow-lg hover:!bg-gray-50 transition-colors after:!text-sm after:!font-bold"></div>
      <div className="swiper-button-next !text-blue-600 !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !right-0 md:!right-2 !bg-white !rounded-full !shadow-lg hover:!bg-gray-50 transition-colors after:!text-sm after:!font-bold"></div>
      
      {/* Custom Pagination */}
      <div className="swiper-pagination !bottom-4 !relative !mt-4 md:!mt-6"></div>
      
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #3b82f6 !important;
          opacity: 0.3 !important;
          width: 8px !important;
          height: 8px !important;
        }
        
        @media (min-width: 768px) {
          .swiper-pagination-bullet {
            width: 10px !important;
            height: 10px !important;
          }
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
        
        .swiper-button-disabled {
          opacity: 0.3 !important;
        }
      `}</style>
    </div>
  );
}