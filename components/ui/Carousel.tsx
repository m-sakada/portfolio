'use client';

import { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

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
}: CarouselProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setLoaded(true);
      setMaxIdx(slider.track.details.maxIdx);
    },
    updated(slider) {
      setMaxIdx(slider.track.details.maxIdx);
    },
    slides: {
      perView: 1,
      spacing: 12,
    },
    breakpoints: {
      '(min-width: 480px)': {
        slides: { perView: 1.2, spacing: 16 },
      },
      '(min-width: 640px)': {
        slides: { perView: 1.5, spacing: 16 },
      },
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
      '(min-width: 1280px)': {
        slides: { perView: 3, spacing: 30 },
      },
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const dotCount = maxIdx + 1;

  return (
    <div className="carousel-container relative">
      <div ref={sliderRef} className="keen-slider">
        {children.map((child, index) => (
          <div key={index} className="keen-slider__slide pb-2">
            {child}
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons - Hidden on mobile, hidden when disabled */}
      {loaded && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 md:left-2 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all text-blue-600 ${
              currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === maxIdx}
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 md:right-2 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all text-blue-600 ${
              currentSlide === maxIdx ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}
      
      {/* Pagination Dots */}
      {loaded && dotCount > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:mt-6">
          {[...Array(dotCount)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-opacity ${
                currentSlide === idx ? 'bg-blue-600 opacity-100' : 'bg-blue-600 opacity-30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
