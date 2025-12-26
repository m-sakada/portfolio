import { createClient } from 'microcms-js-sdk';
import { Work, Experience, Skill } from './types';

// Initialize microCMS client
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

/**
 * Fetch all works from microCMS
 * Returns empty array on error for graceful fallback
 */
export async function getWorks(): Promise<Work[]> {
  try {
    const response = await client.getList<Work>({
      endpoint: 'works',
    });
    return response.contents;
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return [];
  }
}

/**
 * Fetch all experiences from microCMS
 * Returns empty array on error for graceful fallback
 */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const response = await client.getList<Experience>({
      endpoint: 'experiences',
    });
    return response.contents;
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return [];
  }
}

/**
 * Fetch all skills from microCMS
 * Returns empty array on error for graceful fallback
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await client.getList<Skill>({
      endpoint: 'skills',
    });
    return response.contents;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return [];
  }
}