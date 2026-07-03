export type ProjectCategory = 'Web' | 'App' | 'Other';

export type Project = {
  /** 갤러리 이미지 파일명과 매칭되는 고유 slug */
  slug: string;
  /** 전시 번호 (01, 02 …) — data/projects.ts에서 자동 생성 */
  number: string;
  title: string;
  titleKo: string;
  category: ProjectCategory;
  /** 시기 · 소속 (예: 'Nov 2023 · SMU') */
  period: string;
  /** 담당 역할 (예: '프론트엔드 리더', '1인 개발') */
  role: string;
  description: string;
  descriptionEn: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  /** 홈 3D 갤러리에 대표작으로 노출할지 여부 */
  featured?: boolean;
};
