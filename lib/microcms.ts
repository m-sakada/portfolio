import { Work, Experience, Skill, Settings } from './types';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN!;
const apiKey = process.env.MICROCMS_API_KEY!;

/**
 * microCMS APIを直接fetchで呼び出す（キャッシュタグ対応）
 */
async function fetchFromMicroCMS<T>(
  endpoint: string,
  isObject = false
): Promise<T | null> {
  const url = isObject
    ? `https://${serviceDomain}.microcms.io/api/v1/${endpoint}`
    : `https://${serviceDomain}.microcms.io/api/v1/${endpoint}?limit=100`;

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
    next: { tags: ['microcms'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all works from microCMS
 * Returns empty array on error for graceful fallback
 */
export async function getWorks(): Promise<Work[]> {
  try {
    const response = await fetchFromMicroCMS<{ contents: Work[] }>('works');
    return response?.contents ?? [];
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
    const response = await fetchFromMicroCMS<{ contents: Experience[] }>('experiences');
    return response?.contents ?? [];
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
    const response = await fetchFromMicroCMS<{ contents: Skill[] }>('skills');
    return response?.contents ?? [];
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
    return await fetchFromMicroCMS<Settings>('settings', true);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}
