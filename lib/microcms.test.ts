import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { getWorks, getExperiences, getSkills } from './microcms';
import { isWork, isExperience, isSkill } from './type-guards';
import { Work, Experience, Skill, WorkCategory, Technology, CompanyType, SkillCategory } from './types';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('microCMS Client Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Property 1: API Client Returns Correctly Typed Data', () => {
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

    const workArb = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      url: fc.webUrl(),
      eyecatch: microCMSImageArb,
      introductionUrl: fc.webUrl(),
      category: workCategoryArb,
      duration: fc.string({ minLength: 1, maxLength: 50 }),
      technologies: fc.array(technologyArb, { minLength: 1, maxLength: 5 }),
      details: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    const experienceArb = fc.record({
      id: fc.uuid(),
      companyName: fc.string({ minLength: 1, maxLength: 100 }),
      companyLogo: microCMSImageArb,
      jobTitle: fc.string({ minLength: 1, maxLength: 100 }),
      workExperiences: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      duration: fc.string({ minLength: 1, maxLength: 50 }),
      url: fc.webUrl(),
      companyType: companyTypeArb,
      details: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    const skillArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 100 }),
      icon: microCMSImageArb,
      category: skillCategoryArb,
      yearsOfExperience: fc.string({ minLength: 1, maxLength: 20 }),
      details: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    it('should return correctly typed Work data for any valid API response', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(workArb, { minLength: 0, maxLength: 10 }),
          async (mockWorks) => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({ contents: mockWorks }),
            });

            const result = await getWorks();

            expect(Array.isArray(result)).toBe(true);
            result.forEach(work => {
              expect(isWork(work)).toBe(true);
            });
            expect(result).toEqual(mockWorks);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correctly typed Experience data for any valid API response', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(experienceArb, { minLength: 0, maxLength: 10 }),
          async (mockExperiences) => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({ contents: mockExperiences }),
            });

            const result = await getExperiences();

            expect(Array.isArray(result)).toBe(true);
            result.forEach(experience => {
              expect(isExperience(experience)).toBe(true);
            });
            expect(result).toEqual(mockExperiences);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correctly typed Skill data for any valid API response', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(skillArb, { minLength: 0, maxLength: 10 }),
          async (mockSkills) => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({ contents: mockSkills }),
            });

            const result = await getSkills();

            expect(Array.isArray(result)).toBe(true);
            result.forEach(skill => {
              expect(isSkill(skill)).toBe(true);
            });
            expect(result).toEqual(mockSkills);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: API Error Handling Returns Fallback', () => {
    it('should return empty array for any API error in getWorks', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(new Error('Network error')),
            fc.constant(new Error('API rate limit exceeded')),
            fc.constant(new Error('Invalid API key')),
            fc.constant(new Error('Service unavailable')),
            fc.constant(new TypeError('Cannot read property')),
            fc.constant(new ReferenceError('Variable not defined'))
          ),
          async (error) => {
            mockFetch.mockRejectedValueOnce(error);

            const result = await getWorks();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for any API error in getExperiences', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(new Error('Network error')),
            fc.constant(new Error('API rate limit exceeded')),
            fc.constant(new Error('Invalid API key')),
            fc.constant(new Error('Service unavailable')),
            fc.constant(new TypeError('Cannot read property')),
            fc.constant(new ReferenceError('Variable not defined'))
          ),
          async (error) => {
            mockFetch.mockRejectedValueOnce(error);

            const result = await getExperiences();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for any API error in getSkills', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(new Error('Network error')),
            fc.constant(new Error('API rate limit exceeded')),
            fc.constant(new Error('Invalid API key')),
            fc.constant(new Error('Service unavailable')),
            fc.constant(new TypeError('Cannot read property')),
            fc.constant(new ReferenceError('Variable not defined'))
          ),
          async (error) => {
            mockFetch.mockRejectedValueOnce(error);

            const result = await getSkills();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array when API returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getWorks();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
    });
  });
});
