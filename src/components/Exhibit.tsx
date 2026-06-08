import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import type { ExhibitData } from '../types';
import ExhibitItem, { wallSpacing } from './ExhibitItem';

type ExhibitProps = {
  exhibits: ExhibitData[];
};

type CameraRigProps = {
  progressRef: { current: number };
  sceneCount: number;
};

type GallerySceneProps = ExhibitProps &
  CameraRigProps & {
    isMobile: boolean;
    shadowsEnabled: boolean;
  };

type ExhibitLabelProps = {
  exhibit: ExhibitData;
  progress: number;
  index: number;
  sceneCount: number;
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

  useFrame(({ camera }) => {
    cameraProgress.current +=
      (progressRef.current - cameraProgress.current) * 0.075;

    const travel = cameraProgress.current * (sceneCount - 1) * wallSpacing;
    const perspectiveCamera = camera as PerspectiveCamera;

    perspectiveCamera.position.set(travel, isMobile ? 0.3 : 0.35, 11.2);
    perspectiveCamera.lookAt(travel, 0.02, -0.35);
  });

  return null;
}

function GalleryScene({
  exhibits,
  isMobile,
  progressRef,
  sceneCount,
  shadowsEnabled,
}: GallerySceneProps) {
  const floorWidth = Math.max(220, sceneCount * wallSpacing + 140);

  return (
    <>
      <color args={['#f4f0e8']} attach="background" />
      <fog args={['#f4f0e8', 18, 46]} attach="fog" />
      <ambientLight color="#fff8ec" intensity={1.55} />
      <directionalLight
        color="#ffffff"
        intensity={1.15}
        position={[-4, 6, 8]}
      />
      <mesh
        position={[((sceneCount - 1) * wallSpacing) / 2, -3.18, 0]}
        receiveShadow={shadowsEnabled}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[floorWidth, 70]} />
        <meshStandardMaterial color="#eee7dc" roughness={0.88} />
      </mesh>
      {exhibits.map((exhibit, index) => (
        <ExhibitItem
          exhibit={exhibit}
          index={index}
          isMobile={isMobile}
          key={exhibit.number}
          shadowsEnabled={shadowsEnabled}
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

function ExhibitLabel({
  exhibit,
  index,
  progress,
  sceneCount,
}: ExhibitLabelProps) {
  const targetProgress = sceneCount <= 1 ? 0 : (index + 1) / (sceneCount - 1);
  const distance = Math.abs(progress - targetProgress);
  const itemViewportX =
    50 + (targetProgress - progress) * Math.max(1, sceneCount - 1) * 82;
  const opacity = clamp(1 - distance * sceneCount * 2.9, 0, 1);
  const pointerEvents = opacity > 0.52 ? 'auto' : 'none';

  return (
    <article
      className="group absolute bottom-[8vh] left-[var(--label-x)] z-20 w-[min(78vw,320px)] -translate-x-1/2 border-l border-black/20 bg-[#f4f0e8]/68 py-3 pl-4 text-[#181512] opacity-[var(--label-opacity)] backdrop-blur-sm transition-opacity duration-300 md:bottom-[10vh] md:w-[330px]"
      style={
        {
          '--label-opacity': opacity,
          '--label-x': `${itemViewportX}vw`,
          pointerEvents,
        } as CSSProperties
      }
    >
      <p className="mb-2 text-[10px] font-extrabold uppercase text-[#9e7435]">
        {exhibit.number} / {exhibit.kind}
      </p>
      <h2 className="text-base leading-tight font-extrabold md:text-lg">
        {exhibit.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-[#6e665a] transition-all duration-300 group-hover:line-clamp-none">
        {exhibit.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {exhibit.stack.map((item) => (
          <span
            className="border border-black/10 bg-white/50 px-2 py-1 text-[9px] font-bold text-[#756b5e]"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function GalleryLabels({
  exhibits,
  progress,
  sceneCount,
}: ExhibitProps & { progress: number; sceneCount: number }) {
  return (
    <>
      {exhibits.map((exhibit, index) => (
        <ExhibitLabel
          exhibit={exhibit}
          index={index}
          key={exhibit.number}
          progress={progress}
          sceneCount={sceneCount}
        />
      ))}
    </>
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
  const sceneCount = exhibits.length + 1;
  const sectionHeight = `${Math.max(sceneCount, 1) * 100}svh`;
  const shadowsEnabled = !isMobile;

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

  return (
    <section
      className="relative bg-[#f4f0e8]"
      onTouchMove={(event) => {
        const touch = event.touches[0];
        const section = sectionRef.current;

        if (!touch || !section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const deltaX = touchStartRef.current.x - touch.clientX;
        const deltaY = touchStartRef.current.y - touch.clientY;
        const isActiveGallery =
          rect.top <= 0 && rect.bottom >= window.innerHeight;

        if (!isActiveGallery || Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }

        event.preventDefault();
        window.scrollBy({ left: 0, top: deltaX });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];

        if (!touch) {
          return;
        }

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      onWheel={(event) => {
        const section = sectionRef.current;

        if (
          !section ||
          Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
          progress <= 0 ||
          progress >= 1
        ) {
          return;
        }

        event.preventDefault();
        window.scrollBy({ left: 0, top: event.deltaX });
      }}
      ref={sectionRef}
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#f4f0e8]">
        {webglSupported ? (
          <Canvas
            camera={{ fov: 34, position: [0, 0.35, 11.2] }}
            className="block h-full w-full"
            dpr={isMobile ? [0.8, 1] : [1, 1.5]}
            gl={{
              antialias: !isMobile,
              powerPreference: 'high-performance',
            }}
            shadows={shadowsEnabled}
          >
            <GalleryScene
              exhibits={exhibits}
              isMobile={isMobile}
              progressRef={progressRef}
              sceneCount={sceneCount}
              shadowsEnabled={shadowsEnabled}
            />
          </Canvas>
        ) : (
          <FallbackGallery
            exhibits={exhibits}
            progress={progress}
            sceneCount={sceneCount}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,240,232,0.98),transparent_12%,transparent_88%,rgba(244,240,232,0.98)),radial-gradient(ellipse_at_50%_110%,transparent_0_34%,rgba(152,134,108,0.14)_82%)]" />
        <GalleryLabels
          exhibits={exhibits}
          progress={progress}
          sceneCount={sceneCount}
        />
      </div>
    </section>
  );
}
