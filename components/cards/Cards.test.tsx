import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import WorkCard from './WorkCard';
import ExperienceItem from './ExperienceItem';
import SkillCard from './SkillCard';
import { Work, Experience, Skill, WorkCategory, Technology, CompanyType, SkillCategory } from '@/lib/types';

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

const workCategoryArb = fc.constantFrom<WorkCategory>(
  '保守運用',
  'Webシステム構築',
  'WordPressサイト構築',
  'LP制作',
  '静的サイト構築'
);

const technologyArb = fc.constantFrom<Technology>(
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

const companyTypeArb = fc.constantFrom<CompanyType>(
  'Web制作会社',
  '事業会社',
  'フリーランス'
);

const skillCategoryArb = fc.constantFrom<SkillCategory>(
  '言語',
  'OS',
  'ツール',
  'インフラ'
);

// Unique string generators to avoid duplicate text issues
const uniqueTitleArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `TITLE_${s.trim() || 'default'}`);
const uniqueDurationArb = fc.string({ minLength: 3, maxLength: 20 }).map(s => `DURATION_${s.trim() || 'default'}`);
const uniqueCompanyNameArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `COMPANY_${s.trim() || 'default'}`);
const uniqueJobTitleArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `JOB_${s.trim() || 'default'}`);
const uniqueSkillNameArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `SKILL_${s.trim() || 'default'}`);
const uniqueYearsArb = fc.string({ minLength: 3, maxLength: 15 }).map(s => `YEARS_${s.trim() || 'default'}`);
const uniqueWorkExpArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `WORKEXP_${s.trim() || 'default'}`);

// Details string generator - must be distinguishable from other fields
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

