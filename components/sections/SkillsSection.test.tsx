import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import SkillsSection from './SkillsSection';
import { Skill } from '@/lib/types';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Fast-check generators
const microCMSImageArb = fc.record({
  url: fc.webUrl(),
  width: fc.integer({ min: 1, max: 2000 }),
  height: fc.integer({ min: 1, max: 2000 }),
});

const skillCategoryArb = fc.constantFrom(
  '言語',
  'OS',
  'ツール',
  'インフラ'
);

const uniqueSkillNameArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `SKILL_${s.trim() || 'default'}`);
const uniqueYearsArb = fc.string({ minLength: 3, maxLength: 15 }).map(s => `YEARS_${s.trim() || 'default'}`);
const detailsStringArb = fc.string({ minLength: 10, maxLength: 200 }).map(s => `<p>DETAILS_CONTENT_${s}</p>`);

// Generate a random skill
const skillArb: fc.Arbitrary<Skill> = fc.record({
  id: fc.uuid(),
  name: uniqueSkillNameArb,
  icon: microCMSImageArb,
  category: skillCategoryArb,
  yearsOfExperience: uniqueYearsArb,
  details: detailsStringArb,
});

// Generate an array of skills with unique IDs
const skillsArrayArb = fc.array(skillArb, { minLength: 1, maxLength: 12 }).map(skills => {
  return skills.map((skill, index) => ({
    ...skill,
    id: `skill-${index}-${skill.id}`,
    name: `${skill.name}-${index}`,
  }));
});

describe('SkillsSection Property Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Property: Skills Rendered as Floating Tags', () => {
    it('should render all skills as floating tags', async () => {
      await fc.assert(
        fc.asyncProperty(skillsArrayArb, async (skills) => {
          cleanup();

          const { container } = render(<SkillsSection skills={skills} />);

          // Get all floating skill tags
          const skillTags = container.querySelectorAll('.animate-float');
          
          // Should render all skills
          expect(skillTags.length).toBe(skills.length);

          // Each skill should have name and years displayed
          skills.forEach((skill) => {
            expect(container.textContent).toContain(skill.name);
            expect(container.textContent).toContain(skill.yearsOfExperience);
          });
        }),
        { numRuns: 50 }
      );
    });

    it('should not render section when skills array is empty', () => {
      const { container } = render(<SkillsSection skills={[]} />);
      expect(container.querySelector('section')).toBeNull();
    });
  });
});
