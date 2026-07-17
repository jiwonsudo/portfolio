import { useEffect, useRef, useState, type ReactNode } from 'react';

/** 스크롤로 화면에 들어오면 아래에서 떠오르며 fade-in 되는 래퍼 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** 등장 지연(ms) */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // 한 번만
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`reveal ${shown ? 'is-visible' : ''} ${className}`}
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
