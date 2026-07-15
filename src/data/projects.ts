import type { CategoryMeta, Project, ProjectCategory } from '../types';

/** 카테고리 노출 순서 + 라벨/컬러 */
export const categoryOrder: ProjectCategory[] = ['Web', 'App', 'AI'];

export const categoryMeta: Record<ProjectCategory, CategoryMeta> = {
  Web: { label: 'Web', color: '#6366f1' },
  App: { label: 'App', color: '#0ea5e9' },
  AI: { label: 'AI', color: '#8b5cf6' },
};

/**
 * 프로젝트 이미지는 폴더 구조로 관리한다:
 *   src/assets/projects/<slug>/대표/<한 장>      → 대표(썸네일) 사진
 *   src/assets/projects/<slug>/설명/<한 장~여러 장> → 모달 캐러셀 사진
 * 설명이 한 장이면 캐러셀 이동 없음, 여러 장이면 좌우 이동이 생긴다.
 * 파일만 넣으면 아래 glob이 자동으로 잡아준다 (설명은 파일명 순서로 정렬).
 */
const imageModules = import.meta.glob(
  '../assets/projects/*/*/*.{png,jpg,jpeg,webp}',
  { eager: true, import: 'default' },
) as Record<string, string>;

type Shots = { representative?: string; gallery: string[] };

// macOS 파일명은 NFD(분해형)로 저장돼 소스의 NFC 리터럴과 다를 수 있어 정규화 후 비교한다.
const REPRESENTATIVE = '대표'.normalize('NFC');