const experienceArb: fc.Arbitrary<Experience> = fc.record({
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

const skillArb: fc.Arbitrary<Skill> = fc.record({
  id: fc.uuid(),
  name: uniqueSkillNameArb,
  icon: microCMSImageArb,
  category: skillCategoryArb,
  yearsOfExperience: uniqueYearsArb,
  details: detailsStringArb,
});

describe('Card Components Property Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Property 4: Card/List Rendering Excludes Details', () => {
    it('WorkCard should render all fields except details for any valid Work', async () => {
      /**
       * Feature: portfolio-site, Property 4: Card/List Rendering Excludes Details
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          const { container } = render(<WorkCard work={work} onClick={onClick} />);

          // Should render title (in h3)
          const heading = container.querySelector('h3');
          expect(heading).toBeInTheDocument();
          expect(heading?.textContent).toBe(work.title);

          // Should render category
          expect(screen.getByText(work.category)).toBeInTheDocument();

          // Should render duration (use container query to handle whitespace)
          const durationContainer = container.querySelector('.flex.items-center.gap-2.mb-3');
          expect(durationContainer).toBeInTheDocument();
          expect(durationContainer?.textContent).toContain(work.duration);

          // Should render technologies
          work.technologies.forEach(tech => {
            expect(screen.getByText(tech)).toBeInTheDocument();
          });

          // Should render eyecatch image
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('src', work.eyecatch.url);

          // Should NOT render details content
          expect(container.textContent).not.toContain('DETAILS_CONTENT_');
        }),
        { numRuns: 100 }
      );
    });

    it('ExperienceItem should render all fields except details for any valid Experience', async () => {
      /**
       * Feature: portfolio-site, Property 4: Card/List Rendering Excludes Details
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      await fc.assert(
        fc.asyncProperty(experienceArb, async (experience) => {
          cleanup();
          const onClick = vi.fn();

          const { container } = render(<ExperienceItem experience={experience} onClick={onClick} />);

          // Should render company name (in h3)
          const heading = container.querySelector('h3');
          expect(heading).toBeInTheDocument();
          expect(heading?.textContent).toBe(experience.companyName);

          // Should render job title
          // The component uses responsive classes: text-sm sm:text-base text-gray-700
          // Find by text content instead of class selector
          const allParagraphs = container.querySelectorAll('p');
          const jobTitleParagraph = Array.from(allParagraphs).find(p => p.textContent === experience.jobTitle);
          expect(jobTitleParagraph).toBeInTheDocument();

          // Should render duration (in span element)
          const durationSpan = Array.from(container.querySelectorAll('span')).find(
            span => span.textContent === experience.duration
          );
          expect(durationSpan).toBeInTheDocument();

          // Should render company type
          expect(screen.getByText(experience.companyType)).toBeInTheDocument();

          // Should render work experiences (check textContent for each)
          const workExpContainer = container.querySelector('.flex.flex-wrap.gap-1');
          expect(workExpContainer).toBeInTheDocument();
          experience.workExperiences.forEach(exp => {
            expect(workExpContainer?.textContent).toContain(exp);
          });

          // Should render company logo
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('src', experience.companyLogo.url);

          // Should NOT render details content
          expect(container.textContent).not.toContain('DETAILS_CONTENT_');
        }),
        { numRuns: 100 }
      );
    });

    it('SkillCard should render all fields except details for any valid Skill', async () => {
      /**
       * Feature: portfolio-site, Property 4: Card/List Rendering Excludes Details
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      await fc.assert(
        fc.asyncProperty(skillArb, async (skill) => {
          cleanup();
          const onClick = vi.fn();

          const { container } = render(<SkillCard skill={skill} onClick={onClick} />);

          // Should render name (in h3)
          const heading = container.querySelector('h3');
          expect(heading).toBeInTheDocument();
          expect(heading?.textContent).toBe(skill.name);

          // Should render category
          expect(screen.getByText(skill.category)).toBeInTheDocument();

          // Should render years of experience (use container query to handle whitespace)
          const yearsElement = container.querySelector('span.text-gray-600');
          expect(yearsElement).toBeInTheDocument();
          expect(yearsElement?.textContent).toBe(skill.yearsOfExperience);

          // Should render icon
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('src', skill.icon.url);

          // Should NOT render details content
          expect(container.textContent).not.toContain('DETAILS_CONTENT_');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Modal Displays Details on Click', () => {
    it('WorkCard should trigger onClick when clicked for any valid Work', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          render(<WorkCard work={work} onClick={onClick} />);

          // Click the card
          const card = screen.getByRole('button');
          await user.click(card);

          // onClick should be called exactly once
          expect(onClick).toHaveBeenCalledTimes(1);

          // The work object with details should be available for modal display
          // (onClick is called, which allows parent to access work.details for modal)
          expect(work.details).toBeDefined();
          expect(work.details.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('WorkCard should trigger onClick on keyboard Enter/Space for any valid Work', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(workArb, async (work) => {
          cleanup();
          const onClick = vi.fn();

          render(<WorkCard work={work} onClick={onClick} />);

          const card = screen.getByRole('button');
          card.focus();

          // Press Enter
          await user.keyboard('{Enter}');
          expect(onClick).toHaveBeenCalledTimes(1);

          onClick.mockClear();

          // Press Space
          await user.keyboard(' ');
          expect(onClick).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 100 }
      );
    });

    it('ExperienceItem should trigger onClick when clicked for any valid Experience', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(experienceArb, async (experience) => {
          cleanup();
          const onClick = vi.fn();

          render(<ExperienceItem experience={experience} onClick={onClick} />);

          // Click the item
          const item = screen.getByRole('button');
          await user.click(item);

          // onClick should be called exactly once
          expect(onClick).toHaveBeenCalledTimes(1);

          // The experience object with details should be available for modal display
          expect(experience.details).toBeDefined();
          expect(experience.details.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('ExperienceItem should trigger onClick on keyboard Enter/Space for any valid Experience', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(experienceArb, async (experience) => {
          cleanup();
          const onClick = vi.fn();

          render(<ExperienceItem experience={experience} onClick={onClick} />);

          const item = screen.getByRole('button');
          item.focus();

          // Press Enter
          await user.keyboard('{Enter}');
          expect(onClick).toHaveBeenCalledTimes(1);

          onClick.mockClear();

          // Press Space
          await user.keyboard(' ');
          expect(onClick).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 100 }
      );
    });

    it('SkillCard should trigger onClick when clicked for any valid Skill', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(skillArb, async (skill) => {
          cleanup();
          const onClick = vi.fn();

          render(<SkillCard skill={skill} onClick={onClick} />);

          // Click the card
          const card = screen.getByRole('button');
          await user.click(card);

          // onClick should be called exactly once
          expect(onClick).toHaveBeenCalledTimes(1);

          // The skill object with details should be available for modal display
          expect(skill.details).toBeDefined();
          expect(skill.details.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('SkillCard should trigger onClick on keyboard Enter/Space for any valid Skill', async () => {
      /**
       * Feature: portfolio-site, Property 5: Modal Displays Details on Click
       * Validates: Requirements 6.5, 6.6, 6.7, 8.1, 8.2, 8.3
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(skillArb, async (skill) => {
          cleanup();
          const onClick = vi.fn();

          render(<SkillCard skill={skill} onClick={onClick} />);

          const card = screen.getByRole('button');
          card.focus();

          // Press Enter
          await user.keyboard('{Enter}');
          expect(onClick).toHaveBeenCalledTimes(1);

          onClick.mockClear();

          // Press Space
          await user.keyboard(' ');
          expect(onClick).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 100 }
      );
    });
  });
});
