// Type definitions for microCMS API responses

// Work Category types
export type WorkCategory = 
  | '保守運用'
  | 'Webシステム構築'
  | 'WordPressサイト構築'
  | 'LP制作'
  | '静的サイト構築';

// Technology types
export type Technology = 
  | 'Next.js'
  | 'TypeScript'
  | 'microCMS'
  | 'Vercel'
  | 'AWS'
  | 'WordPress'
  | 'XServer'
  | 'Kinsta'
  | 'PHP'
  | 'VanillaJS'
  | 'Sass';

// Company Type
export type CompanyType = 
  | 'Web制作会社'
  | '事業会社'
  | 'フリーランス';

// Skill Category
export type SkillCategory = 
  | '言語'
  | 'OS'
  | 'ツール'
  | 'インフラ';

// microCMS Image type
export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

// Work interface
export interface Work {
  id: string;
  title: string;                    // タイトル
  url: string;                      // URL
  eyecatch: MicroCMSImage;          // アイキャッチ画像
  introductionUrl: string;          // 実績紹介URL
  category: WorkCategory;           // 種別
  duration: string;                 // 期間
  technologies: Technology[];       // 技術（複数選択）
  details: string;                  // 詳細（リッチテキスト）
}

// Experience interface
export interface Experience {
  id: string;
  companyName: string;              // 会社名
  companyLogo: MicroCMSImage;       // 会社ロゴ
  jobTitle: string;                 // 職種
  workExperiences: string[];        // 経験業務（複数選択）
  duration: string;                 // 期間
  url: string;                      // URL
  companyType: CompanyType;         // 会社タイプ
  details: string;                  // 詳細（リッチテキスト）
}

// Skill interface
export interface Skill {
  id: string;
  name: string;                     // 名称
  icon: MicroCMSImage;              // アイコン
  category: SkillCategory;          // カテゴリ
  yearsOfExperience: string;        // 経験年数
  details: string;                  // 詳細（リッチテキスト）
}

// Settings interface
export interface Settings {
  id: string;
  mvImage?: MicroCMSImage;          // MV画像
  favicon?: MicroCMSImage;          // ファビコン
  profileImage?: MicroCMSImage;     // 顔写真
  name?: string;                    // 名前
  nameEn?: string;                  // 名前（英字）
  introductionMessage?: string;     // 自己紹介メッセージ
  detailMessage?: string;           // 詳細メッセージ（リッチテキスト）
  aboutContent?: string;            // aboutページに表示するコンテンツ（リッチテキスト）
}