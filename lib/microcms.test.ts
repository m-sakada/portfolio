import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { getWorks, getCareer, getSkills } from './microcms';
import { isWork, isCareer, isSkill } from './type-guards';

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

    const workArb = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      url: fc.webUrl(),
      eyecatch: microCMSImageArb,
      introductionUrl: fc.webUrl(),
      category: fc.string({ minLength: 1, maxLength: 50 }),
      duration: fc.string({ minLength: 1, maxLength: 50 }),
      technologies: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
      details: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    const careerArb = fc.record({
      id: fc.uuid(),
      companyName: fc.string({ minLength: 1, maxLength: 100 }),
      companyLogo: microCMSImageArb,
      jobTitle: fc.string({ minLength: 1, maxLength: 100 }),
      workExperiences: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      duration: fc.string({ minLength: 1, maxLength: 50 }),
      url: fc.webUrl(),
      companyType: fc.string({ minLength: 1, maxLength: 30 }),
      details: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    const skillArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 100 }),
      icon: microCMSImageArb,
      category: fc.string({ minLength: 1, maxLength: 30 }),
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

    it('should return correctly typed Career data for any valid API response', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(careerArb, { minLength: 0, maxLength: 10 }),
          async (mockCareer) => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({ contents: mockCareer }),
            });

            const result = await getCareer();

            expect(Array.isArray(result)).toBe(true);
            result.forEach(career => {
              expect(isCareer(career)).toBe(true);
            });
            expect(result).toEqual(mockCareer);
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

    it('should return empty array for any API error in getCareer', async () => {
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

            const result = await getCareer();

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
