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
    'home.headline1': '기다리지 않고,',
    'home.headline2': '만들어 냅니다.',
    'home.sub':
      '웹 화면부터 드론 비행제어기, 로켓 엔진 시뮬레이터까지 — 프로덕트든 데이터든 결과물이든, 필요하면 피벗도 마다하지 않고 결국 만들어 냅니다.',
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
    'contact.cta': '연락하기',
    'contact.email': '이메일 보내기',
    'contact.footerTitle': '새로운 기회를 찾고 있어요 👋',
    'contact.ready':
      '새로운 경험을 좋아해요. 재밌는 일이 있다면 편하게 연락 주세요!',
    'contact.quoteMeaning':
      '아는 것은 좋아하는 것만, 좋아하는 것은 즐기는 것만 못하다',
    'contact.quoteAuthor': '공자',
    'about.photosTitle': '이런 사람이에요',
    'about.photosHint': '눌러서 사진 더보기',
    'modal.contribution': '핵심 기여',
    'notfound.msg': '길을 잃으셨나요? 집으로 모셔다드릴게요.',
    'notfound.home': '홈으로',
  },
  en: {
    'home.role': 'Frontend-based Software Engineer',
    'home.headline1': "I don't wait —",
    'home.headline2': 'I make it happen.',
    'home.sub':
      'From web screens to a drone flight controller and a rocket-engine simulator — a product, data, or any deliverable, pivoting when it takes one, I always end up making something.',
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
    'contact.cta': 'Get in touch',
    'contact.email': 'Email me',
    'contact.footerTitle': 'Open to new adventures 👋',
    'contact.ready':
      'I love new experiences — got something fun? Feel free to reach out!',
    'contact.quoteMeaning':
      'Knowing it is less than loving it; loving it is less than delighting in it',
    'contact.quoteAuthor': 'Confucius',
    'about.photosTitle': 'A bit more of me',
    'about.photosHint': 'Tap to see more photos',
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
