export type TechCategory =
  | 'Frontend'
  | '3D & Graphics'
  | 'Backend'
  | 'Database'
  | 'Mobile'
  | 'Embedded'
  | 'AI/ML'
  | 'Infra & Deploy'
  | 'Tooling';

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
  'Database',
  'Mobile',
  'Embedded',
  'AI/ML',
  'Infra & Deploy',
  'Tooling',
];

/**
 * 기술 스택별 공식 링크 + 브랜드 컬러 + 용도 분류.
 * projects.ts의 stack 값에서 쓰이는 이름을 키로 갖는다.
 * (여기 없는 스택은 About에서 '기타' 그룹의 회색 칩으로 자동 노출된다)
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
  'Vanilla Extract': {
    url: 'https://vanilla-extract.style',
    color: '#E64980',
    category: 'Frontend',
  },
  'TanStack Query': {
    url: 'https://tanstack.com/query',
    color: '#FF4154',
    category: 'Frontend',
  },
  'React Router': {
    url: 'https://reactrouter.com',
    color: '#F44250',
    category: 'Frontend',
  },
  'Framer Motion': {
    url: 'https://motion.dev',
    color: '#0055FF',
    category: 'Frontend',
  },
  Zustand: {
    url: 'https://zustand.docs.pmnd.rs',
    color: '#4B3F33',
    category: 'Frontend',
  },
  Axios: {
    url: 'https://axios-http.com',
    color: '#5A29E4',
    category: 'Frontend',
  },
  'Math.js': {
    url: 'https://mathjs.org',
    color: '#DB4C69',
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
  Django: {
    url: 'https://www.djangoproject.com',
    color: '#0C4B33',
    category: 'Backend',
  },
  Spring: {
    url: 'https://spring.io',
    color: '#6DB33F',
    category: 'Backend',
  },
  Python: {
    url: 'https://www.python.org',
    color: '#3776AB',
    category: 'Backend',
  },
  JWT: { url: 'https://jwt.io', color: '#FB015B', category: 'Backend' },
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
  Supabase: {
    url: 'https://supabase.com',
    color: '#3ECF8E',
    category: 'Database',
  },
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
  'C++': {
    url: 'https://isocpp.org',
    color: '#00599C',
    category: 'Embedded',
  },
  ESP32: {
    url: 'https://www.espressif.com/en/products/socs/esp32',
    color: '#E7352C',
    category: 'Embedded',
  },
  PlatformIO: {
    url: 'https://platformio.org',
    color: '#F5822A',
    category: 'Embedded',
  },
  Arduino: {
    url: 'https://www.arduino.cc',
    color: '#00979D',
    category: 'Embedded',
  },
  'PID Control': {
    url: 'https://en.wikipedia.org/wiki/PID_controller',
    color: '#16A34A',
    category: 'Embedded',
  },
  TensorFlow: {
    url: 'https://www.tensorflow.org',
    color: '#FF6F00',
    category: 'AI/ML',
  },
  Keras: {
    url: 'https://keras.io',
    color: '#D00000',
    category: 'AI/ML',
  },
  Komoran: {
    url: 'https://github.com/shin285/KOMORAN',
    color: '#4A90D9',
    category: 'AI/ML',
  },
  NumPy: {
    url: 'https://numpy.org',
    color: '#013243',
    category: 'AI/ML',
  },
  Pickle: {
    url: 'https://docs.python.org/3/library/pickle.html',
    color: '#4B8BBE',
    category: 'AI/ML',
  },
  STT: {
    url: 'https://en.wikipedia.org/wiki/Speech_recognition',
    color: '#0EA5E9',
    category: 'AI/ML',
  },
  TTS: {
    url: 'https://en.wikipedia.org/wiki/Speech_synthesis',
    color: '#8B5CF6',
    category: 'AI/ML',
  },
  BeautifulSoup: {
    url: 'https://www.crummy.com/software/BeautifulSoup/',
    color: '#4F8A10',
    category: 'Backend',
  },
  Vercel: {
    url: 'https://vercel.com',
    color: '#111111',
    category: 'Infra & Deploy',
  },
  Render: {
    url: 'https://render.com',
    color: '#5A6BF5',
    category: 'Infra & Deploy',
  },
  'GitHub Pages': {
    url: 'https://pages.github.com',
    color: '#181717',
    category: 'Infra & Deploy',
  },
  'Cloudflare Tunnel': {
    url: 'https://www.cloudflare.com/products/tunnel/',
    color: '#F38020',
    category: 'Infra & Deploy',
  },
  Prettier: {
    url: 'https://prettier.io',
    color: '#F7B93E',
    category: 'Tooling',
    dark: true,
  },
  ESLint: {
    url: 'https://eslint.org',
    color: '#4B32C3',
    category: 'Tooling',
  },
  'Google Analytics': {
    url: 'https://analytics.google.com',
    color: '#E37400',
    category: 'Tooling',
  },
};