const shotsBySlug: Record<string, Shots> = {};
for (const path of Object.keys(imageModules).sort()) {
  const match = path.match(/\/projects\/([^/]+)\/([^/]+)\//);
  if (!match) continue;
  const [, slug, folder] = match;
  const shots = (shotsBySlug[slug] ??= { gallery: [] });
  if (folder.normalize('NFC') === REPRESENTATIVE) {
    shots.representative = imageModules[path];
  } else {
    shots.gallery.push(imageModules[path]);
  }
}

function imagesFor(slug: string): Pick<Project, 'image' | 'gallery'> {
  const shots = shotsBySlug[slug] ?? { gallery: [] };
  const image = shots.representative ?? shots.gallery[0];
  const gallery =
    shots.gallery.length > 0 ? shots.gallery : image ? [image] : [];
  return { image, gallery };
}

/**
 * 프로젝트를 추가하려면:
 * 1. src/assets/projects/<slug>/대표/ 에 대표 사진 한 장, 설명/ 에 설명 사진들을 넣는다
 * 2. 아래 배열 맨 앞(최신순)에 메타데이터를 추가 (slug 는 폴더명과 동일하게)
 */
const projectsMeta: Omit<Project, 'image' | 'gallery'>[] = [
  {
    slug: 'storyrail',
    title: 'StoryRail',
    titleKo: '스토리레일',
    category: 'Web',
    display: 'mobile',
    date: 'Nov 2023',
    context: 'SMU',
    role: '1인 개발',
    description:
      '유저가 선택지를 골라 스토리를 진행하며 자신만의 소설을 완성하는 React 기반 인터랙티브 소설 웹앱.',
    descriptionEn:
      'A React-based interactive novel web app where users craft their own story by choosing branching options.',
    detail:
      '사용자가 이야기의 분기 선택지를 고르며 자신만의 소설을 완성해 나가는 인터랙티브 소설 웹앱입니다. React로 상태 기반 스토리 분기를 구현하고, 선택에 따라 전개와 결말이 달라지는 구조를 설계했습니다. GitHub Pages로 배포해 누구나 접근할 수 있게 만들었습니다.',
    stack: ['React', 'Styled-Components', 'GitHub Pages'],
    githubUrl: 'https://github.com/jiwonsudo/Interactive-Novel-Webapp',
    featured: true,
  },
  {
    slug: 'ryak',
    title: 'Ryak',
    titleKo: '알약',
    category: 'Web',
    display: 'mobile',
    date: 'Sep 2023',
    context: 'SMU×IHU Big Data Contest',
    role: '프론트엔드 (웹)',
    teamSize: 4,
    description:
      '영상 처리와 빅데이터로 알약을 자동 인식·분류하고 복약을 관리하는 웹 서비스.',
    descriptionEn:
      'A web service that auto-recognizes and classifies pills via image processing and big data, then manages medication.',
    detail:
      '영상 처리와 빅데이터를 활용해 알약을 자동으로 인식·분류하고 복약 일정을 관리하는 웹 서비스입니다. SMU×IHU 빅데이터 공모전 출품작으로, 4인 팀에서 웹 프론트엔드를 맡아 알약 인식 결과와 복약 정보를 직관적으로 보여주는 화면을 구현했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'Amazon RDS'],
    githubUrl: 'https://github.com/jiwonsudo/RYAK',
    featured: true,
  },
  {
    slug: 'jikchon',
    title: 'Jikchon',
    titleKo: '직촌',
    category: 'Web',
    display: 'mobile',
    date: 'Aug 2023',
    context: 'LikeLion UNIV 11기',
    role: '프론트엔드',
    teamSize: 6,
    description:
      '중간 물류비 없이 농어촌 사업자가 개인 고객과 농수산물을 직거래하는 온라인 쇼핑몰.',
    descriptionEn:
      'An online marketplace letting rural producers trade fresh goods directly with customers, cutting out middle logistics costs.',
    detail:
      '농어촌 사업자가 중간 물류비 없이 개인 고객과 농수산물을 직거래할 수 있는 온라인 쇼핑몰입니다. 멋쟁이사자처럼 대학 11기 6인 팀 프로젝트로, 프론트엔드 개발을 담당해 상품 탐색과 주문 흐름을 구현했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Spring', 'MySQL', 'JWT'],
    githubUrl: 'https://github.com/jiwonsudo/jikchon-front',
    featured: true,
  },
  {
    slug: 'qrazy',
    title: 'Qrazy',
    titleKo: 'QR 주문 관리',
    category: 'Web',
    display: 'mobile',
    date: 'Jul 2023',
    context: 'LikeLion UNIV 11기',
    role: '프론트엔드 리더',
    teamSize: 9,
    description: 'QR 주문과 주문·매출 관리를 아우르는 키오스크형 영업 플랫폼.',
    descriptionEn:
      'A QR-based kiosk platform unifying ordering with order & sales management.',
    detail:
      'QR 주문과 주문·매출 관리를 아우르는 키오스크형 영업 플랫폼입니다. 9인 팀에서 프론트엔드 리더로 참여해 손님용 주문 흐름과 사장님용 관리 대시보드 UI를 설계하고 프론트엔드 개발을 리드했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'MySQL'],
    githubUrl: 'https://github.com/jiwonsudo/Lion-Ambition-Frontend',
    featured: true,
  },
  {
    slug: 'maechat',
    title: 'MaeChat',
    titleKo: '고등학교 안내 챗봇',
    category: 'AI',
    display: 'desktop',
    date: 'Jun 2022',
    role: '팀 리더',
    teamSize: 4,
    description:
      '매천고등학교의 길 안내와 정보 제공을 담당하는 TensorFlow 기반 AI 챗봇.',
    descriptionEn:
      'A TensorFlow-based AI chatbot guiding routes and info around Maecheon High School.',
    detail:
      '매천고등학교 교내 길 안내와 정보 제공을 담당하는 TensorFlow 기반 AI 챗봇입니다. 4인 팀의 팀 리더로 참여해 자연어 질의응답 모델 학습과 챗봇 대화 흐름 설계를 맡았습니다.',
    stack: ['Python', 'TensorFlow'],
    githubUrl: 'https://github.com/jiwonsudo/MaeChat',
  },
  {
    slug: 'charles-law',
    title: "Charles's Law Simulator",
    titleKo: '샤를의 법칙 시뮬레이터',
    category: 'App',
    display: 'desktop',
    date: 'Apr 2022',
    role: '1인 개발',
    description:
      'Processing으로 만든 이상기체 시뮬레이터. 화학 발표와 시뮬레이션 제작 연습을 위한 프로젝트.',
    descriptionEn:
      'An ideal-gas simulator built with Processing for a chemistry presentation and simulation practice.',
    detail:
      'Processing으로 제작한 이상기체(샤를의 법칙) 시뮬레이터입니다. 온도 변화에 따른 기체 부피 변화를 실시간으로 시각화하며, 화학 수업 발표와 시뮬레이션 제작 연습을 위해 1인으로 개발했습니다.',
    stack: ['Processing (Java)'],
    githubUrl: 'https://github.com/jiwonsudo/Chemistry_CharlesLaw_Experiment',
  },
  {
    slug: 'daegu-finder',
    title: 'Daegu Exhibition Finder',
    titleKo: '대구 전시회 검색 앱',
    category: 'App',
    display: 'mobile',
    date: 'Feb 2022',
    role: '1인 개발',
    description:
      'Swift에서의 API 통신과 JSON 파싱을 연습하기 위해 만든 iOS 전시회 검색 앱.',
    descriptionEn:
      'An iOS app for finding exhibitions in Daegu, built to practice API communication and JSON parsing in Swift.',
    detail:
      '대구 지역 전시회를 검색하는 iOS 앱입니다. Swift에서의 REST API 통신과 JSON 파싱을 연습하기 위해 1인으로 개발했으며, Alamofire로 네트워크 계층을 구성했습니다.',
    stack: ['Swift', 'Alamofire'],
    githubUrl: 'https://github.com/jiwonsudo/DaeguExhibitionFinder',
  },
  {
    slug: 'physics-wave',
    title: 'Wave & Refraction',
    titleKo: '파동 & 굴절 학습 앱',
    category: 'App',
    display: 'mobile',
    date: 'Dec 2021',
    role: '1인 개발',
    description:
      '파동의 굴절을 실험하고 학습하는 iOS 앱. 물리 수업 발표 및 소프트웨어 공모전 출품작.',
    descriptionEn:
      'An iOS app to experiment with and learn wave refraction — presented in physics class and entered in a software contest.',
    detail:
      '파동의 굴절 현상을 직접 조작하며 학습하는 iOS 앱입니다. 입사각에 따른 굴절을 시각적으로 확인할 수 있으며, 물리 수업 발표와 소프트웨어 공모전 출품을 위해 1인으로 개발했습니다.',
    stack: ['Swift'],
    githubUrl: 'https://github.com/jiwonsudo/PhysicsExperiment',
  },
];

export const projectList: Project[] = projectsMeta.map((meta) => ({
  ...meta,
  ...imagesFor(meta.slug),
}));
