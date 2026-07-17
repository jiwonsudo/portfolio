import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'ko' | 'en';

/** UI 문구 사전 (콘텐츠 데이터는 각 항목의 *En 필드로 전환) */
const STRINGS = {
  ko: {
    'home.role': 'Frontend-based Software Engineer',
    'home.headline1': '필요하면,',
    'home.headline2': '직접 만듭니다.',
    'home.sub':
      '웹 화면부터 드론 비행제어기, 로켓 엔진 시뮬레이터까지 — 필요한 곳이면 직접 구현해 제품을 완성합니다.',
    'home.viewProjects': '프로젝트 보기 →',
    'home.about': '프로필',
    'home.highlightsOverline': 'At a Glance',
    'home.highlightsTitle': '핵심 성과',
    'home.selectedWork': 'Selected Work',
    'home.featuredTitle': '대표 프로젝트',
    'home.allProjects': '모든 프로젝트 보기 →',
    'projects.archive': 'Archive',
    'projects.works': 'Projects',
    'projects.intro':
      '간단한 아이디어를 확장하고, 여러 개발 도구로 구현하여 효과적으로 실력을 기르려 노력합니다.',
    'projects.hint': '각 프로젝트를 누르면 코드·상세 설명·추가 사진을 볼 수 있어요.',
    'sort.newest': '최신순',
    'sort.oldest': '시간순',
    'filter.all': '전체',
    'about.label': '프로필',
    'about.techTitle': '기술 스택',
    'about.techHint': '각 태그를 누르면 해당 기술의 공식 사이트로 이동합니다.',
    'about.etc': '기타',
    'about.certifications': '어학 · 자격증',
    'section.experience': '경력 · 활동',
    'section.education': '학력',
    'section.awards': '수상',
    'common.viewDetail': '자세히 보기 →',
    'common.featured': 'Featured',
    'common.skip': '본문으로 건너뛰기',
    'common.resume': '이력서',
    'modal.contribution': '핵심 기여',
    'notfound.msg': '길을 잃으셨나요? 집으로 모셔다드릴게요.',
    'notfound.home': '홈으로',
  },
  en: {
    'home.role': 'Frontend-based Software Engineer',
    'home.headline1': 'If it’s needed,',
    'home.headline2': 'I build it myself.',
    'home.sub':
      'From web screens to a drone flight controller and a rocket-engine simulator — I build whatever it takes to finish the product.',
    'home.viewProjects': 'View Projects →',
    'home.about': 'About',
    'home.highlightsOverline': 'At a Glance',
    'home.highlightsTitle': 'By the Numbers',
    'home.selectedWork': 'Selected Work',
    'home.featuredTitle': 'Featured Work',
    'home.allProjects': 'View all projects →',
    'projects.archive': 'Archive',
    'projects.works': 'Projects',
    'projects.intro':
      'I grow by expanding simple ideas and building them with a range of tools.',
    'projects.hint':
      'Tap any project to see the code, full write-up, and more screenshots.',
    'sort.newest': 'Newest',
    'sort.oldest': 'Oldest',
    'filter.all': 'All',
    'about.label': 'About',
    'about.techTitle': 'Tech & Tools',
    'about.techHint': 'Click a tag to open its official site.',
    'about.etc': 'Etc',
    'about.certifications': 'Certifications & Language',
    'section.experience': 'Experience',
    'section.education': 'Education',
    'section.awards': 'Awards',
    'common.viewDetail': 'View details →',
    'common.featured': 'Featured',
    'common.skip': 'Skip to content',
    'common.resume': 'Resume',
    'modal.contribution': 'My contribution',
    'notfound.msg': "Lost in space? Let's get you back home.",
    'notfound.home': 'Back home',
  },
} as const;

export type StringKey = keyof (typeof STRINGS)['ko'];

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: StringKey) => string;
  /** 팀 규모 문구 */
  team: (size: number) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('lang');
      if (saved === 'en' || saved === 'ko') return saved;
    }
    return 'ko';
  });

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem('lang', next);
    } catch {
      /* 무시 */
    }
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(
    () => setLang(lang === 'ko' ? 'en' : 'ko'),
    [lang, setLang],
  );

  const t = useCallback((key: StringKey) => STRINGS[lang][key], [lang]);
  const team = useCallback(
    (size: number) => (lang === 'ko' ? `${size}인 팀` : `Team of ${size}`),
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t, team }}>
      {children}
    </LangContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
