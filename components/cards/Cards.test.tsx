import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import WorkCard from './WorkCard';
import CareerItem from './CareerItem';
import { Work, Career } from '@/lib/types';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Fast-check generators for valid data
const microCMSImageArb = fc.record({
  url: fc.webUrl(),
  width: fc.integer({ min: 1, max: 2000 }),
  height: fc.integer({ min: 1, max: 2000 }),
});

const workCategoryArb = fc.constantFrom(
  '保守運用',
  'Webシステム構築',
  'WordPressサイト構築',
  'LP制作',
  '静的サイト構築'
);

const technologyArb = fc.constantFrom(
  'Next.js',
  'TypeScript',
  'microCMS',
  'Vercel',
  'AWS',
  'WordPress',
  'XServer',
  'Kinsta',
  'PHP',
  'VanillaJS',
  'Sass'
);

const companyTypeArb = fc.constantFrom(
  'Web制作会社',
  '事業会社',
  'フリーランス'
);

// Unique string generators to avoid duplicate text issues
const uniqueTitleArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `TITLE_${s.trim() || 'default'}`);
const uniqueDurationArb = fc.string({ minLength: 3, maxLength: 20 }).map(s => `DURATION_${s.trim() || 'default'}`);
const uniqueCompanyNameArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `COMPANY_${s.trim() || 'default'}`);
const uniqueJobTitleArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `JOB_${s.trim() || 'default'}`);
const uniqueWorkExpArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `WORKEXP_${s.trim() || 'default'}`);

// Details string generator
const detailsStringArb = fc.string({ minLength: 10, maxLength: 200 }).map(s => `<p>DETAILS_CONTENT_${s}</p>`);

const workArb: fc.Arbitrary<Work> = fc.record({
  id: fc.uuid(),
  title: uniqueTitleArb,
  url: fc.webUrl(),
  eyecatch: microCMSImageArb,
  introductionUrl: fc.webUrl(),
  category: workCategoryArb,
  duration: uniqueDurationArb,
  technologies: fc.uniqueArray(technologyArb, { minLength: 1, maxLength: 5 }),
  details: detailsStringArb,
});

const careerArb: fc.Arbitrary<Career> = fc.record({
  id: fc.uuid(),
  companyName: uniqueCompanyNameArb,
  companyLogo: microCMSImageArb,
  jobTitle: uniqueJobTitleArb,
  workExperiences: fc.uniqueArray(uniqueWorkExpArb, { minLength: 1, maxLength: 3 }),
  duration: uniqueDurationArb,
  url: fc.webUrl(),
  companyType: companyTypeArb,
  details: detailsStringArb,
});

describe('Card Components Property Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Property 4: Card/List Rendering Excludes Details', () => {
    it('WorkCard should render all fields except details for any valid Work', async () => {
      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          const { container } = render(<WorkCard work={work} onClick={onClick} />);

          const heading = container.querySelector('h3');
          expect(heading).toBeInTheDocument();
          expect(heading?.textContent).toBe(work.title);

          expect(screen.getByText(work.category)).toBeInTheDocument();

          const durationContainer = container.querySelector('.flex.items-center.gap-2.mb-3');
          expect(durationContainer).toBeInTheDocument();
          expect(durationContainer?.textContent).toContain(work.duration);

          work.technologies.forEach(tech => {
            expect(screen.getByText(tech)).toBeInTheDocument();
          });

          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('src', work.eyecatch.url);

          expect(container.textContent).not.toContain('DETAILS_CONTENT_');
        }),
        { numRuns: 100 }
      );
    });

    it('CareerItem should render all fields except details for any valid Career', async () => {
      await fc.assert(
        fc.asyncProperty(careerArb, async (career) => {
          cleanup();
          const onClick = vi.fn();

          const { container } = render(<CareerItem career={career} onClick={onClick} />);

          const heading = container.querySelector('h3');
          expect(heading).toBeInTheDocument();
          expect(heading?.textContent).toBe(career.companyName);

          const allParagraphs = container.querySelectorAll('p');
          const jobTitleParagraph = Array.from(allParagraphs).find(p => p.textContent === career.jobTitle);
          expect(jobTitleParagraph).toBeInTheDocument();

          const durationSpan = Array.from(container.querySelectorAll('span')).find(
            span => span.textContent === career.duration
          );
          expect(durationSpan).toBeInTheDocument();

          expect(screen.getByText(career.companyType)).toBeInTheDocument();

          const workExpContainer = container.querySelector('.flex.flex-wrap.gap-1');
          expect(workExpContainer).toBeInTheDocument();
          career.workExperiences.forEach(exp => {
            expect(workExpContainer?.textContent).toContain(exp);
          });

          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('src', career.companyLogo.url);

          expect(container.textContent).not.toContain('DETAILS_CONTENT_');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Modal Displays Details on Click', () => {
    it('WorkCard should trigger onClick when clicked for any valid Work', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          render(<WorkCard work={work} onClick={onClick} />);

          const card = screen.getByRole('button');
          await user.click(card);

          expect(onClick).toHaveBeenCalledTimes(1);
          expect(work.details).toBeDefined();
          expect(work.details.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('WorkCard should trigger onClick on keyboard Enter/Space for any valid Work', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          render(<WorkCard work={work} onClick={onClick} />);

          const card = screen.getByRole('button');
          card.focus();

          await user.keyboard('{Enter}');
          expect(onClick).toHaveBeenCalledTimes(1);

          onClick.mockClear();

          await user.keyboard(' ');
          expect(onClick).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 100 }
      );
    });

    it('CareerItem should trigger onClick when clicked for any valid Career', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(careerArb, async (career) => {
          cleanup();
          const onClick = vi.fn();

          render(<CareerItem career={career} onClick={onClick} />);

          const item = screen.getByRole('button');
          await user.click(item);

          expect(onClick).toHaveBeenCalledTimes(1);
          expect(career.details).toBeDefined();
          expect(career.details.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('CareerItem should trigger onClick on keyboard Enter/Space for any valid Career', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(careerArb, async (career) => {
          cleanup();
          const onClick = vi.fn();

          render(<CareerItem career={career} onClick={onClick} />);

          const item = screen.getByRole('button');
          item.focus();

          await user.keyboard('{Enter}');
          expect(onClick).toHaveBeenCalledTimes(1);

          onClick.mockClear();

          await user.keyboard(' ');
          expect(onClick).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 100 }
      );
    });
  });
});
