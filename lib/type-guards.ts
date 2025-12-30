import { Work, Career, Skill } from './types';

// Type guard for MicroCMSImage
function isMicroCMSImage(obj: unknown): obj is { url: string; width: number; height: number } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'url' in obj &&
    'width' in obj &&
    'height' in obj &&
    typeof (obj as { url: unknown }).url === 'string' &&
    typeof (obj as { width: unknown }).width === 'number' &&
    typeof (obj as { height: unknown }).height === 'number'
  );
}

// Type guard for Work
export function isWork(obj: unknown): obj is Work {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.url === 'string' &&
    isMicroCMSImage(o.eyecatch) &&
    typeof o.introductionUrl === 'string' &&
    typeof o.category === 'string' &&
    typeof o.duration === 'string' &&
    Array.isArray(o.technologies) &&
    o.technologies.every((t: unknown) => typeof t === 'string') &&
    typeof o.details === 'string'
  );
}

// Type guard for Career
export function isCareer(obj: unknown): obj is Career {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.companyName === 'string' &&
    isMicroCMSImage(o.companyLogo) &&
    typeof o.jobTitle === 'string' &&
    Array.isArray(o.workExperiences) &&
    o.workExperiences.every((exp: unknown) => typeof exp === 'string') &&
    typeof o.duration === 'string' &&
    typeof o.url === 'string' &&
    typeof o.companyType === 'string' &&
    typeof o.details === 'string'
  );
}

// Type guard for Skill
export function isSkill(obj: unknown): obj is Skill {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    isMicroCMSImage(o.icon) &&
    typeof o.category === 'string' &&
    typeof o.yearsOfExperience === 'string' &&
    typeof o.details === 'string'
  );
}