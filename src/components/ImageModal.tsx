import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** 사진 한 장만 크게 보여주는 가벼운 라이트박스 (ProfilePhotosModal과 동일한 디자인 톤). */
export default function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      aria-label={alt}
      aria-modal
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
    >
      <button
        aria-label="닫기"
        className="fixed top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-base text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:top-5 sm:right-5 sm:h-10 sm:w-10 sm:text-lg"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        ✕
      </button>

      <div className="modal-pop flex max-h-[80vh] max-w-4xl items-center justify-center sm:max-h-[85vh]">
        <img
          alt={alt}
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl sm:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
          src={src}
        />
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
