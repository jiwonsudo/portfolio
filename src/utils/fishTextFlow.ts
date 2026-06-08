export type FishTextFlow = {
  height: number;
  mask: Uint8Array;
  width: number;
};

export type TextRange = {
  end: number;
  start: number;
};

type DrawRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

function getObjectContainRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  scale: number,
  objectFit: 'contain' | 'cover',
): DrawRect {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  let width = targetWidth;
  let height = targetHeight;

  if (
    (objectFit === 'contain' && sourceAspect > targetAspect) ||
    (objectFit === 'cover' && sourceAspect < targetAspect)
  ) {
    height = width / sourceAspect;
  } else {
    width = height * sourceAspect;
  }

  width *= scale;
  height *= scale;

  return {
    height,
    width,
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
  };
}

function isFishPixel(red: number, green: number, blue: number) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const luma = red * 0.299 + green * 0.587 + blue * 0.114;
  const saturation = max === 0 ? 0 : (max - min) / max;
  const colorSpread = max - min;
  const warmFin = red > 128 && green > 68 && blue < 150 && saturation > 0.22;
  const blueBody = blue > red * 1.08 && blue > green * 1.02 && luma > 56;
  const paleFish = luma > 148 && saturation > 0.08 && colorSpread > 18;

  return luma > 48 && luma < 248 && (warmFin || blueBody || paleFish);
}

function softenFishMask(
  source: Uint8Array,
  width: number,
  height: number,
  radius: number,
) {
  const mask = new Uint8Array(source);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;

      if (source[index] !== 1) {
        continue;
      }

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const nextX = x + offsetX;
          const nextY = y + offsetY;

          if (
            nextX < 0 ||
            nextX >= width ||
            nextY < 0 ||
            nextY >= height ||
            offsetX * offsetX + offsetY * offsetY > radius * radius
          ) {
            continue;
          }

          mask[nextY * width + nextX] = 1;
        }
      }
    }
  }

  return mask;
}

export function createFishTextFlow(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  displayScale = 1,
  objectFit: 'contain' | 'cover' = 'contain',
): FishTextFlow | null {
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (
    !context ||
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0 ||
    width === 0 ||
    height === 0
  ) {
    return null;
  }

  const flowWidth = width < 720 ? 140 : 320;
  const flowHeight = Math.max(120, Math.round((height / width) * flowWidth));
  canvas.width = flowWidth;
  canvas.height = flowHeight;

  const drawRect = getObjectContainRect(
    video.videoWidth,
    video.videoHeight,
    flowWidth,
    flowHeight,
    displayScale,
    objectFit,
  );

  context.clearRect(0, 0, flowWidth, flowHeight);
  context.drawImage(
    video,
    drawRect.x,
    drawRect.y,
    drawRect.width,
    drawRect.height,
  );

  const frame = context.getImageData(0, 0, flowWidth, flowHeight);
  const fishMask = new Uint8Array(flowWidth * flowHeight);
  let fishPixelCount = 0;

  for (let index = 0; index < frame.data.length; index += 4) {
    const red = frame.data[index] ?? 0;
    const green = frame.data[index + 1] ?? 0;
    const blue = frame.data[index + 2] ?? 0;
    const maskIndex = index / 4;

    if (isFishPixel(red, green, blue)) {
      fishMask[maskIndex] = 1;
      fishPixelCount += 1;
    }
  }

  if (fishPixelCount < 40) {
    return null;
  }

  return {
    height: flowHeight,
    mask: softenFishMask(fishMask, flowWidth, flowHeight, 3),
    width: flowWidth,
  };
}

export function getFishRangesForBand(
  flow: FishTextFlow,
  canvasWidth: number,
  canvasHeight: number,
  bandTop: number,
  bandBottom: number,
  padding: number,
) {
  const ranges: TextRange[] = [];
  const sampleTop = Math.max(
    0,
    Math.floor((bandTop / canvasHeight) * flow.height),
  );
  const sampleBottom = Math.min(
    flow.height - 1,
    Math.ceil((bandBottom / canvasHeight) * flow.height),
  );
  const scaleX = canvasWidth / flow.width;
  const minPixelsInRange = Math.max(2, Math.round(flow.width * 0.006));

  for (let y = sampleTop; y <= sampleBottom; y += 1) {
    let start = -1;
    let count = 0;

    for (let x = 0; x < flow.width; x += 1) {
      const isFish = flow.mask[y * flow.width + x] === 1;

      if (isFish && start === -1) {
        start = x;
        count = 1;
        continue;
      }

      if (isFish) {
        count += 1;
        continue;
      }

      if (start !== -1 && count >= minPixelsInRange) {
        ranges.push({
          end: Math.min(canvasWidth, (x + 1) * scaleX + padding),
          start: Math.max(0, start * scaleX - padding),
        });
      }

      start = -1;
      count = 0;
    }

    if (start !== -1 && count >= minPixelsInRange) {
      ranges.push({
        end: Math.min(canvasWidth, flow.width * scaleX + padding),
        start: Math.max(0, start * scaleX - padding),
      });
    }
  }

  return mergeRanges(ranges, padding * 0.8);
}

function mergeRanges(ranges: TextRange[], gapTolerance: number) {
  const sortedRanges = ranges
    .filter((range) => range.end > range.start)
    .sort((first, second) => first.start - second.start);
  const mergedRanges: TextRange[] = [];

  for (const range of sortedRanges) {
    const previous = mergedRanges.at(-1);

    if (!previous || range.start > previous.end + gapTolerance) {
      mergedRanges.push({ ...range });
      continue;
    }

    previous.end = Math.max(previous.end, range.end);
  }

  return mergedRanges;
}
