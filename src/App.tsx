import heroImg from './assets/hero.png';
import AboutOverlay from './components/AboutOverlay';
import Exhibit from './components/Exhibit';
import Hero from './components/Hero';
import StackContact from './components/StackContact';
import type { ExhibitData } from './types';

const exhibits: ExhibitData[] = [
  {
    number: '01',
    title: 'Layered Interface',
    kind: 'UX Prototype',
    description:
      '복잡한 정보 구조를 사용자가 망설이지 않고 탐색하도록 만든 인터랙티브 화면 설계.',
    background:
      '핵심 기능은 많지만 첫 진입에서 사용자가 무엇을 해야 할지 모르는 문제가 있었습니다.',
    coreUx:
      '정보를 계층별로 접고 펼치는 인터랙션으로 바꾸고, 현재 맥락을 잃지 않도록 화면 전환을 줄였습니다.',
    metrics: [
      '첫 행동까지의 단계 4 → 2',
      '프로토타입 테스트 이탈 지점 38% 감소',
      '핵심 플로우 인지 시간 42% 단축',
    ],
    stack: ['React', 'R3F', 'Interaction Design'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: heroImg,
  },
  {
    number: '02',
    title: 'Product Archive',
    kind: 'Product System',
    description:
      '흩어진 기록과 의사결정 맥락을 PM이 빠르게 비교할 수 있게 만든 아카이브 경험.',
    background:
      '문서와 히스토리가 여러 도구에 흩어져 신규 합류자가 제품 맥락을 따라잡기 어려웠습니다.',
    coreUx:
      '검색 결과를 단순 리스트가 아니라 결정 배경, 영향 범위, 관련 작업으로 묶어 재구성했습니다.',
    metrics: [
      '탐색 클릭 수 31% 감소',
      '온보딩 문서 탐색 시간 27분 → 11분',
      '반복 질문 항목 24% 감소',
    ],
    stack: ['TypeScript', 'Data UX', 'Search UX'],
  },
  {
    number: '03',
    title: 'Simulation Room',
    kind: 'Technical UI',
    description:
      '계산 결과와 검증 화면을 한 흐름으로 연결해 의사결정 속도를 높인 실험형 도구.',
    background:
      '수치 입력, 계산 결과, 그래프 검증이 분리되어 실험 조건을 바꿀 때마다 맥락 전환이 컸습니다.',
    coreUx:
      '입력 변경 즉시 결과와 시각화를 함께 갱신하고, 유효 범위를 UI에서 먼저 알려주는 흐름으로 정리했습니다.',
    metrics: [
      '실험 조건 비교 시간 50% 단축',
      '잘못된 입력 재시도 3회 → 1회',
      'MVP 2일 내 배포',
    ],
    stack: ['React', 'Scientific UI', 'Visualization'],
  },
];

function App() {
  return (
    <main className="bg-[#f4f0e8]">
      <Hero />
      <AboutOverlay />
      <Exhibit exhibits={exhibits} />
      <StackContact exhibits={exhibits} />
    </main>
  );
}

export default App;
