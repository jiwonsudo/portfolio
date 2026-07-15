export type TechCategory =
  | 'Frontend'
  | '3D & Graphics'
  | 'Backend'
  | 'Mobile'
  | 'Database'
  | 'Infra & Deploy'
  | 'AI/ML';

export type TechMeta = {
  /** 공식 사이트 / 문서 링크 */
  url: string;
  /** 브랜드 대표색 */
  color: string;
  /** 용도별 분류 */
  category: TechCategory;
  /** 배경이 밝아 어두운 글자가 필요한 경우 true */
  dark?: boolean;
};

/** Tech & Tools에서 그룹을 노출할 순서 */
export const techCategoryOrder: TechCategory[] = [
  'Frontend',
  '3D & Graphics',
  'Backend',
  'Mobile',
  'Database',
  'Infra & Deploy',
  'AI/ML',
];

/**
 * 기술 스택별 공식 링크 + 브랜드 컬러 + 용도 분류.
 * projects.ts의 stack 값과 baseStacks를 모두 포함한다.
 */
export const techMeta: Record<string, TechMeta> = {
  React: {
    url: 'https://react.dev',
    color: '#61DAFB',
    category: 'Frontend',
    dark: true,
  },
  TypeScript: {
    url: 'https://www.typescriptlang.org',
    color: '#3178C6',
    category: 'Frontend',
  },
  JavaScript: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    color: '#F7DF1E',
    category: 'Frontend',
    dark: true,
  },
  'HTML/CSS': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    color: '#E34F26',
    category: 'Frontend',
  },
  'Tailwind CSS': {
    url: 'https://tailwindcss.com',
    color: '#06B6D4',
    category: 'Frontend',
  },
  'Styled-Components': {
    url: 'https://styled-components.com',
    color: '#DB7093',
    category: 'Frontend',
  },
  R3F: {
    url: 'https://r3f.docs.pmnd.rs',
    color: '#FF6080',
    category: '3D & Graphics',
  },
  'Three.js': {
    url: 'https://threejs.org',
    color: '#111111',
    category: '3D & Graphics',
  },
  'Processing (Java)': {
    url: 'https://processing.org',
    color: '#006699',
    category: '3D & Graphics',
  },
  'Express.js': {
    url: 'https://expressjs.com',
    color: '#303030',
    category: 'Backend',
  },
  Python: {
    url: 'https://www.python.org',
    color: '#3776AB',
    category: 'Backend',
  },
  JWT: { url: 'https://jwt.io', color: '#FB015B', category: 'Backend' },
  Swift: {
    url: 'https://www.swift.org',
    color: '#F05138',
    category: 'Mobile',
  },
  Alamofire: {
    url: 'https://github.com/Alamofire/Alamofire',
    color: '#FF7000',
    category: 'Mobile',
  },
  Supabase: {
    url: 'https://supabase.com',
    color: '#3ECF8E',
    category: 'Database',
  },
  MySQL: {
    url: 'https://www.mysql.com',
    color: '#00758F',
    category: 'Database',
  },
  'Amazon RDS': {
    url: 'https://aws.amazon.com/rds/',
    color: '#527FFF',
    category: 'Database',
  },
  Vercel: {
    url: 'https://vercel.com',
    color: '#111111',
    category: 'Infra & Deploy',
  },
  'Cloudflare Tunnel': {
    url: 'https://www.cloudflare.com/products/tunnel/',
    color: '#F38020',
    category: 'Infra & Deploy',
  },
  'GitHub Pages': {
    url: 'https://pages.github.com',
    color: '#181717',
    category: 'Infra & Deploy',
  },
  TensorFlow: {
    url: 'https://www.tensorflow.org',
    color: '#FF6F00',
    category: 'AI/ML',
  },
};
