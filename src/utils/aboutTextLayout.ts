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
  '미려한 유저 경험을 디자인하는 프론트엔드 엔지니어가 되기 위해 노력하는 주니어 개발자입니다. 간단한 아이디어를 확장하고, 여러 개발 도구로 구현하여 효과적으로 실력을 기르려 노력합니다. I am a junior developer working hard to become a front-end engineer who designs beautiful user experiences. ';

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
  // 화면을 빼곡히 채우지 않도록 반복을 줄여, 물고기와 여백이 살아나게 한다.
  return prepareWithSegments(aboutText.repeat(2), font, {
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
