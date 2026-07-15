export type ProjectCategory = 'Web' | 'App' | 'AI';

/** 대표 이미지를 어떤 기기 프레임으로 전시할지 */
export type ProjectDisplay = 'mobile' | 'desktop';

export type Project = {
  /** 이미지 파일명과 매칭되는 고유 slug */
  slug: string;
  /** 영문 표기 제목 */
  title: string;
  /** 한글 표기 제목 */
  titleKo: string;
  category: ProjectCategory;
  /** 'mobile' → 폰 프레임(카드에선 윗부분만) · 'desktop' → 모니터 프레임(전체) */
  display: ProjectDisplay;
  /** 진행 시기 (예: 'Nov 2023') */
  date: string;
  /** 소속 · 대회 등 맥락 (예: 'SMU', 'LikeLion UNIV 11기') */
  context?: string;
  /** 담당 역할 (예: '1인 개발', '프론트엔드 리더') */
  role: string;
  /** 함께한 팀 규모 (1인 개발이면 생략) */
  teamSize?: number;
  /** 카드용 한 줄 요약 */
  description: string;
  descriptionEn: string;
  /** 모달용 상세 설명 (여러 문단 가능) */
  detail?: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  /** 대표 스크린샷 (기기 프레임 안에 전시) */
  image?: string;
  /** 모달 캐러셀용 추가 사진들 — 생략 시 image 하나로 대체 */
  gallery?: string[];
  /** 대표작으로 강조할지 여부 */
  featured?: boolean;
};

export type CategoryMeta = {
  label: string;
  /** 카테고리 액센트 컬러 */
  color: string;
};
