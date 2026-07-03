import type { Project, ProjectCategory } from '../types';
import charlesLaw from '../assets/projects/charles-law.png';
import daeguFinder from '../assets/projects/daegu-finder.png';
import jikchon from '../assets/projects/jikchon.png';
import maechat from '../assets/projects/maechat.png';
import physicsWave from '../assets/projects/physics-wave.png';
import qrazy from '../assets/projects/qrazy.png';
import ryak from '../assets/projects/ryak.png';
import storyrail from '../assets/projects/storyrail.png';

/**
 * 프로젝트를 추가하려면:
 * 1. 대표 이미지를 src/assets/projects/<slug>.png 로 추가
 * 2. 아래 배열에 항목 하나를 추가 (number는 자동 부여됨)
 */
type ProjectInput = Omit<Project, 'number'>;

const projects: ProjectInput[] = [
  {
    slug: 'storyrail',
    title: 'StoryRail',
    titleKo: '스토리레일',
    category: 'Web',
    period: 'Nov 2023 · SMU',
    role: '1인 개발',
    description:
      '유저가 선택지를 골라 스토리를 진행하며 자신만의 소설을 완성하는 React 기반 인터랙티브 소설 웹앱.',
    descriptionEn:
      'A React-based interactive novel web app where users craft their own story by choosing branching options.',
    stack: ['React', 'Styled-Components', 'GitHub Pages'],
    githubUrl: 'https://github.com/jiwonsudo/Interactive-Novel-Webapp',
    image: storyrail,
    featured: true,
  },
  {
    slug: 'ryak',
    title: 'Ryak',
    titleKo: '알약',
    category: 'Web',
    period: 'Sep 2023 · SMU×IHU Big Data Contest',
    role: '프론트엔드 (웹)',
    description:
      '영상 처리와 빅데이터로 알약을 자동 인식·분류하고 복약을 관리하는 웹 서비스. 4인 팀 프로젝트.',
    descriptionEn:
      'A web service that auto-recognizes and classifies pills via image processing and big data, then manages medication. Built by a team of 4.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'Amazon RDS'],
    githubUrl: 'https://github.com/jiwonsudo/RYAK',
    image: ryak,
    featured: true,
  },
  {
    slug: 'jikchon',
    title: 'Jikchon',
    titleKo: '직촌',
    category: 'Web',
    period: 'Aug 2023 · LikeLion UNIV 11기',
    role: '프론트엔드',
    description:
      '중간 물류비 없이 농어촌 사업자가 개인 고객과 농수산물을 직거래하는 온라인 쇼핑몰. 6인 팀 프로젝트.',
    descriptionEn:
      'An online marketplace letting rural producers trade fresh goods directly with customers, cutting out middle logistics costs. Team of 6.',
    stack: ['JavaScript', 'HTML/CSS', 'Spring', 'MySQL', 'JWT'],
    githubUrl: 'https://github.com/jiwonsudo/jikchon-front',
    image: jikchon,
    featured: true,
  },
  {
    slug: 'qrazy',
    title: 'Qrazy',
    titleKo: 'QR 주문 관리',
    category: 'Web',
    period: 'Jul 2023 · LikeLion UNIV 11기',
    role: '프론트엔드 리더',
    description:
      'QR 주문과 주문·매출 관리를 아우르는 키오스크형 영업 플랫폼. 9인 팀에서 프론트엔드 리드.',
    descriptionEn:
      'A QR-based kiosk platform unifying ordering with order & sales management. Led front-end in a 9-person team.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'MySQL'],
    githubUrl: 'https://github.com/jiwonsudo/Lion-Ambition-Frontend',
    image: qrazy,
    featured: true,
  },
  {
    slug: 'charles-law',
    title: "Charles's Law Simulator",
    titleKo: '샤를의 법칙 시뮬레이터',
    category: 'App',
    period: 'Apr 2022',
    role: '1인 개발',
    description:
      'Processing으로 만든 이상기체 시뮬레이터. 화학 발표와 시뮬레이션 제작 연습을 위한 프로젝트.',
    descriptionEn:
      'An ideal-gas simulator built with Processing for a chemistry presentation and simulation practice.',
    stack: ['Processing (Java)'],
    githubUrl: 'https://github.com/jiwonsudo/Chemistry_CharlesLaw_Experiment',
    image: charlesLaw,
  },
  {
    slug: 'daegu-finder',
    title: 'Daegu Exhibition Finder',
    titleKo: '대구 전시회 검색 앱',
    category: 'App',
    period: 'Feb 2022',
    role: '1인 개발',
    description:
      'Swift에서의 API 통신과 JSON 파싱을 연습하기 위해 만든 iOS 전시회 검색 앱.',
    descriptionEn:
      'An iOS app for finding exhibitions in Daegu, built to practice API communication and JSON parsing in Swift.',
    stack: ['Swift', 'Alamofire'],
    githubUrl: 'https://github.com/jiwonsudo/DaeguExhibitionFinder',
    image: daeguFinder,
  },
  {
    slug: 'physics-wave',
    title: 'Wave & Refraction',
    titleKo: '파동 & 굴절 학습 앱',
    category: 'App',
    period: 'Dec 2021',
    role: '1인 개발',
    description:
      '파동의 굴절을 실험하고 학습하는 iOS 앱. 물리 수업 발표 및 소프트웨어 공모전 출품작.',
    descriptionEn:
      'An iOS app to experiment with and learn wave refraction — presented in physics class and entered in a software contest.',
    stack: ['Swift'],
    githubUrl: 'https://github.com/jiwonsudo/PhysicsExperiment',
    image: physicsWave,
  },
  {
    slug: 'maechat',
    title: 'MaeChat',
    titleKo: '고등학교 안내 챗봇',
    category: 'Other',
    period: 'Jun 2022',
    role: '팀 리더',
    description:
      '매천고등학교의 길 안내와 정보 제공을 담당하는 TensorFlow 기반 AI 챗봇. 4인 팀 리드.',
    descriptionEn:
      'A TensorFlow-based AI chatbot guiding routes and info around Maecheon High School. Led a team of 4.',
    stack: ['Python', 'TensorFlow'],
    githubUrl: 'https://github.com/jiwonsudo/MaeChat',
    image: maechat,
  },
];

/** 키치한 팝 컬러 — 카드/라벨에서 index 순환으로 사용 */
export const accentPalette = [
  '#ff6b6b',
  '#ffd23f',
  '#4ecdc4',
  '#5b8cff',
  '#c77dff',
  '#ff8c42',
  '#2ec4b6',
  '#ff5da2',
];

export const categoryLabels: Record<ProjectCategory, string> = {
  App: 'App',
  Other: 'Others',
  Web: 'Web',
};

export const projectList: Project[] = projects.map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, '0'),
}));

/** 홈 3D 갤러리에 노출할 대표작 */
export const featuredProjects: Project[] = projectList.filter(
  (project) => project.featured,
);

/** /projects 페이지에서 카테고리별로 묶어 보여주기 위한 그룹 */
export const categoryOrder: ProjectCategory[] = ['Web', 'App', 'Other'];

export const projectsByCategory: {
  category: ProjectCategory;
  label: string;
  items: Project[];
}[] = categoryOrder
  .map((category) => ({
    category,
    label: category === 'Web' ? 'Web-based' : category === 'App' ? 'App-based' : 'Others',
    items: projectList.filter((project) => project.category === category),
  }))
  .filter((group) => group.items.length > 0);
