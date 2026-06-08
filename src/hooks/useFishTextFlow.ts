import { useEffect, useState, type RefObject } from 'react';
import type { ElementSize } from './useElementSize';
import { createFishTextFlow, type FishTextFlow } from '../utils/fishTextFlow';

export function useFishTextFlow(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  size: ElementSize,
  enabled = true,
  displayScale = 1,
  objectFit: 'contain' | 'cover' = 'contain',
) {
  const [flow, setFlow] = useState<FishTextFlow | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frame = 0;
    let lastFlowUpdate = 0;
    const updateInterval = size.width < 720 ? 140 : 90;

    function updateFlow() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && size.width > 0 && size.height > 0) {
        const now = performance.now();

        if (now - lastFlowUpdate > updateInterval) {
          const nextFlow = createFishTextFlow(
            video,
            canvas,
            size.width,
            size.height,
            displayScale,
            objectFit,
          );

          if (nextFlow) {
            setFlow(nextFlow);
          }

          lastFlowUpdate = now;
        }
      }

      frame = requestAnimationFrame(updateFlow);
    }

    updateFlow();

    return () => cancelAnimationFrame(frame);
  }, [
    canvasRef,
    displayScale,
    enabled,
    objectFit,
    size.height,
    size.width,
    videoRef,
  ]);

  return flow;
}
