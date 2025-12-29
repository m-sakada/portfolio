import { createClient } from 'microcms-js-sdk';
import { Work, Experience, Skill, Settings } from './types';

// Initialize microCMS client
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
  customFetch: (input, init) => {
    // Next.js App Routerでrevalidateが効くようにキャッシュタグを設定
    return fetch(input, {
      ...init,
      next: { tags: ['microcms'] },
    });
  },
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

/**
 * Fetch settings from microCMS
 * Returns null on error for graceful fallback
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    const response = await client.getObject<Settings>({
      endpoint: 'settings',
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}