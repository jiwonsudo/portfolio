export type TimelineEntry = {
  period: string;
  title: string;
  titleEn: string;
};

export const profile = {
  name: 'Jiwon Jeong',
  nameKo: '정지원',
  email: 'wondev112@gmail.com',
  github: 'https://github.com/jiwonsudo',
  quote: '知之者不如好之者 好之者不如樂之者',
  intro:
    '기획의 의도와 사용자의 감각이 같은 화면 안에서 만나는 경험을 만듭니다.',
};

export const experiences: TimelineEntry[] = [
  {
    period: 'Mar 2023 – Aug 2023',
    title: '멋쟁이사자처럼 대학 11기 프론트엔드',
    titleEn: '11th LIKELION UNIV · Front-End',
  },
  {
    period: 'Mar 2021 – Feb 2023',
    title: '소프트웨어 중점교육과정',
    titleEn: 'SW Intensive Education Course',
  },
  {
    period: 'Dec 2020',
    title: '프로그래밍 시작',
    titleEn: 'Started Programming',
  },
];

export const awards: TimelineEntry[] = [
  {
    period: 'Sep 2024',
    title: '제5회 철풍창업경진대회 우수상 (제5기갑여단 여단장상)',
    titleEn: '5th Armored Brigade Startup Competition · 2nd Place',
  },
  {
    period: 'Jun 2023',
    title: '멋쟁이사자처럼 대학 11기 상명대 교내 해커톤 1위',
    titleEn: '11th LIKELION UNIV Campus Hackathon (SMU) · Grand Prize',
  },
  {
    period: 'Dec 2021',
    title: '매천고등학교 소프트웨어 공모전 최우수상',
    titleEn: 'MCHS Software Competition · Grand Prize',
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
