import fishMovie from '../assets/fish_movie.mp4';
import { useElementSize } from '../hooks/useElementSize';
import { useFishTextFlow } from '../hooks/useFishTextFlow';
import {
  getAboutTextSpec,
  layoutAboutText,
  prepareAboutText,
} from '../utils/aboutTextLayout';
import { useEffect, useMemo, useRef } from 'react';

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
  const size = useElementSize(containerRef, open);
  const isMobile = size.width > 0 && size.width < 720;
  const fishVideoScale = isMobile ? 1.18 : 0.72;
  const fishFlow = useFishTextFlow(
    videoRef,
    trackerCanvasRef,
    size,
    open,
    fishVideoScale,
    'contain',
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

  if (!open) {
    return null;
  }

  return (
    <section
      className="relative h-svh overflow-hidden bg-black text-[#f6efe2]"
      ref={containerRef}
    >
      <video
        autoPlay
        className="absolute inset-0 h-full w-full scale-[1.18] object-contain md:scale-[0.72]"
        loop
        muted
        playsInline
        ref={videoRef}
        src={fishMovie}
      />
      <canvas className="hidden" ref={trackerCanvasRef} />
      <div className="absolute inset-0 bg-[#f4f0e8]/15" />

      {onClose ? (
        <button
          className="absolute top-4 right-4 z-30 rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-bold backdrop-blur-md md:top-6 md:right-8"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      ) : null}

      <div className="absolute inset-0 z-10">
        {lines.map((line, index) => (
          <span
            className="absolute whitespace-nowrap font-extrabold tracking-normal text-[#f6efe2]"
            key={`${line.text}-${index}`}
            style={{
              fontSize: spec.fontSize,
              left: line.x,
              lineHeight: `${spec.lineHeight}px`,
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
