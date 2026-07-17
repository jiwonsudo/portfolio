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
  /** 프레임 기본 fit을 덮어쓴다 ('cover'면 화면 영역을 꽉 채워 기기 전체를 보여줌) */
  fit?: 'width' | 'cover';
};

/**
 * 실제 기기 목업 PNG 위로 스크린샷을 배치한다.
 * 목업의 화면은 투명(컷아웃)이라 스크린샷을 '뒤에' 깔면 화면으로 비쳐 보이고,
 * 베젤·라운드 코너·노치가 자연스럽게 마스킹된다.
 * screen 값은 목업 PNG의 투명 화면 영역을 실측한 여백(%).
 *
 * fit:
 *  - 'width'  → 좌/우/위 폭에 맞춰 자연 비율로 깔고 아래는 흘려보냄(잘림). 폰용.
 *  - 'cover'  → 상/하/좌/우 화면 영역을 꽉 채우고 넘치는 부분은 크롭. 모니터용.
 */
const FRAMES = {
  mobile: {
    src: iphoneFront,
    aspect: '1200 / 2360',
    fit: 'width',
    screen: { top: '3%', right: '8%', bottom: '4.2%', left: '8%' },
  },
  desktop: {
    src: imacFront,
    aspect: '2767 / 2192',
    fit: 'cover',
    screen: { top: '4.4%', right: '3.5%', bottom: '29.4%', left: '3.5%' },
  },
} as const;

export default function DeviceFrame({
  variant,
  src,
  alt,
  className = '',
  objectPosition = 'center',
  fit,
}: DeviceFrameProps) {
  // 'default' — 목업 없이 이미지만 부모 영역을 채운다
  if (variant === 'default') {
    return (
      <div className={`h-full w-full ${className}`}>
        {src ? (
          <img
            alt={alt}
            className={`h-full w-full object-cover ${
              objectPosition === 'top' ? 'object-top' : 'object-center'
            }`}
            loading="lazy"
            src={src}
          />
        ) : null}
      </div>
    );
  }

  const frame = FRAMES[variant];

  // img는 replaced element라 top/right/bottom/left를 직접 주면 right/bottom이
  // 무시된다. 반드시 div 래퍼에 여백을 주고 img는 그 안을 채우게 한다.
  const widthFit = (fit ?? frame.fit) === 'width';

  const wrapperStyle: CSSProperties = widthFit
    ? {
        // 아래는 잡지 않고(=날림) 좌/우/위 폭에만 맞춘다
        position: 'absolute',
        top: frame.screen.top,
        left: frame.screen.left,
        right: frame.screen.right,
      }
    : {
        position: 'absolute',
        top: frame.screen.top,
        right: frame.screen.right,
        bottom: frame.screen.bottom,
        left: frame.screen.left,
        overflow: 'hidden',
      };

  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: frame.aspect }}
    >
      {/* 스크린샷을 뒤에 깔고, 투명 화면으로 비치게 한다 */}
      {src ? (
        <div style={wrapperStyle}>
          <img
            alt={alt}
            className={
              widthFit
                ? 'block w-full' // 가로 폭에 맞춰 자연 비율, 아래로 흘러넘침
                : `h-full w-full object-cover ${
                    objectPosition === 'top' ? 'object-top' : 'object-center'
                  }`
            }
            loading="lazy"
            src={src}
          />
        </div>
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
