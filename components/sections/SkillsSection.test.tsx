import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import * as fc from 'fast-check';
import SkillsSection from './SkillsSection';
import { Skill, SkillCategory } from '@/lib/types';

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

const skillCategoryArb = fc.constantFrom<SkillCategory>(
  '言語',
  'OS',
  'ツール',
  'インフラ'
);

const uniqueSkillNameArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `SKILL_${s.trim() || 'default'}`);
const uniqueYearsArb = fc.string({ minLength: 3, maxLength: 15 }).map(s => `YEARS_${s.trim() || 'default'}`);
const detailsStringArb = fc.string({ minLength: 10, maxLength: 200 }).map(s => `<p>DETAILS_CONTENT_${s}</p>`);

// Generate a skill with a specific category
const skillWithCategoryArb = (category: SkillCategory): fc.Arbitrary<Skill> => fc.record({
  id: fc.uuid(),
  name: uniqueSkillNameArb,
  icon: microCMSImageArb,
  category: fc.constant(category),
  yearsOfExperience: uniqueYearsArb,
  details: detailsStringArb,
});

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
  // Ensure unique IDs
  return skills.map((skill, index) => ({
    ...skill,
    id: `skill-${index}-${skill.id}`,
    name: `${skill.name}-${index}`,
  }));
});

const CATEGORY_ORDER: SkillCategory[] = ['言語', 'OS', 'ツール', 'インフラ'];

describe('SkillsSection Property Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Property 3: Skills Grouped by Category', () => {
    it('should group skills by category with each category containing only skills of that category type', async () => {
      /**
       * Feature: portfolio-site, Property 3: Skills Grouped by Category
       * Validates: Requirements 6.4
       * 
       * For any set of skills, when rendered in the SkillsSection, skills SHALL be 
       * grouped by their category field, with each category containing only skills 
       * of that category type.
       */
      await fc.assert(
        fc.asyncProperty(skillsArrayArb, async (skills) => {
          cleanup();

          const { container } = render(<SkillsSection skills={skills} />);

          // Get the section container with category groups
          // The component uses responsive classes: space-y-6 sm:space-y-8
          const sectionContainer = container.querySelector('[class*="space-y"]');
          if (!sectionContainer) {
            // If no skills, section should not render
            expect(skills.length).toBe(0);
            return;
          }

          // Get all category group divs (direct children of space-y-8)
          const categoryGroups = sectionContainer.querySelectorAll(':scope > div');
          
          // For each rendered category group
          categoryGroups.forEach((group) => {
            // Get the category heading (h3 with category name)
            // The component uses responsive classes: text-base sm:text-lg md:text-xl
            const categoryHeading = group.querySelector('h3');
            expect(categoryHeading).not.toBeNull();
            
            const categoryName = categoryHeading!.textContent as SkillCategory;
            
            // Verify this is a valid category
            expect(CATEGORY_ORDER).toContain(categoryName);
            
            // Get all skill cards in this category group
            const skillCards = group.querySelectorAll('[role="button"]');
            
            // Get the skills that should be in this category
            const expectedSkillsInCategory = skills.filter(s => s.category === categoryName);
            
            // Verify the number of cards matches expected
            expect(skillCards.length).toBe(expectedSkillsInCategory.length);
            
            // Verify each skill card belongs to this category by checking the category badge
            skillCards.forEach((card) => {
              // Find the category badge within the card
              const categoryBadge = card.querySelector('.bg-purple-100');
              expect(categoryBadge).not.toBeNull();
              expect(categoryBadge!.textContent).toBe(categoryName);
            });
          });

          // Verify all skills are rendered (no skills are missing)
          const allRenderedCards = container.querySelectorAll('[role="button"]');
          expect(allRenderedCards.length).toBe(skills.length);

          // Verify categories with no skills are not rendered
          CATEGORY_ORDER.forEach((category) => {
            const skillsInCategory = skills.filter(s => s.category === category);
            // The component uses responsive classes: text-base sm:text-lg md:text-xl
            const categoryHeading = Array.from(container.querySelectorAll('h3')).find(
              h => h.textContent === category
            );
            
            if (skillsInCategory.length === 0) {
              expect(categoryHeading).toBeUndefined();
            } else {
              expect(categoryHeading).toBeDefined();
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});
