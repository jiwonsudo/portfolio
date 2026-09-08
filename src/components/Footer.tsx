import { trackEvent } from '../analytics';
import { profile } from '../data/profile';
import { useLang } from '../useLang';

// 요일별 멘트 (index = new Date().getDay(), 0=일 ~ 6=토)
const DAY_MESSAGES = {
  ko: [
    '오늘은 일요일, 여유롭게. 내일을 위해 재충전해요 🌙',
    '오늘은 월요일이네요. 한 주의 시작, 가볍게 가봅시다 💪',
    '오늘은 화요일, 이제 리듬 타는 중. 오늘도 화이팅! 🎵',
    '오늘은 수요일, 절반 왔어요. 조금만 더 힘내요! 🐫',
    '오늘은 목요일, 주말이 보이기 시작해요. 화이팅! 👀',
    '오늘은 불금이네요! 오늘만 버티면 주말, 화이팅 🔥',
    '오늘은 토요일, 푹 쉬면서 재충전하세요 ☕',
  ],
  en: [
    'Today is Sunday — take it easy and recharge for tomorrow 🌙',
    "Today is Monday — new week, let's ease into it 💪",
    'Today is Tuesday — finding the rhythm. You got this! 🎵',
    'Today is Wednesday — halfway there. Keep pushing! 🐫',
    "Today is Thursday — the weekend's in sight. Hang in there! 👀",
    "Today is Friday! Push through today and it's the weekend 🔥",
    'Today is Saturday — rest up and recharge ☕',
  ],
};

export default function Footer() {
  const { t, lang } = useLang();
  const dayMessage = (lang === 'en' ? DAY_MESSAGES.en : DAY_MESSAGES.ko)[
    new Date().getDay()
  ];

  return (
    <footer className="relative border-t border-neutral-200 bg-white px-5 py-16 text-neutral-900 md:px-10">
      <p className="mx-auto mb-8 w-full max-w-5xl text-base font-bold text-neutral-800 break-keep md:text-lg">
        {dayMessage}
      </p>

      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2.5">
        {/* 모든 버튼 동일한 크기·호버, 색만 다름 (이메일=채움 / 소셜=아웃라인) */}
        <a
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          href={`mailto:${profile.email}`}
        >
          {t('contact.email')}
        </a>
        {profile.resume ? (
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={profile.resume}
            onClick={() => trackEvent('resume-click-footer', 'Resume · Footer')}
            rel="noreferrer"
            target="_blank"
          >
            {t('common.resume')} ↗
          </a>
        ) : null}
        {[
          { label: 'GitHub', href: profile.github },
          { label: 'LinkedIn', href: profile.linkedin },
          { label: 'Blog', href: profile.blog },
        ].map((link) => (
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={link.href}
            key={link.label}
            rel="noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="mx-auto mt-10 w-full max-w-5xl text-xs text-neutral-500">
        <a
          className="block transition-colors hover:text-neutral-900"
          href={`mailto:${profile.email}`}
        >
          {profile.email}
        </a>
        <p className="mt-1">
          © {new Date().getFullYear()}. {profile.name} all rights reserved.
        </p>
      </div>
    </footer>
  );
}
