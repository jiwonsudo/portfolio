import { useState } from 'react';
import { useLang } from '../i18n';
import { profilePhoto, profilePreviews } from '../data/profileImages';
import ProfilePhotosModal from './ProfilePhotosModal';

/**
 * About 헤더 아바타.
 * - 대표 사진 1장을 원형으로 보여준다.
 * - 뒤에 겹쳐둔 설명 사진들이 주기적으로 "삭" 펼쳐졌다 접힌다(힌트).
 * - hover 시 부채꼴로 펼쳐 고정, 클릭하면 전체 사진 모달을 연다.
 */
export default function ProfileAvatar({ alt }: { alt: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const previews = profilePreviews.slice(0, 2);
  const hasGallery = profilePreviews.length > 0;

  return (
    <div className="fade-up shrink-0">
      <button
        aria-haspopup="dialog"
        aria-label={t('about.photosHint')}
        className="avatar-stack group relative block h-28 w-28 md:h-36 md:w-36"
        onClick={() => setOpen(true)}
        type="button"
      >
        {/* 뒤에 겹쳐진 미리보기 사진들 */}
        {hasGallery
          ? previews.map((src, i) => (
              <span
                aria-hidden
                className={`pk pk${i + 1} absolute inset-0 overflow-hidden rounded-full ring-4 ring-white/80`}
                key={src}
              >
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={src}
                />
              </span>
            ))
          : null}

        {/* 대표 사진(원형) */}
        <img
          alt={alt}
          className="relative z-10 h-full w-full rounded-full object-cover shadow-[0_10px_40px_rgba(80,70,160,0.25)] ring-4 ring-white/80"
          fetchPriority="high"
          height={640}
          src={profilePhoto}
          width={640}
        />

        {/* 클릭 가능 힌트 배지 */}
        {hasGallery ? (
          <span
            aria-hidden
            className="absolute right-0 bottom-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110"
          >
            📷
          </span>
        ) : null}
      </button>

      {open ? (
        <ProfilePhotosModal
          onClose={() => setOpen(false)}
          photos={profilePreviews}
        />
      ) : null}

      <style>{`
        .pk {
          transform-origin: bottom center;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
          opacity: 0;
          will-change: transform, opacity;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
        }
        /* 다음 사진일수록 뒤로 겹치게(아바타 z-10보다 항상 아래) */
        .pk1 { z-index: 3; animation: pk1 7s ease-in-out infinite; }
        .pk2 { z-index: 2; animation: pk2 7s ease-in-out infinite; }
        .pk3 { z-index: 1; animation: pk3 7s ease-in-out infinite; }

        /* 대부분 숨김(뒤에 겹침) → 잠깐 "삭" 펼침 → 다시 접힘. 오른쪽으로만 살짝. */
        @keyframes pk1 {
          0%, 14%   { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
          22%, 30%  { opacity: 1; transform: rotate(6deg) translate(22%, -4%) scale(1); }
          40%, 100% { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
        }
        @keyframes pk2 {
          0%, 20%   { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
          28%, 36%  { opacity: 1; transform: rotate(11deg) translate(38%, -3%) scale(1); }
          46%, 100% { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
        }
        @keyframes pk3 {
          0%, 26%   { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
          34%, 42%  { opacity: 1; transform: rotate(15deg) translate(52%, 0) scale(1); }
          52%, 100% { opacity: 0; transform: rotate(0) translate(0, 0) scale(0.92); }
        }

        /* hover 시 오른쪽으로 부채꼴 펼쳐 고정 (터치 기기 제외 — 첫 탭 씹힘 방지) */
        @media (hover: hover) {
          .avatar-stack:hover .pk { animation: none; opacity: 1; }
          .avatar-stack:hover .pk1 { transform: rotate(7deg) translate(28%, -6%) scale(1); }
          .avatar-stack:hover .pk2 { transform: rotate(13deg) translate(48%, -4%) scale(1); }
          .avatar-stack:hover .pk3 { transform: rotate(18deg) translate(66%, 0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pk1, .pk2, .pk3 { animation: none; }
        }
      `}</style>
    </div>
  );
}
