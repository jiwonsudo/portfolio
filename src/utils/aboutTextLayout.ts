import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';
import {
  getFishRangesForBand,
  type FishTextFlow,
  type TextRange,
} from './fishTextFlow';

export type TextLine = {
  text: string;
  x: number;
  y: number;
};

export type TextSpec = {
  font: string;
  fontSize: number;
  lineHeight: number;
  paddingBottom: number;
  paddingTop: number;
  paddingX: number;
};

export const aboutText =
  '기획자의 상상력을 온전한 유저 경험으로 시각화하는 프론트엔드 개발자입니다. 제품의 의도, 사용자의 맥락, 인터랙션의 감정을 함께 읽고 화면으로 번역합니다. I build interfaces that help product teams move from idea to believable experience. ';

export function getAboutTextSpec(width: number): TextSpec {
  const isMobile = width < 720;
  const fontSize = isMobile ? 18 : 34;

  return {
    font: `800 ${fontSize}px Inter`,
    fontSize,
    lineHeight: isMobile ? 27 : 46,
    paddingBottom: isMobile ? 52 : 64,
    paddingTop: isMobile ? 88 : 104,
    paddingX: isMobile ? 18 : 48,
  };
}

export function prepareAboutText(font: string): PreparedTextWithSegments {
  return prepareWithSegments(aboutText.repeat(14), font, {
    wordBreak: 'keep-all',
  });
}

export function layoutAboutText(
  prepared: PreparedTextWithSegments,
  width: number,
  height: number,
  spec: TextSpec,
  fishFlow: FishTextFlow | null,
) {
  const lines: TextLine[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  for (
    let y = spec.paddingTop;
    y < height - spec.paddingBottom;
    y += spec.lineHeight
  ) {
    const slots = getTextSlots(
      width,
      spec.paddingX,
      fishFlow
        ? getFishRangesForBand(
            fishFlow,
            width,
            height,
            y - spec.lineHeight * 0.9,
            y + spec.lineHeight * 0.22,
            spec.fontSize * 0.72,
          )
        : [],
    );

    for (const slot of slots) {
      if (slot.end - slot.start < Math.max(96, spec.fontSize * 4.2)) {
        continue;
      }

      const range = layoutNextLineRange(
        prepared,
        cursor,
        slot.end - slot.start,
      );

      if (range === null) {
        return lines;
      }

      const line = materializeLineRange(prepared, range);
      lines.push({ text: line.text, x: slot.start, y });
      cursor = range.end;
    }
  }

  return lines;
}

function getTextSlots(
  width: number,
  paddingX: number,
  blockedRanges: TextRange[],
) {
  const slots: TextRange[] = [];
  let cursorX = paddingX;
  const rightEdge = width - paddingX;

  for (const range of blockedRanges) {
    const start = Math.max(paddingX, range.start);
    const end = Math.min(rightEdge, range.end);

    if (start > cursorX) {
      slots.push({ end: start, start: cursorX });
    }

    cursorX = Math.max(cursorX, end);
  }

  if (cursorX < rightEdge) {
    slots.push({ end: rightEdge, start: cursorX });
  }

  return slots;
}
