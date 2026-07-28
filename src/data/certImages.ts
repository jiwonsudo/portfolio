import mutsa from '../assets/certs/mutsa.webp';
import sopt from '../assets/certs/sopt.webp';

export type Cert = { src: string; name: string };

/** 수료증/증명서 — About 페이지에 노출. 추가하려면 이미지를 import하고 배열에 추가. */
export const certs: Cert[] = [
  { src: mutsa, name: '멋쟁이사자처럼 대학 11기 수료증' },
  { src: sopt, name: "Let's SOPT 38기 수료증" },
];
