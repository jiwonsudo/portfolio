import { useEffect, useState, type RefObject } from 'react';

export type ElementSize = {
  height: number;
  width: number;
};

export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true,
) {
  const [size, setSize] = useState<ElementSize>({ height: 0, width: 0 });

  useEffect(() => {
    if (!enabled || !ref.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      setSize({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [enabled, ref]);

  return size;
}
