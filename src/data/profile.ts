import { certs } from './certImages';
import type { Cert } from './certImages';

export type TimelineEntry = {
  period: string;
  title: string;
  titleEn: string;
  /** 이 항목의 수료증/증명서 (있으면 작은 확인 버튼이 노출됨) */
  cert?: Cert;
};

export type Highlight = {
  /** 아이콘(이모지) */
  icon: string;
  value: string;
  valueEn: string;
  label: string;
  labelEn: string;
  sub: string;
  subEn: string;
};

export const profile = {
  name: 'Jiwon Jeong',
  nameKo: '정지원',
  email: 'wondev112@gmail.com',
  github: 'https://github.com/jiwonsudo',
  linkedin: 'https://www.linkedin.com/in/지원-정-747b16301/',
  blog: 'https://jiwonco.tistory.com',
  // 이력서 URL(구글드라이브/노션 공개링크) 또는 public/에 넣은 PDF 경로(예: '/resume.pdf').
  // 비워두면 이력서 버튼이 숨겨집니다.
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
  quote: '知之者不如好之者 好之者不如樂之者',
  intro:
    '프론트엔드를 중심으로, 필요하면 서버·임베디드·시뮬레이션까지 직접 구현하며 제품을 끝까지 완성하는 소프트웨어 엔지니어입니다. 드론 비행제어기(ESP32)부터 로켓 엔진 시뮬레이터(MOC/CFD), 실사용자 1,000명을 넘긴 웹 서비스까지 스스로 만들고 배포해왔습니다. 화면 너머의 흐름을 설계하고, 아이디어를 실제로 동작하는 결과물로 만드는 데 집중합니다.',
  introEn:
    'A software engineer who works from the frontend but reaches into servers, embedded systems, and simulation to take products all the way to completion. From an ESP32 drone flight controller to a rocket-engine simulator (MOC/CFD) and a web service that passed 1,000 real users, I build and ship things myself. I design the flow beyond the screen and turn ideas into things that actually run.',
};

/** About·Home에 노출할 핵심 성과 하이라이트 */
export const highlights: Highlight[] = [
  {
    icon: '👥',
    value: '1,088+',
    valueEn: '1,088+',
    label: '서비스 실사용자 확보',
    labelEn: 'Real users served',
    sub: '상명대 서버상태 확인',
    subEn: 'SMU Server Status Viewer',
  },
  {
    icon: '🏆',
    value: '1위',
    valueEn: '1st',
    label: '해커톤 대상',
    labelEn: 'Hackathon grand prize',
    sub: '멋쟁이사자처럼 SMU 교내',
    subEn: 'LIKELION UNIV · SMU',
  },
  {
    icon: '🎖️',
    value: '우수상',
    valueEn: 'Distinction',
    label: '군 창업경진대회',
    labelEn: 'Army startup competition',
    sub: '제5기갑여단 여단장상',
    subEn: "5th Armored Brigade · Commander's Award",
  },
  {
    icon: '🧩',
    value: '6+',
    valueEn: '6+',
    label: '다룬 분야',
    labelEn: 'Domains built in',
    sub: '웹 · 백엔드 · 앱 · 임베디드 · AI · 시뮬레이션',
    subEn: 'Web · Backend · App · Embedded · AI · Simulation',
  },
];

export type Credential = {
  /** 분류 라벨 (예: '어학', '자격증') */
  kind: string;
  kindEn: string;
  name: string;
  /** 점수·등급 등 */
  detail?: string;
};

/**
 * 어학 성적 · 자격증 등.
 * 실제 취득 내역으로 자유롭게 추가/수정하세요 (비어 있으면 섹션이 숨겨집니다).
 */
export const credentials: Credential[] = [
  // 예시 — 실제 값으로 교체하세요
  { kind: '어학', kindEn: 'Language', name: 'TOEIC', detail: '905' },
  // { kind: '어학', kindEn: 'Language', name: 'OPIc', detail: 'IM' },
  // {
  //   kind: '자격증',
  //   kindEn: 'Certificate',
  //   name: '정보처리기사',
  //   detail: '취득',
  // },
];

export const experiences: TimelineEntry[] = [
  {
    period: 'Mar 2026 – Jul 2026',
    title: "Let's SOPT 38기 웹파트 수료",
    titleEn: "Let's SOPT (38th) · Web part",
    cert: certs.find((c) => c.name.includes('SOPT')),
  },
  {
    period: 'Jan 2024 – Jun 2024',
    title: 'DIAS ICT 하드웨어 & 리눅스 관리 계약직 근무',
    titleEn: 'Worked in Hardware & Linux Management at DIAS ICT',
  },
  {
    period: 'Jan 2023 – Dec 2023',
    title: '멋쟁이사자처럼 대학 11기 프론트엔드 수료',
    titleEn: 'LIKELION UNIV (11th) · Front-End',
    cert: certs.find((c) => c.name.includes('멋쟁이사자처럼')),
  },
  {
    period: 'Mar 2021 – Feb 2023',
    title: '고교 소프트웨어 중점 교육과정 수료',
    titleEn: 'High school SW Intensive Education Course',
  },
  {
    period: 'Dec 2020',
    title: '프로그래밍 시작',
    titleEn: 'Started Programming',
  },
];

export const educations: TimelineEntry[] = [
  {
    period: 'Mar 2023 – Present',
    title: '상명대학교 컴퓨터과학전공',
    titleEn: 'Sangmyung Univ. · Computer Science',
  },
  {
    period: 'Mar 2020 – Feb 2023',
    title: '매천고등학교',
    titleEn: 'Maecheon High School',
  },
];

export const awards: TimelineEntry[] = [
  {
    period: 'Sep 2024',
    title: '육군 제5회 철풍창업경진대회 우수상 (제5기갑여단 여단장상)',
    titleEn:
      "ROKA 5th Cheolpung Startup Competition · 2nd Place (Commander's Award)",
  },
  {
    period: 'Jun 2023',
    title: '멋쟁이사자처럼 대학 11기 상명대 교내 해커톤 1위',
    titleEn: '11th LIKELION UNIV Campus Hackathon (SMU) · Grand Prize',
  },
  {
    period: 'Dec 2021',
    title: '매천고등학교 교내 소프트웨어 공모전 최우수상',
    titleEn: 'MCHS Software Competition · Grand Prize',
  },
];
