import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { getWorks, getExperiences, getSkills, client } from './microcms';
import { isWork, isExperience, isSkill } from './type-guards';
import { Work, Experience, Skill, WorkCategory, Technology, CompanyType, SkillCategory } from './types';

// Mock the microcms-js-sdk
vi.mock('microcms-js-sdk', () => ({
  createClient: vi.fn(() => ({
    getList: vi.fn(),
  })),
}));

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
      /**
       * Feature: portfolio-site, Property 1: API Client Returns Correctly Typed Data
       * Validates: Requirements 2.1, 2.2, 2.3, 3.1-3.8, 4.1-4.8, 5.1-5.5
       */
      await fc.assert(
        fc.asyncProperty(
          fc.array(workArb, { minLength: 0, maxLength: 10 }),
          async (mockWorks) => {
            // Mock the API response
            const mockResponse = { contents: mockWorks };
            vi.mocked(client.getList).mockResolvedValueOnce(mockResponse);

            // Call the function
            const result = await getWorks();

            // Verify all returned items conform to Work interface
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
      /**
       * Feature: portfolio-site, Property 1: API Client Returns Correctly Typed Data
       * Validates: Requirements 2.1, 2.2, 2.3, 3.1-3.8, 4.1-4.8, 5.1-5.5
       */
      await fc.assert(
        fc.asyncProperty(
          fc.array(experienceArb, { minLength: 0, maxLength: 10 }),
          async (mockExperiences) => {
            // Mock the API response
            const mockResponse = { contents: mockExperiences };
            vi.mocked(client.getList).mockResolvedValueOnce(mockResponse);

            // Call the function
            const result = await getExperiences();

            // Verify all returned items conform to Experience interface
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
      /**
       * Feature: portfolio-site, Property 1: API Client Returns Correctly Typed Data
       * Validates: Requirements 2.1, 2.2, 2.3, 3.1-3.8, 4.1-4.8, 5.1-5.5
       */
      await fc.assert(
        fc.asyncProperty(
          fc.array(skillArb, { minLength: 0, maxLength: 10 }),
          async (mockSkills) => {
            // Mock the API response
            const mockResponse = { contents: mockSkills };
            vi.mocked(client.getList).mockResolvedValueOnce(mockResponse);

            // Call the function
            const result = await getSkills();

            // Verify all returned items conform to Skill interface
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
      /**
       * Feature: portfolio-site, Property 2: API Error Handling Returns Fallback
       * Validates: Requirements 2.4
       */
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
            // Mock the API to throw an error
            vi.mocked(client.getList).mockRejectedValueOnce(error);

            // Call the function
            const result = await getWorks();

            // Verify it returns empty array
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for any API error in getExperiences', async () => {
      /**
       * Feature: portfolio-site, Property 2: API Error Handling Returns Fallback
       * Validates: Requirements 2.4
       */
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
            // Mock the API to throw an error
            vi.mocked(client.getList).mockRejectedValueOnce(error);

            // Call the function
            const result = await getExperiences();

            // Verify it returns empty array
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for any API error in getSkills', async () => {
      /**
       * Feature: portfolio-site, Property 2: API Error Handling Returns Fallback
       * Validates: Requirements 2.4
       */
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
            // Mock the API to throw an error
            vi.mocked(client.getList).mockRejectedValueOnce(error);

            // Call the function
            const result = await getSkills();

            // Verify it returns empty array
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});