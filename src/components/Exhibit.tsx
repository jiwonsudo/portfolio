import type { CSSProperties } from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import type { PerspectiveCamera } from 'three';
import type { Project } from '../types';
import { accentPalette, categoryLabels } from '../data/projects';
import ExhibitItem, { wallSpacing } from './ExhibitItem';

type ExhibitProps = {
  exhibits: Project[];
};

type CameraRigProps = {
  progressRef: { current: number };
  sceneCount: number;
};

type GallerySceneProps = ExhibitProps &
  CameraRigProps & {
    isMobile: boolean;
  };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getWebglSupport() {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function CameraRig({
  isMobile,
  progressRef,
  sceneCount,
}: CameraRigProps & { isMobile: boolean }) {
  const cameraProgress = useRef(0);

  useFrame(({ camera, clock }) => {
    cameraProgress.current +=
      (progressRef.current - cameraProgress.current) * 0.1;

    const travel = cameraProgress.current * (sceneCount - 1) * wallSpacing;
    const time = clock.elapsedTime;
    // 가만히 있지 않도록 카메라에 아주 옅은 부유감을 준다.
    const driftY = Math.sin(time * 0.4) * 0.12;
    const driftX = Math.cos(time * 0.3) * 0.14;
    const perspectiveCamera = camera as PerspectiveCamera;

    perspectiveCamera.position.set(
      travel + driftX,
      (isMobile ? 0.3 : 0.4) + driftY,
      isMobile ? 12.4 : 10.6,
    );
    perspectiveCamera.lookAt(travel, 0.05, -0.35);
  });

  return null;
}

function StudioEnvironment() {
  // 외부 HDR 없이 Lightformer로 스튜디오 리플렉션을 만들어 요즘 3D 렌더 룩을 준다.
  return (
    <Environment resolution={128}>
      <color args={['#1b1622']} attach="background" />
      <Lightformer
        color="#fff4e0"
        intensity={1.4}
        position={[0, 5, -9]}
        scale={[14, 6, 1]}
      />
      <Lightformer
        color="#ff8fc7"
        intensity={1.1}
        position={[-8, 1, 4]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[10, 6, 1]}
      />
      <Lightformer
        color="#7cc4ff"
        intensity={1.1}
        position={[8, 1, 4]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[10, 6, 1]}
      />
    </Environment>
  );
}

function GalleryScene({
  exhibits,
  isMobile,
  progressRef,
  sceneCount,
}: GallerySceneProps) {
  return (
    <>
      <ambientLight color="#fbe7d6" intensity={0.85} />
      <directionalLight
        color="#ffffff"
        intensity={1.6}
        position={[-3, 6, 8]}
      />
      <directionalLight color="#ff9ecb" intensity={0.5} position={[9, 2, 2]} />
      <StudioEnvironment />
      {exhibits.map((exhibit, index) => (
        <ExhibitItem
          exhibit={exhibit}
          index={index}
          isMobile={isMobile}
          key={exhibit.number}
        />
      ))}
      <CameraRig
        isMobile={isMobile}
        progressRef={progressRef}
        sceneCount={sceneCount}
      />
    </>
  );
}

function FallbackGallery({
  exhibits,
  progress,
  sceneCount,
}: ExhibitProps & { progress: number; sceneCount: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden perspective-[1100px]"
      style={
        {
          '--gallery-progress': progress,
          '--scene-count': sceneCount,
        } as CSSProperties
      }
    >
      <div className="flex h-full w-[calc(var(--scene-count)*100vw)] translate-x-[calc(var(--gallery-progress)*(var(--scene-count)-1)*-100vw)]">
        {exhibits.map((exhibit) => (
          <div
            className="relative grid h-full w-screen shrink-0 place-items-center"
            key={exhibit.number}
          >
            <div className="relative grid aspect-[0.88] w-[min(68vw,390px)] place-items-center border border-black/10 bg-[#fbfaf6] shadow-[34px_26px_0_#ded7ca,0_34px_80px_rgba(70,58,42,0.14)] [transform-style:preserve-3d] [transform:rotateY(-8deg)]">
              <div className="absolute top-[-36vh] left-1/2 h-[68vh] w-[min(66vw,300px)] -translate-x-1/2 bg-linear-to-b from-[#d8a85f]/28 to-transparent [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]" />
              <div className="relative grid aspect-[0.8] w-[58%] place-items-center border-10 border-[#181512] bg-[#f7f3ec] shadow-[0_22px_44px_rgba(54,44,32,0.18)]">
                {exhibit.image ? (
                  <img alt="" className="h-auto w-[74%]" src={exhibit.image} />
                ) : (
                  <div className="grid aspect-[0.74] w-[76%] grid-rows-[14px_1fr_10px] gap-3.5">
                    <span className="w-[56%] rounded bg-[#9e7435]" />
                    <span className="rounded bg-[#d4ccc0]" />
                    <span className="w-[72%] rounded bg-[#d4ccc0]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryLabels({
  exhibits,
  progress,
  sceneCount,
}: ExhibitProps & { progress: number; sceneCount: number }) {
  const span = Math.max(1, sceneCount - 1);
  const activeIndex = clamp(
    Math.round(progress * span) - 1,
    0,
    exhibits.length - 1,
  );
  const exhibit = exhibits[activeIndex];
  const accent = accentPalette[activeIndex % accentPalette.length];
  // 인트로/아웃트로(빈 씬)에서는 라벨을 숨겨 화면을 비운다.
  const visible = progress > 0.4 / span && progress < 1 - 0.25 / span;

  if (!exhibit) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* 우상단 진행 표시 */}
      <div className="absolute top-6 right-6 text-right font-extrabold text-white/80 md:top-8 md:right-10">
        <span className="text-2xl md:text-3xl" style={{ color: accent }}>
          {exhibit.number}
        </span>
        <span className="text-sm text-white/40">
          {' '}
          / {String(exhibits.length).padStart(2, '0')}
        </span>
      </div>

      {/* 활성 작품 카드 (한 장만, 고정 위치, 크로스페이드) */}
      <article
        className="label-in group pointer-events-auto absolute bottom-[9vh] left-[6vw] w-[min(84vw,384px)] overflow-hidden rounded-2xl border border-white/15 bg-white/8 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl md:bottom-[12vh] md:left-[8vw]"
        key={exhibit.number}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-2 text-[7rem] leading-none font-black opacity-15 select-none"
          style={{ color: accent }}
        >
          {exhibit.number}
        </span>

        <p
          className="mb-2 text-[10px] font-extrabold tracking-wide uppercase"
          style={{ color: accent }}
        >
          {categoryLabels[exhibit.category]} · {exhibit.period}
        </p>
        <h2 className="text-xl leading-tight font-extrabold md:text-2xl">
          {exhibit.title}
        </h2>
        <p className="mt-1 text-xs font-bold text-white/55">
          {exhibit.titleKo} · {exhibit.role}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-white/70">
          {exhibit.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {exhibit.stack.map((item) => (
            <span
              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white/75"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        {exhibit.demoUrl || exhibit.githubUrl ? (
          <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-extrabold uppercase">
            {exhibit.demoUrl ? (
              <a
                className="underline underline-offset-4"
                href={exhibit.demoUrl}
                rel="noreferrer"
                style={{ color: accent }}
                target="_blank"
              >
                Demo ↗
              </a>
            ) : null}
            {exhibit.githubUrl ? (
              <a
                className="text-white/60 underline underline-offset-4 transition-colors hover:text-white"
                href={exhibit.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                Code ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}

export default function Exhibit({ exhibits }: ExhibitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const renderedProgressRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 767px), (pointer: coarse)').matches,
  );
  const [webglSupported] = useState(getWebglSupport);
  const [inView, setInView] = useState(true);
  // 앞뒤로 빈 씬을 하나씩 둬서(인트로·아웃트로) 첫/마지막 작품이
  // 스크롤 양 끝에 걸려 라벨이 잘리지 않게 한다.
  const sceneCount = exhibits.length + 2;
  // 작품 사이 스크롤 간격을 좁혀 전환을 더 경쾌하게.
  const sectionHeight = `${Math.max(sceneCount, 1) * 68}svh`;

  useEffect(() => {
    let frame = 0;

    function updateProgress() {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = clamp(-rect.top / maxScroll, 0, 1);

      progressRef.current = nextProgress;

      if (Math.abs(renderedProgressRef.current - nextProgress) > 0.006) {
        renderedProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      frame = requestAnimationFrame(updateProgress);
    }

    updateProgress();

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(max-width: 767px), (pointer: coarse)',
    );

    function handleChange() {
      setIsMobile(mediaQuery.matches);
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 갤러리가 화면 밖일 때는 R3F 렌더 루프를 멈춰 GPU/CPU를 아낀다.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // React registers wheel/touchstart/touchmove as passive listeners, so
  // event.preventDefault() inside JSX handlers is a no-op. Attach native
  // non-passive listeners to translate horizontal gestures into vertical
  // scroll (which drives the gallery progress).
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    function handleWheel(event: WheelEvent) {
      if (
        Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
        progressRef.current <= 0 ||
        progressRef.current >= 1
      ) {
        return;
      }

      event.preventDefault();
      window.scrollBy({ left: 0, top: event.deltaX });
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (!touch || !section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;
      const isActiveGallery = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!isActiveGallery || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      event.preventDefault();
      window.scrollBy({ left: 0, top: deltaX });
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }

    section.addEventListener('wheel', handleWheel, { passive: false });
    section.addEventListener('touchstart', handleTouchStart, { passive: true });
    section.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      section.removeEventListener('wheel', handleWheel);
      section.removeEventListener('touchstart', handleTouchStart);
      section.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section
      className="relative"
      ref={sectionRef}
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(120%_120%_at_50%_-10%,#3a2350_0%,#1e1630_42%,#120d1e_100%)]">
        {/* 은은한 컬러 글로우 — 지루하지 않게 */}
        <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[#ff7ec3]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-1/4 right-0 h-[60vh] w-[60vh] rounded-full bg-[#5b8cff]/20 blur-[120px]" />

        {webglSupported ? (
          <Canvas
            camera={{ fov: 34, position: [0, 0.4, 11.2] }}
            className="block h-full w-full"
            dpr={isMobile ? [0.8, 1] : [1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            gl={{
              alpha: true,
              antialias: !isMobile,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              <GalleryScene
                exhibits={exhibits}
                isMobile={isMobile}
                progressRef={progressRef}
                sceneCount={sceneCount}
              />
            </Suspense>
          </Canvas>
        ) : (
          <FallbackGallery
            exhibits={exhibits}
            progress={progress}
            sceneCount={sceneCount}
          />
        )}

        {/* 위/아래 비네팅으로 라벨 가독성 확보 */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,13,30,0.45),transparent_22%,transparent_62%,rgba(18,13,30,0.72))]" />
        <GalleryLabels
          exhibits={exhibits}
          progress={progress}
          sceneCount={sceneCount}
        />
      </div>
    </section>
  );
}
