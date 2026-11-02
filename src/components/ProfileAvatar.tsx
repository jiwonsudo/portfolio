import { useState } from 'react';
import { useLang } from '../useLang';
import { profilePhoto, profilePreviews } from '../data/profileImages';
import ProfilePhotosModal from './ProfilePhotosModal';

/**
 * About 헤더 아바타.
 * 대표 사진 1장을 원형으로 보여주고, 클릭하면 전체 사진 모달을 연다.
 */
export default function ProfileAvatar({ alt }: { alt: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const hasGallery = profilePreviews.length > 0;

  return (
    <div className="fade-up shrink-0">
      <button
        aria-haspopup="dialog"
        aria-label={t('about.photosHint')}
        className="group relative block h-28 w-28 md:h-36 md:w-36"
        onClick={() => setOpen(true)}
        type="button"
      >
        <img
          alt={alt}
          className="h-full w-full rounded-full object-cover shadow-[0_10px_40px_rgba(80,70,160,0.25)] ring-4 ring-white/80"
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
    </div>
  );
}
