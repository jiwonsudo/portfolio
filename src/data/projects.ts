import type { CategoryMeta, Project, ProjectCategory } from '../types';

/** 카테고리 노출 순서 + 라벨/컬러 */
export const categoryOrder: ProjectCategory[] = [
  'Web',
  'Backend',
  'App',
  'AI',
  'Embedded',
  'Simulation',
];

export const categoryMeta: Record<ProjectCategory, CategoryMeta> = {
  Web: { label: 'Web', labelKo: '웹', color: '#2563eb' }, // 블루
  Backend: { label: 'Backend', labelKo: '백엔드', color: '#0891b2' }, // 시안
  App: { label: 'App', labelKo: '앱', color: '#ec4899' }, // 핑크
  AI: { label: 'AI', labelKo: 'AI', color: '#a855f7' }, // 퍼플
  Embedded: { label: 'Embedded', labelKo: '임베디드', color: '#16a34a' }, // 그린
  Simulation: {
    label: 'Simulation',
    labelKo: '시뮬레이션',
    color: '#f97316',
  }, // 오렌지
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** 'MMM YYYY'(예: 'Nov 2023')를 정렬용 숫자로 변환. 값이 클수록 최신. */
export function dateSortKey(date: string): number {
  const match = date.match(/([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return 0;
  const month = MONTHS.indexOf(match[1]);
  return Number(match[2]) * 12 + (month < 0 ? 0 : month);
}

/** 역할(role) 한→영 매핑. 없는 값은 원문 그대로 노출. */
const ROLE_EN: Record<string, string> = {
  '1인 개발': 'Solo project',
  프론트엔드: 'Front-end',
  '프론트엔드 리더': 'Front-end lead',
  '팀 리더': 'Team lead',
  'Web part': 'Web part',
  'FC 프로그래밍 & 하드웨어 제작': 'FC firmware & hardware',
  'SW 개발(예술전공 협업)': 'SW dev (art-major collab)',
};

export function roleLabel(role: string, lang: 'ko' | 'en'): string {
  return lang === 'en' ? (ROLE_EN[role] ?? role) : role;
}

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
    slug: 'finch',
    title: 'Finch',
    titleKo: '핀치',
    categories: ['Web'],
    display: 'mobile',
    date: 'Jun 2026',
    role: '1인 개발',
    description:
      '매일 5분 경제 학습 앱 「핀치」의 사전 출시 랜딩 — 웨이팅리스트 이메일 수집 데모',
    descriptionEn:
      'A pre-launch landing (email waitlist) demo for Finch, a five-minutes-a-day economics learning app',
    detail:
      '"작은 새가 물어다 주는, 매일 경제 한 입" — 매일 5분으로 경제 개념을 익히는 학습 앱 「핀치」의 사전 출시 랜딩입니다. 정식 앱 대신, 서비스 컨셉을 소개하고 웨이팅리스트 이메일을 수집하는 데모로 공개했습니다. React·TypeScript로 개발하고 Supabase로 수집한 이메일을 저장·관리했으며, Framer Motion으로 부드러운 화면 전환을, React Router로 화면 흐름을 구성했습니다. 서비스 워커·매니페스트를 붙여 설치형 PWA로 만들었고, 스타일링·빌드·배포는 Tailwind CSS·Vite·Vercel을 사용했습니다. 공개 약 한 달 뒤 애널리틱스 기준 방문자 90명·페이지뷰 354회(방문당 약 3.9페이지)·이탈률 40%로, 규모는 작지만 방문자당 체류와 탐색이 활발했습니다. 1인 개발 프로젝트입니다.',
    stack: [
      'React',
      'TypeScript',
      'Supabase',
      'Tailwind CSS',
      'Framer Motion',
      'React Router',
      'Vercel',
    ],
    detailEn:
      '"A little bird brings you a daily bite of economics" — this is the pre-launch landing for Finch, a five-minutes-a-day economics learning app. Instead of the full app, it ships as a demo that introduces the concept and collects waitlist emails. Built with React and TypeScript, it stores the collected emails via Supabase, uses Framer Motion for smooth transitions, and wires screens with React Router. A service worker plus manifest make it an installable PWA, styled and shipped with Tailwind CSS, Vite and Vercel. About a month after release, analytics showed 90 visitors and 354 page views (~3.9 pages per visit) at a 40% bounce rate — modest in scale but with strong per-visitor engagement. A solo project.',
    demoUrl: 'https://finch-iota.vercel.app',
    githubUrl: 'https://github.com/jiwonsudo/finch',
    featured: true,
    highlight: '방문당 3.9페이지',
    highlightEn: '3.9 pages / visit',
  },
  {
    slug: 'vpl-engine-sim',
    title: 'Rocket Engine 1D Building Simulator',
    titleKo: '1D 로켓 엔진 시뮬레이터',
    categories: ['Simulation', 'Web'],
    display: 'desktop',
    date: 'May 2026',
    role: '1인 개발',
    description:
      'MOC/CFD 보정을 사용하는 1차원 등엔트로피 로켓 노즐 유동 최적화 시뮬레이터',
    descriptionEn:
      'A web-based, real-time rocket engine nozzle flow simulator that designs nozzle geometry with the Method of Characteristics (MOC) and corrects it with CFD, visualized in 3D',
    detail:
      '웹에서 실시간으로 로켓 엔진 노즐 유동을 설계·해석하는 시뮬레이터입니다. 1차원 등엔트로피 유동 방정식에 특성곡선법(MOC)으로 노즐 형상을 설계하고 CFD 결과로 보정해 추력·비추력·마하수 분포 등을 계산합니다. React Three Fiber(three.js)로 노즐과 배기 유동을 3D로 시각화하고, 엔진 사운드와 한/영 i18n을 제공합니다. 수치 계산은 math.js, 상태 관리는 Zustand로 처리했으며 Vite로 빌드해 웹에 배포(vpl.kro.kr/enginesim)했습니다. 1인 개발 프로젝트입니다.',
    stack: [
      'React',
      'TypeScript',
      'Three.js',
      'R3F',
      'Zustand',
      'Math.js',
      'Tailwind CSS',
    ],
    detailEn:
      'A web simulator that designs and analyzes rocket engine nozzle flow in real time. It designs the nozzle geometry from 1D isentropic flow equations using the Method of Characteristics (MOC) and corrects it against CFD results to compute thrust, specific impulse, Mach distribution and more. The nozzle and exhaust flow are visualized in 3D with React Three Fiber (three.js), with engine sound and KO/EN i18n. Numerical work runs on Math.js, state is managed with Zustand, and it is built with Vite and deployed to the web (vpl.kro.kr/enginesim). A solo project.',
    demoUrl: 'https://vpl.kro.kr/enginesim',
    githubUrl: 'https://github.com/jiwonsudo/vortex-propulsion-lab-engine-sim',
  },
  {
    slug: 'linkareer',
    title: 'Linkareer redesign project',
    titleKo: '링커리어 리디자인 프로젝트',
    categories: ['Web'],
    display: 'mobile',
    date: 'May 2026',
    context: 'SOPT',
    role: 'Web part',
    description:
      'SOPT 기획, 디자인, 웹, 서버 파트와 함께 링커리어 현직자에게 피드백을 받은 링커리어 모바일 웹 리디자인 프로젝트',
    descriptionEn:
      'Linkareer Mobile Web Redesign Project with Feedback from Current Employees, in Collaboration with SOPT’s Planning, Design, Web, and Server Part',
    detail:
      'Let’s sopt 38기 웹파트 합동세미나에서 진행한 링커리어 모바일 웹 리디자인 프로젝트입니다. 저는 홈 컴포넌트 & 페이지, GNB, SearchBar 제작과 개발, Prettier, Eslint 설정, 취업상세정보 & 후기 API 연동을 맡았습니다. 결과적으로 현직자 멘토님들께도 가시성과 유저 플로우 측면에서 좋은 피드백을 얻었고, 제대로 전문적인 기획, 디자인 팀과 협업해 볼 수 있는 좋은 기회였습니다.',
    stack: [
      'React',
      'Axios',
      'TanStack Query',
      'Prettier',
      'ESLint',
      'Vanilla Extract',
      'Vercel',
    ],
    detailEn:
      "A Linkareer mobile-web redesign built at the Let's SOPT 38th web-part joint seminar. I built the home components & page, the GNB and the SearchBar, set up Prettier/ESLint, and integrated the job-detail and review APIs. Current-employee mentors gave positive feedback on visibility and user flow, and it was a great chance to collaborate with a proper planning and design team.",
    contribution:
      '웹 파트로 참여해 홈 컴포넌트·페이지, GNB, SearchBar를 제작하고 취업상세정보·후기 API를 연동했으며, Prettier·ESLint 설정으로 협업 환경을 잡았습니다.',
    contributionEn:
      'As a web-part member I built the home components & page, the GNB, and the SearchBar, integrated the job-detail and review APIs, and set up Prettier/ESLint for the team.',
    githubUrl: 'https://github.com/SOPT-all/38-COLLABORATION-WEB-LINKAREER',
    featured: true,
    highlight: '현직자 피드백',
    highlightEn: 'Expert feedback',
  },
  {
    slug: 'smu-server-status-viewer',
    title: 'SMU-Server-Status-Viewer',
    titleKo: '상명대학교 서버상태 확인',
    categories: ['Web', 'Backend'],
    display: 'mobile',
    date: 'May 2025',
    role: '1인 개발',
    description:
      '상명대학교 주요 웹서비스의 서버 상태 현황을 확인할 수 있는 웹서비스',
    descriptionEn:
      "A web service that allows you to check the server status of Sangmyung University's major web services",
    detail:
      '상명대학교 이캠퍼스가 2025년 5월 연휴 전에 터져서 학생들이 서버 상태를 확인하지 못하고 Connection Timed Out 에러가 뜨는 것을 보고 빠르게 상명대 주요 홈페이지 서버 Status 홈페이지를 싸지방에서 만들어 올리게 되었습니다. Codespaces에서 CRA(Create-React-App), React 프로젝트로 제작, 스타일링에는 Styled-components 사용, 배포는 Vercel 사용했습니다. 첫 백엔드로 인한 언어 접근성을 고려, 또한 군대에서 개발을 위해 가벼운 Express.JS 사용했습니다. 구글 애널리틱스를 웹에 임베드하여 사용하여 웹에서 발생하는 이벤트와 사용자 수를 조사하였습니다. 구글 애널리틱스 사용하여 웹 이벤트 발생과 DAU, MAU 트래킹하였음. 에브리타임에 학교 서버가 다운된 시점에 마케팅 글을 올린 결과, 좋아요를 100개 이상 받으며 Hot 게시물에 올라갔습니다. 2025/6/2, 상명대학교 이캠퍼스 서버가 정상화되며 사용자 감소하여 최종 유저 1,088명 확보 후 서버 종료했습니다. 첫 백엔드 서버를 구축해본 점, 실제 제한적이나 마케팅을 통해 유저를 확보하고 처음으로 분석 툴을 사용해 유저 트래픽을 조사해 본 점은 긍정적이나, 서비스 특성상 유저 리텐션을 확보하지 못한 것이 아쉽습니다.',
    stack: [
      'React',
      'Axios',
      'Express.js',
      'Styled-Components',
      'Vercel',
      'Render',
      'Google Analytics',
    ],
    detailEn:
      "When SMU's e-Campus went down right before the May 2025 holiday and students only saw Connection Timed Out errors, I quickly built and shipped a status page for SMU's main services from the army internet café. Built as a CRA React project in Codespaces, styled with Styled-Components and deployed on Vercel. For my first backend I chose the lightweight Express.js — partly for language accessibility and to keep developing inside the army. I embedded Google Analytics to track web events and users (DAU/MAU). A marketing post on Everytime at the moment the server went down got 100+ likes and hit the Hot board. On 2025/6/2 e-Campus recovered, usage dropped, and I shut the server down after reaching 1,088 total users. Standing up my first backend and — in a limited way — acquiring users through marketing and analyzing traffic with an analytics tool for the first time were positive, though retention was hard to secure given the nature of the service.",
    githubUrl: 'https://github.com/jiwonsudo/SMU-Server-Status-Viewer',
    featured: true,
    highlight: '실사용자 1,088명',
    highlightEn: '1,088 real users',
  },
  {
    slug: 'storyrail',
    title: 'StoryRail',
    titleKo: '스토리레일',
    categories: ['Web'],
    display: 'mobile',
    date: 'Nov 2023',
    context: 'SMU',
    role: 'SW 개발(예술전공 협업)',
    description:
      '유저의 선택으로 자신만의 소설을 완성하는 React 기반 인터랙티브 소설 웹앱 서비스',
    descriptionEn:
      'A React-based interactive novel web app where users craft their own story by choosing branching options',
    detail:
      '다전공 교양에서 제작한 사용자가 이야기의 분기 선택지를 고르며 자신만의 소설을 완성해 나가는 인터랙티브 소설 웹앱입니다. React로 상태 기반 스토리 분기를 구현하고, 선택에 따라 전개와 결말이 달라지는 구조를 설계했습니다. GitHub Pages로 배포해 누구나 접근할 수 있게 만들었습니다.',
    stack: ['React', 'Styled-Components', 'GitHub Pages'],
    detailEn:
      'An interactive novel web app, built for a cross-major liberal-arts course, where users complete their own story by choosing branching options. I implemented state-based story branching in React and designed a structure where choices change the plot and the ending. Deployed on GitHub Pages so anyone can access it.',
    githubUrl: 'https://github.com/jiwonsudo/Interactive-Novel-Webapp',
  },
  {
    slug: 'tlal-drone',
    title: 'TLAL Drone Manufacturing & FC Development Project',
    titleKo: 'TLAL 드론 동체제작 & FC 개발 프로젝트',
    categories: ['Embedded'],
    display: 'default',
    date: 'Jan 2026',
    context: 'Tri-Legion Aerodynamics Lab(TLAL)',
    role: 'FC 프로그래밍 & 하드웨어 제작',
    description:
      '드론 개발 TLAL 팀에서 함께한 비행제어장치(FC) 및 드론 동체제작 & 비행시험 프로젝트',
    descriptionEn:
      'Flight Control System (FC) and Drone Manufacturing & Flight Testing Project with the TLAL Drone Development Team',
    detail:
      'TLAL(Tri-Legion Aerodynamics Lab) 팀의 첫 드론 프로젝트로, 드론 동체를 직접 제작하고 ESP32 기반 비행제어장치(FC)를 개발했습니다. FC 펌웨어는 C++/PlatformIO(Arduino 프레임워크)로 작성했으며, MPU6050 자이로·가속도 센서로 자세를 추정하고 QMC5883L 지자기 센서와 GPS로 방위·위치를, iBus 프로토콜로 조종기 입력을 받아 200Hz PID 제어 루프로 네 모터의 PWM을 실시간 제어합니다. 배터리 전압 모니터링까지 포함해 실제 비행시험을 진행했습니다. 센서·모터·배터리·GPS를 매니저 클래스로 모듈화해 유지보수성을 높였습니다.',
    stack: ['C++', 'ESP32', 'PlatformIO', 'Arduino', 'PID Control'],
    detailEn:
      "TLAL (Tri-Legion Aerodynamics Lab)'s first drone project: I built the airframe and developed an ESP32-based flight controller (FC). The FC firmware is written in C++/PlatformIO (Arduino framework); it estimates attitude from an MPU6050 gyro/accelerometer, gets heading/position from a QMC5883L magnetometer and GPS, takes transmitter input over the iBus protocol, and drives four motors' PWM in real time with a 200Hz PID loop. It includes battery-voltage monitoring and went through real flight tests. Sensors, motors, battery and GPS are modularized into manager classes for maintainability.",
    githubUrl: 'https://github.com/jiwonsudo/TLAL-Drone',
  },
  {
    slug: 'pokemon-sticker',
    title: 'Pokemon sticker maker',
    titleKo: '띠부씰 생성 웹서비스',
    categories: ['Web'],
    display: 'desktop',
    date: 'Feb 2024',
    role: '1인 개발',
    description:
      '마우스 움직임에 반응하는 인터랙션과 TypeScript 연습으로 만든, 나만의 포켓몬 띠부씰 생성 웹 토이 프로젝트',
    descriptionEn:
      'A toy web app for making your own Pokémon “Tibu-seal” stickers, built to practice TypeScript and mouse-driven interaction',
    detail:
      'React·TypeScript 템플릿으로 만든 포켓몬 띠부씰(스티커) 생성 토이 프로젝트입니다. 마우스 움직임에 반응하는 인터랙션과 TypeScript 타입 설계를 연습하기 위해 1인으로 제작했으며, 원하는 포켓몬으로 나만의 띠부씰을 꾸밀 수 있습니다.',
    stack: ['React', 'TypeScript', 'HTML/CSS'],
    detailEn:
      'A Pokémon “Tibu-seal” sticker-maker toy project built from a React + TypeScript template. I made it solo to practice TypeScript typing and mouse-driven interaction, letting you customize your own sticker with the Pokémon you like.',
    githubUrl: 'https://github.com/jiwonsudo/Pokemon-Sticker-Maker',
  },
  {
    slug: 'ryak',
    title: 'Ryak',
    titleKo: 'R약',
    categories: ['Web'],
    display: 'mobile',
    date: 'Sep 2023',
    context: 'SMU×IHU Big Data Contest',
    role: '프론트엔드',
    teamSize: 4,
    description:
      '실시간 이미지 처리기술과 한국약학원 데이터를 연동해 알약을 자동 인식·저장하고 복약을 관리하는 웹앱 서비스',
    descriptionEn:
      'A web service that auto-recognizes and classifies pills via image processing and big data, then manages medication',
    detail:
      '영상 처리와 빅데이터를 활용해 알약을 자동으로 인식·분류하고 복약 일정을 관리하는 웹 서비스입니다. 데이터는 한국약학원에서 사용했습니다. 2023 KT AICE와 함께하는 빅데이터 공모전 출품작으로, 4인 팀에서 웹 프론트엔드를 맡아 알약 인식 결과와 복약 정보를 직관적으로 보여주는 화면을 구현했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'Amazon RDS'],
    detailEn:
      'A web service that auto-recognizes and classifies pills with real-time image processing and Korea Pharmaceutical Information Institute data, then manages medication. Built for the 2023 Big Data contest with KT AICE by a team of 4 — I took the web front-end, building screens that present pill-recognition results and medication info intuitively.',
    contribution:
      '4인 팀에서 웹 프론트엔드를 맡아 알약 인식 결과와 복약 정보를 직관적으로 보여주는 화면을 구현했습니다.',
    contributionEn:
      'On a 4-person team I owned the web front-end, building the screens that present pill-recognition results and medication info.',
    githubUrl: 'https://github.com/jiwonsudo/RYAK',
  },
  {
    slug: 'jikchon',
    title: 'Jikchon',
    titleKo: '직촌',
    categories: ['Web'],
    display: 'mobile',
    date: 'Aug 2023',
    context: 'LikeLion UNIV 11기',
    role: '프론트엔드',
    teamSize: 6,
    description:
      '중간 물류비 없이 농어촌 사업자가 개인 고객과 농수산물을 직거래하는 온라인 쇼핑몰',
    descriptionEn:
      'An online marketplace letting rural producers trade fresh goods directly with customers, cutting out middle logistics costs',
    detail:
      '농어촌 사업자가 중간 물류비 없이 개인 고객과 농수산물을 직거래할 수 있는 온라인 쇼핑몰입니다. 멋쟁이사자처럼 대학 11기 6인 팀 프로젝트로, 프론트엔드 개발을 담당해 상품 탐색과 주문 흐름을 구현했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Spring', 'MySQL', 'JWT'],
    detailEn:
      'An online marketplace where rural producers trade fresh goods directly with individual customers, cutting out middle logistics costs. A 6-person LIKELION UNIV (11th) team project where I handled front-end development — product discovery and the ordering flow.',
    contribution:
      '6인 팀에서 프론트엔드 개발을 담당해 상품 탐색부터 주문까지 이어지는 사용자 흐름을 구현했습니다.',
    contributionEn:
      'On a 6-person team I handled front-end development, building the user flow from product discovery through checkout.',
    githubUrl: 'https://github.com/jiwonsudo/jikchon-front',
  },
  {
    slug: 'qrazy',
    title: 'Qrazy',
    titleKo: 'QR 주문 관리',
    categories: ['Web'],
    display: 'mobile',
    date: 'Jul 2023',
    context: 'LikeLion UNIV 11기',
    role: '프론트엔드 리더',
    teamSize: 9,
    description: 'QR 주문과 주문·매출 관리를 아우르는 키오스크형 영업 플랫폼',
    descriptionEn:
      'A QR-based kiosk platform unifying ordering with order & sales management',
    detail:
      'QR 주문과 주문·매출 관리를 아우르는 키오스크형 영업 플랫폼입니다. 9인 팀에서 프론트엔드 리더로 참여해 손님용 주문 흐름과 사장님용 관리 대시보드 UI를 설계하고 프론트엔드 개발을 리드했습니다.',
    stack: ['JavaScript', 'HTML/CSS', 'Django', 'MySQL'],
    detailEn:
      'A kiosk-style business platform spanning QR ordering and order/sales management. As front-end lead of a 9-person team, I designed the customer ordering flow and the owner-side management dashboard UI and led front-end development.',
    contribution:
      '9인 팀의 프론트엔드 리더로 손님용 QR 주문 흐름과 사장님용 관리 대시보드 UI를 설계하고 프론트엔드 개발을 리드했습니다.',
    contributionEn:
      'As front-end lead of a 9-person team, I designed the customer QR-ordering flow and the owner dashboard UI, and led front-end development.',
    githubUrl: 'https://github.com/jiwonsudo/Lion-Ambition-Frontend',
    highlight: '멋사 해커톤 1위',
    highlightEn: 'Likelion Hackathon Winner',
  },
  {
    slug: 'maechat',
    title: 'MaeChat',
    titleKo: '고등학교 안내 챗봇',
    categories: ['AI'],
    display: 'desktop',
    date: 'Jun 2022',
    role: '팀 리더',
    teamSize: 4,
    description:
      '매천고등학교의 길 안내와 정보 제공을 담당하는 TensorFlow 기반 AI 챗봇.',
    descriptionEn:
      'A TensorFlow-based AI chatbot guiding routes and info around Maecheon High School',
    detail:
      '매천고등학교 교내 길 안내와 정보 제공을 담당하는 TensorFlow 기반 AI 챗봇입니다. 4인 팀의 팀 리더로 참여해 자연어 질의응답 모델 학습과 챗봇 대화 흐름 설계를 맡았습니다.',
    stack: ['Python', 'TensorFlow'],
    detailEn:
      "A TensorFlow-based AI chatbot that guides routes and provides info around Maecheon High School. As the leader of a 4-person team, I handled training the natural-language Q&A model and designing the chatbot's conversation flow.",
    contribution:
      '4인 팀의 팀 리더로 자연어 질의응답 모델 학습과 챗봇 대화 흐름 설계를 맡았습니다.',
    contributionEn:
      'As leader of a 4-person team, I handled training the natural-language Q&A model and designing the chatbot conversation flow.',
    githubUrl: 'https://github.com/jiwonsudo/MaeChat',
  },
  {
    slug: 'charles-law',
    title: "Charles's Law Simulator",
    titleKo: '샤를의 법칙 시뮬레이터',
    categories: ['App', 'Simulation'],
    display: 'desktop',
    date: 'Apr 2022',
    role: '1인 개발',
    description: 'Processing으로 제작한 이상기체 샤를의 법칙 시뮬레이터',
    descriptionEn:
      'An ideal-gas simulator built with Processing for a chemistry presentation and simulation practice',
    detail:
      'Processing + JAVA로 제작한 이상기체(샤를의 법칙) 시뮬레이터입니다. 온도 변화에 따른 기체 부피 변화를 실시간으로 시각화하며, 화학 수업 발표와 시뮬레이션 제작 연습을 위해 1인으로 개발했습니다.',
    stack: ['Processing (Java)'],
    detailEn:
      "An ideal-gas (Charles's law) simulator built with Processing. It visualizes how gas volume changes with temperature in real time; built solo for a chemistry class presentation and to practice building simulations.",
    githubUrl: 'https://github.com/jiwonsudo/Chemistry_CharlesLaw_Experiment',
  },
  {
    slug: 'daegu-finder',
    title: 'Daegu Exhibition Finder',
    titleKo: '대구 전시회 검색 앱',
    categories: ['App'],
    display: 'mobile',
    date: 'Feb 2022',
    role: '1인 개발',
    description:
      'Swift에서의 API 통신, JSON 파싱 연습용 대구광역시 전시회 검색 iOS 앱',
    descriptionEn:
      'An iOS app for finding exhibitions in Daegu, built to practice API communication and JSON parsing in Swift',
    detail:
      '대구 지역 전시회를 검색하는 iOS 앱입니다. Swift에서의 REST API 통신과 JSON 파싱을 연습하기 위해 1인으로 개발했으며, Alamofire로 네트워크 계층을 구성했습니다.',
    stack: ['Swift', 'Alamofire'],
    detailEn:
      'An iOS app for finding exhibitions in Daegu. Built solo to practice REST API communication and JSON parsing in Swift, with the network layer built on Alamofire.',
    githubUrl: 'https://github.com/jiwonsudo/DaeguExhibitionFinder',
  },
  {
    slug: 'physics-wave',
    title: 'Wave & Refraction',
    titleKo: '파동 & 굴절 학습 앱',
    categories: ['App'],
    display: 'mobile',
    date: 'Dec 2021',
    role: '1인 개발',
    description:
      '고등학교 물리1 과정의 파동의 굴절을 실험하고 학습하는 교육용 iOS 앱',
    descriptionEn:
      'An iOS app to experiment with and learn wave refraction — presented in physics class and entered in a software contest',
    detail:
      '파동의 굴절 현상을 직접 조작하며 학습하는 iOS 앱입니다. 입사각에 따른 굴절을 시각적으로 확인할 수 있으며, 물리 수업 발표와 소프트웨어 공모전 출품을 위해 1인으로 개발했습니다.',
    stack: ['Swift'],
    detailEn:
      'An iOS app for hands-on learning of wave refraction. You can visually check refraction by angle of incidence; built solo for a physics class presentation and a software contest entry.',
    githubUrl: 'https://github.com/jiwonsudo/PhysicsExperiment',
    highlight: '교내 SW 공모전 최우수상',
    highlightEn: 'SW Contest · Grand Prize',
  },
];

export const projectList: Project[] = projectsMeta.map((meta) => ({
  ...meta,
  // 태그는 항상 알파벳 순으로 정렬 → 통일감 + 첫 태그 색이 포인트 컬러가 된다
  categories: [...meta.categories].sort(),
  ...imagesFor(meta.slug),
}));
