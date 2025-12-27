import { Work, Experience, Skill, WorkCategory, Technology, CompanyType, SkillCategory } from './types';

// Type guard for MicroCMSImage
function isMicroCMSImage(obj: any): obj is { url: string; width: number; height: number } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.url === 'string' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  );
}

// Type guard for WorkCategory
function isWorkCategory(value: any): value is WorkCategory {
  const validCategories: WorkCategory[] = [
    '保守運用',
    'Webシステム構築',
    'WordPressサイト構築',
    'LP制作',
    '静的サイト構築'
  ];
  return validCategories.includes(value);
}

// Type guard for Technology
function isTechnology(value: any): value is Technology {
  const validTechnologies: Technology[] = [
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
  ];
  return validTechnologies.includes(value);
}

// Type guard for CompanyType
function isCompanyType(value: any): value is CompanyType {
  const validTypes: CompanyType[] = [
    'Web制作会社',
    '事業会社',
    'フリーランス'
  ];
  return validTypes.includes(value);
}

// Type guard for SkillCategory
function isSkillCategory(value: any): value is SkillCategory {
  const validCategories: SkillCategory[] = [
    '言語',
    'OS',
    'ツール',
    'インフラ'
  ];
  return validCategories.includes(value);
}

// Type guard for Work
export function isWork(obj: any): obj is Work {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.url === 'string' &&
    isMicroCMSImage(obj.eyecatch) &&
    typeof obj.introductionUrl === 'string' &&
    isWorkCategory(obj.category) &&
    typeof obj.duration === 'string' &&
    Array.isArray(obj.technologies) &&
    obj.technologies.every(isTechnology) &&
    typeof obj.details === 'string'
  );
}

// Type guard for Experience
export function isExperience(obj: any): obj is Experience {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.companyName === 'string' &&
    isMicroCMSImage(obj.companyLogo) &&
    typeof obj.jobTitle === 'string' &&
    Array.isArray(obj.workExperiences) &&
    obj.workExperiences.every((exp: any) => typeof exp === 'string') &&
    typeof obj.duration === 'string' &&
    typeof obj.url === 'string' &&
    isCompanyType(obj.companyType) &&
    typeof obj.details === 'string'
  );
}

// Type guard for Skill
export function isSkill(obj: any): obj is Skill {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    isMicroCMSImage(obj.icon) &&
    isSkillCategory(obj.category) &&
    typeof obj.yearsOfExperience === 'string' &&
    typeof obj.details === 'string'
  );
}