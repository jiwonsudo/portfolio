import fishMovie from '../assets/fish_movie.mp4';
import { useElementSize } from '../hooks/useElementSize';
import { useFishTextFlow } from '../hooks/useFishTextFlow';
import {
  getAboutTextSpec,
  layoutAboutText,
  prepareAboutText,
} from '../utils/aboutTextLayout';
import { useEffect, useMemo, useRef, useState } from 'react';

type AboutOverlayProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function AboutOverlay({
  onClose,
  open = true,
}: AboutOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const size = useElementSize(containerRef, open);
  // 영상을 화면에 꽉 채워(object-cover) 축소 시 생기던 테두리 이음새를 원천 제거.
  // 화면에 보일 때만 물고기 픽셀 분석 루프를 돌려 갤러리 스크롤 중 버벅임을 없앤다.
  const fishFlow = useFishTextFlow(
    videoRef,
    trackerCanvasRef,
    size,
    open && isVisible,
    1,
    'cover',
  );
  const spec = useMemo(() => getAboutTextSpec(size.width), [size.width]);
  const prepared = useMemo(() => prepareAboutText(spec.font), [spec.font]);
  const lines = useMemo(
    () =>
      size.width > 0 && size.height > 0
        ? layoutAboutText(prepared, size.width, size.height, spec, fishFlow)
        : [],
    [fishFlow, prepared, size.height, size.width, spec],
  );

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.playbackRate = 0.75;
  }, []);

  // 섹션이 화면에 있을 때만 영상 재생 + 분석 루프 → 다른 섹션에서 CPU 낭비 제거.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setIsVisible(visible);

        const video = videoRef.current;

        if (video) {
          if (visible) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  if (!open) {
    return null;
  }

  return (
    <section
      className="relative h-svh overflow-hidden bg-[#08070c] text-[#f6efe2]"
      ref={containerRef}
    >
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        ref={videoRef}
        src={fishMovie}
      />
      <canvas className="hidden" ref={trackerCanvasRef} />
      {/* 대비 확보용 그라데이션 (상·하단만 살짝 어둡게) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_40%,rgba(8,7,12,0.55))]" />

      {onClose ? (
        <button
          className="absolute top-4 right-4 z-30 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md md:top-6 md:right-8"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      ) : null}

      {/* 우하단 서명 */}
      <p className="pointer-events-none absolute right-6 bottom-6 z-20 text-right text-sm font-extrabold tracking-wide text-white/70 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] md:right-10 md:bottom-10">
        Jiwon Jeong · 정지원
      </p>

      <div className="absolute inset-0 z-10">
        {lines.map((line, index) => (
          <span
            className="absolute whitespace-nowrap font-extrabold text-[#f7efe0]"
            key={`${line.text}-${index}`}
            style={{
              fontSize: spec.fontSize,
              left: line.x,
              lineHeight: `${spec.lineHeight}px`,
              textShadow: '0 2px 18px rgba(0,0,0,0.45)',
              top: line.y,
            }}
          >
            {line.text}
          </span>
        ))}
      </div>
    </section>
  );
}
