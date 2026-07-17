import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../i18n';

/**
 * About 아바타를 누르면 뜨는 사진 갤러리 모달(프로젝트 모달과 동일한 큰 흰 패널).
 * 패널 안에서 3:4 포토카드가 부채꼴(coverflow)로 패닝된다.
 * - 모바일: 좌우 화살표로 이동
 * - 데스크톱: 화살표 / 키보드 ←→ / 옆 카드에 마우스 호버로 이동
 */
export default function ProfilePhotosModal({
  photos,
  onClose,
}: {
  photos: string[];
  onClose: () => void;
}) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + photos.length) % photos.length);

  // ESC/화살표 + 배경 스크롤 잠금 + 포커스 관리
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length]);

  return createPortal(
    <div
      aria-labelledby="profile-photos-title"
      aria-modal
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
    >
      {/* 닫기 버튼 (배경 위) */}
      <button
        aria-label="닫기"
        className="fixed top-5 right-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        ✕
      </button>

      <div className="modal-pop flex w-full max-w-4xl flex-col items-center">
        <h2 className="sr-only" id="profile-photos-title">
          {t('about.photosHint')}
        </h2>

        {/* 부채꼴 coverflow 무대 (카드 3:4, 배경 없음) */}
        <div
          className="relative flex h-[60vh] w-full items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          {photos.map((src, i) => {
            const offset = i - index;
            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            return (
              <button
                aria-hidden={!isCenter}
                aria-label={`사진 ${i + 1}`}
                className="absolute aspect-3/4 h-full overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl transition-all duration-500 focus-visible:outline-none"
                key={src}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCenter) setIndex(i);
                }}
                style={{
                  transform: `translateX(${offset * 44}%) rotateY(${offset * -22}deg) scale(${Math.max(1 - abs * 0.16, 0.6)})`,
                  zIndex: 20 - abs,
                  opacity: abs > 2 ? 0 : 1,
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
                tabIndex={isCenter ? 0 : -1}
                type="button"
              >
                <img
                  alt={`프로필 사진 ${i + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                  loading={abs <= 1 ? 'eager' : 'lazy'}
                  src={src}
                />
              </button>
            );
          })}

          {/* 좌우 화살표 */}
          {photos.length > 1 ? (
            <>
              <button
                aria-label="이전"
                className="absolute top-1/2 left-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-neutral-900 shadow-lg transition-transform hover:scale-110 md:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="다음"
                className="absolute top-1/2 right-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-neutral-900 shadow-lg transition-transform hover:scale-110 md:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                type="button"
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        {/* 인디케이터 */}
        {photos.length > 1 ? (
          <div className="mt-6 flex justify-center gap-1.5">
            {photos.map((src, i) => (
              <button
                aria-label={`${i + 1}번째 사진`}
                className="h-2 rounded-full transition-all"
                key={src}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                style={{
                  width: i === index ? 22 : 8,
                  backgroundColor:
                    i === index ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
                type="button"
              />
            ))}
          </div>
        ) : null}
      </div>

      <style>{`
        .modal-pop {
          animation: modal-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-pop { animation: none; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
