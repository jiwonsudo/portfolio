/**
 * GoatCounter 연동 — 쿠키·개인정보 수집이 없는 경량 방문 통계.
 * 스크립트는 index.html에서 `no_onload`로 불러오고(자동 집계 끔),
 * SPA 라우팅에 맞춰 여기서 직접 집계한다.
 *
 * 대시보드: https://jiwonsudo.goatcounter.com
 */
declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: {
        path?: string;
        title?: string;
        referrer?: string;
        event?: boolean;
      }) => void;
      no_onload?: boolean;
    };
  }
}

/** count.js는 async로 로드되므로 준비될 때까지 잠깐 기다렸다 보낸다. */
function whenReady(send: () => void, retriesLeft = 20) {
  if (window.goatcounter?.count) {
    send();
    return;
  }
  if (retriesLeft > 0) {
    window.setTimeout(() => whenReady(send, retriesLeft - 1), 100);
  }
}

/** 페이지뷰 집계. SPA라 라우트가 바뀔 때마다 직접 호출한다. */
export function trackPageview(path: string) {
  whenReady(() => window.goatcounter?.count?.({ path, title: document.title }));
}

/** 버튼 클릭 등 이벤트 집계 (대시보드에서 페이지뷰와 분리되어 보인다). */
export function trackEvent(name: string, title?: string) {
  whenReady(() =>
    window.goatcounter?.count?.({
      path: name,
      title: title ?? name,
      event: true,
    }),
  );
}
