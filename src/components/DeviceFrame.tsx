import type { CSSProperties } from 'react';
import imacFront from '../assets/mockups/imac_front.png';
import iphoneFront from '../assets/mockups/iphone_front.png';
import type { ProjectDisplay } from '../types';

type DeviceFrameProps = {
  variant: ProjectDisplay;
  src?: string;
  alt: string;
  /** 프레임 래퍼에 추가할 클래스 (크기 지정 등) */
  className?: string;
  /** 스크린샷 세로 정렬 — 카드에선 상단(top)만 보이게 */
  objectPosition?: 'top' | 'center';
};

/**
 * 실제 기기 목업 PNG 위로 스크린샷을 배치한다.
 * 목업의 화면은 투명(컷아웃)이라 스크린샷을 '뒤에' 깔면 화면으로 비쳐 보이고,
 * 베젤·라운드 코너·노치가 자연스럽게 마스킹된다.
 * screen 값은 화면 영역보다 살짝 크게(베젤 쪽으로 오버필) 잡아 가장자리 틈을 없앤다.
 * 새 목업으로 교체하면 이 값만 다시 재면 된다.
 */
const FRAMES = {
  mobile: {
    src: iphoneFront,
    aspect: '2880 / 5664',
    screen: { top: '1.6%', right: '3.4%', bottom: '1.6%', left: '3.4%' },
  },
  desktop: {
    src: imacFront,
    aspect: '2767 / 2192',
    screen: { top: '1.4%', right: '3.1%', bottom: '26.8%', left: '3.1%' },
  },
} as const;

export default function DeviceFrame({
  variant,
  src,
  alt,
  className = '',
  objectPosition = 'center',
}: DeviceFrameProps) {
  const frame = FRAMES[variant];

  const screenStyle: CSSProperties = {
    position: 'absolute',
    top: frame.screen.top,
    right: frame.screen.right,
    bottom: frame.screen.bottom,
    left: frame.screen.left,
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: frame.aspect }}
    >
      {/* 스크린샷을 뒤에 깔고, 투명 화면으로 비치게 한다 */}
      {src ? (
        <img
          alt={alt}
          className={`object-cover ${
            objectPosition === 'top' ? 'object-top' : 'object-center'
          }`}
          loading="lazy"
          src={src}
          style={screenStyle}
        />
      ) : null}
      {/* 기기 목업(베젤)을 위에 올려 화면 밖을 덮고 코너를 마스킹 */}
      <img
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        src={frame.src}
      />
    </div>
  );
}
