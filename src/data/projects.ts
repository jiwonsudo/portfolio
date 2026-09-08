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
  '웹 파트': 'Web part',
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
    slug: 'smuon',
    title: 'SMUON',
    titleKo: '스뮤온 | 상명대학교 서버상태 확인',
    categories: ['Web', 'Backend', 'AI'],
    display: 'mobile',
    date: 'May 2025',
    role: '1인 개발',
    description:
      '상명대학교 주요 웹서비스의 서버 상태 현황을 확인할 수 있는 웹서비스',
    descriptionEn:
      "A web service that allows you to check the server status of Sangmyung University's major web services",
    detail:
      "상명대 이캠퍼스 서버 장애로 학생들이 원인도 모른 채 빈 화면만 보던 상황에서, 상명대 주요 서비스의 접속 여부와 응답 속도를 실시간으로 보여주는 모니터링 서비스를 수일 만에 만들어 배포했습니다. 에브리타임 Hot 게시물에 오르며 누적 1,088명이 사용했고, 이캠퍼스 정상화 후 비용을 아끼려 서비스를 종료했다가 2026년 재장애 때 자발적으로 리디자인해 재오픈, 총 활성 사용자 1,245명을 확보했습니다. 기술 선택에는 매번 근거를 두었습니다. 검색 노출을 위해 CSR인 CRA를 SSR이 가능한 Next.js로 전면 이관하고 SEO·Lighthouse 최적화와 서치콘솔 등록을 병행해 구글 '상명대 서버' 검색 5위에 올렸습니다. 백엔드는 Render 프리티어 콜드스타트를 줄이려 Express에서 Go(표준 라이브러리)로 재작성하고, ISR·SSE·서버측 캐시로 첫 렌더 지연과 방문자 수에 따른 외부 트래픽 증가를 함께 잡았습니다. 알림은 사업자 인증이 필요한 카카오 대신 Discord 웹훅으로 구현했습니다. 최근에는 과거 장애 이력을 RAG로 검색·참조해 현재 오류의 지속 여부를 판정하는 AI 분석 기능을 추가했습니다. 요청당이 아닌 장애 확정 시점 1회 호출과 SQL 기반 retrieval로 유사 장애 이력을 근거 문서로 넣는 RAG 파이프라인, 구조화 출력으로 비용과 환각을 통제했고, 이력 백필 과정에서는 복원한 데이터의 58%가 CI 아티팩트임을 확인해 걸러냈습니다. 실제 문제에서 출발해 실사용자를 모으고, 인프라·SEO·AI까지 근거를 갖고 직접 설계·운영한 프로젝트입니다.",
    stack: [
      'Next.js',
      'Go',
      'Supabase',
      'React',
      'Axios',
      'Express.js',
      'Styled-Components',
      'Vercel',
      'Render',
      'Google Analytics',
    ],
    detailEn:
      "When an outage of Sangmyung University's e-Campus server left students staring at blank screens with no idea what was wrong, I built and shipped — in a matter of days — a monitoring service that shows the reachability and response time of SMU's main services in real time. It hit Everytime's Hot board and was used by 1,088 people in total. After e-Campus recovered I shut the service down to save costs, then voluntarily redesigned and relaunched it during a second outage in 2026, reaching 1,245 active users. Every technical choice had a reason behind it. For search visibility I migrated the whole front-end from CRA (client-side rendering) to Next.js (server-side rendering), and paired that with SEO and Lighthouse optimization and Search Console registration to reach 5th place on Google for the query \"상명대 서버\" (SMU server). For the back-end, I rewrote Express in Go (standard library only) to cut cold starts on Render's free tier, and used ISR, SSE, and server-side caching to tackle both first-render latency and the growth in outbound traffic that scales with visitor count. For alerts, instead of KakaoTalk — which requires business verification — I used Discord webhooks. More recently I added an AI analysis feature that uses RAG to retrieve and reference past outage history and judge whether a current error is likely to persist. I kept cost and hallucination under control with a single call at the moment an outage is confirmed (rather than per request), a RAG pipeline that uses SQL-based retrieval to feed similar past outages in as grounding documents, and structured output; during the history backfill I found that 58% of the recovered data was CI artifacts and filtered it out. It's a project that started from a real problem, drew real users, and that I designed and operated end to end — infrastructure, SEO, and AI — with a rationale for each decision.",
    demoUrl: 'https://www.issmuok.site',
    demoLabel: 'Site',
    githubUrl: 'https://github.com/jiwonsudo/SMU-Server-Status-Viewer',
    featured: true,
    highlight: '활성 사용자 1,245명',
    highlightEn: '1,245 active users',
  },
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
    highlight: 'PV/Session 3.9회',
    highlightEn: '3.9 Pages / Session',
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
    context: "Let's SOPT 38th",
    role: '웹 파트',
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
      '상용 LLM 등장 이전, 텍스트 분류 챗봇의 ML 파이프라인을 구현한 학교 소개 챗봇 만들기 프로젝트',
    descriptionEn:
      'A school-guide chatbot project built before commercial LLMs existed, implementing the full ML pipeline for text classification from scratch.',
    detail:
      '매천고등학교 재학 시절인 2022년, 팀원 4명과 함께 학교 생활 안내를 위한 AI 챗봇 MaeChat을 제작했습니다. 당시는 ChatGPT 출시 이전으로 LLM API를 활용해 챗봇을 만드는 방식 자체가 존재하지 않았던 시기였기에, 텍스트 분류 모델을 직접 설계하고 학습시키는 방식을 택했습니다. 한국어는 영어와 달리 띄어쓰기만으로 형태소를 구분할 수 없는 언어적 특성을 고려해 Komoran 형태소 분석기로 문장에서 조사 등 불필요한 품사를 제거하고 의미 있는 어휘만 추출하는 전처리 로직을 직접 구현했습니다. 추출된 어휘로 사전을 구성하고 각 문장을 Bag-of-Words 벡터로 변환한 뒤, Dense(128)-Dropout-Dense(64)-Dropout-Softmax 구조의 신경망을 Keras로 설계해 SGD 옵티마이저로 200 epoch 학습시켜 사용자 발화의 의도(intent)를 분류하도록 했습니다. 학습된 모델은 chatbot_model.h5로 저장해 실서비스에서 재사용했습니다. 텍스트 기반 응답뿐 아니라 STT/TTS를 결합해 음성으로도 대화가 가능하도록 확장했으며, 정적인 답변만으로는 대응할 수 없는 날씨 정보는 실시간 크롤링을 붙여 처리했고, 급식 메뉴 조회 기능도 함께 구현해 학교 생활에 실질적으로 쓰일 수 있는 형태로 만들었습니다. 다만 Bag-of-Words 기반 분류는 단어의 유무만 반영할 뿐 어순과 문맥 정보를 반영하지 못한다는 한계가 있어, 부정 표현이 포함된 문장에서 의도가 뒤바뀌어 분류되는 경우가 발생했습니다. 또한 intents.json에 사전 정의된 패턴과 태그 범위 안에서만 응답이 가능한 폐쇄형 구조였기 때문에, 학습되지 않은 질문이 입력되면 가장 유사한 기존 태그로 잘못 분류되어 문맥에 맞지 않는 답변을 내놓는 경우가 있었습니다. 학습 데이터 역시 고교 프로젝트 규모로 수집되어 패턴 다양성이 제한적이었던 만큼, 표현이 조금만 달라져도 오분류 가능성이 높았던 구조였습니다.',
    stack: [
      'Python',
      'Komoran',
      'TensorFlow',
      'Keras',
      'NumPy',
      'Pickle',
      'SpeechRecognition',
      'gTTS',
      'BeautifulSoup',
    ],
    detailEn:
      "In 2022, while attending Maecheon High School, I built MaeChat, an AI chatbot for school life guidance, together with three teammates. This was before ChatGPT's release, at a time when building a chatbot using an LLM API simply wasn't an option — so I designed and trained a text classification model from scratch instead. Since Korean, unlike English, can't be tokenized by whitespace alone, I implemented a preprocessing pipeline using the Komoran morphological analyzer to strip out unnecessary parts of speech (such as particles) and extract meaningful vocabulary from each sentence. I built a vocabulary from the extracted words, converted each sentence into a Bag-of-Words vector, and designed a neural network in Keras with a Dense(128)-Dropout-Dense(64)-Dropout-Softmax architecture, training it for 200 epochs with an SGD optimizer to classify user utterances by intent. The trained model was saved as chatbot_model.h5 and reused in the live service. Beyond text-based responses, I integrated STT/TTS to enable voice-based conversation, added real-time weather crawling to handle information that static responses couldn't cover, and implemented a school lunch menu lookup feature — making the chatbot practically useful for everyday school life. That said, the Bag-of-Words approach only captures whether a word is present, not word order or context, which caused misclassification in sentences containing negation, where the intent was sometimes flipped entirely. The system was also a closed-domain structure that could only respond within the patterns and tags predefined in intents.json — any unlearned question would get misclassified into the closest existing tag, producing answers that didn't fit the actual question. The training data itself was collected at high-school project scale, so pattern diversity was limited, meaning even slight variations in phrasing could easily lead to misclassification.",
    contribution:
      'LLM API가 존재하지 않던 시기에, 한국어 형태소 분석부터 벡터화·신경망 학습·배포까지 텍스트 분류 챗봇의 전체 ML 파이프라인을 직접 구현해 보았습니다.',
    contributionEn:
      "Implemented the full ML pipeline for a text-classification chatbot — Korean morphological analysis, vectorization, neural network training, and deployment — entirely from scratch, at a time when LLM APIs didn't yet exist.",
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
