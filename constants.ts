import { Page, DocumentPreset } from './types';

/** 문서 크기 프리셋 (재export) */
export type { DocumentPreset };

/** 96 DPI: 1mm = 96/25.4 px. 명함 92×52mm → 348×197 px (가장 근접한 정수) */
export const PRESET_SIZES: Record<DocumentPreset, { widthMm: number; heightMm: number; widthPx: number; heightPx: number }> = {
  a4:          { widthMm: 210,  heightMm: 297,  widthPx: 794,  heightPx: 1123 },
  businessCard: { widthMm: 92,   heightMm: 52,   widthPx: 348,  heightPx: 197  },
};

export function getPageSize(preset: DocumentPreset) {
  const s = PRESET_SIZES[preset];
  return { widthPx: s.widthPx, heightPx: s.heightPx, widthMm: s.widthMm, heightMm: s.heightMm };
}

/** 텍스트 폰트 선택 시 CSS에 적용할 font-family 값 (한글/영문 폰트명 폴백) */
export const FONT_FAMILY_CSS: Record<string, string> = {
  'Malgun Gothic': '"Malgun Gothic", "맑은 고딕", sans-serif',
  'Noto Sans KR': '"Noto Sans KR", "Malgun Gothic", "맑은 고딕", sans-serif',
  Pretendard: '"Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif',
  NanumGothic: '"NanumGothic", "Nanum Gothic", "Malgun Gothic", sans-serif',
  Batang: '"Batang", "바탕", serif',
  Dotum: '"Dotum", "돋움", sans-serif',
  Gulim: '"Gulim", "굴림", sans-serif',
  Gungsuh: '"Gungsuh", "궁서", serif',
  'HY신명조': '"HYMyeongJoEmbedded", "HY신명조", "HY Shin MyeongJo", serif',
  NanumMyeongjo: '"NanumMyeongjo", "Nanum Myeongjo", serif',
  Arial: 'Arial, sans-serif',
  'Times New Roman': '"Times New Roman", serif',
  Georgia: 'Georgia, serif',
  Verdana: 'Verdana, sans-serif',
  Tahoma: 'Tahoma, sans-serif',
  'Trebuchet MS': '"Trebuchet MS", sans-serif',
  'Courier New': '"Courier New", monospace',
  serif: 'serif',
  'sans-serif': 'sans-serif',
  monospace: 'monospace',
};

export const FONT_FAMILY_OPTIONS: { value: string; label: string }[] = [
  { value: 'Malgun Gothic', label: '맑은 고딕' },
  { value: 'Noto Sans KR', label: 'Noto Sans KR' },
  { value: 'Pretendard', label: 'Pretendard' },
  { value: 'NanumGothic', label: '나눔고딕' },
  { value: 'HY신명조', label: '조선신명조' },
  { value: 'Batang', label: '바탕' },
  { value: 'Dotum', label: '돋움' },
  { value: 'Gulim', label: '굴림' },
  { value: 'Gungsuh', label: '궁서' },
  { value: 'NanumMyeongjo', label: '나눔명조' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'sans-serif', label: 'sans-serif' },
  { value: 'serif', label: 'serif' },
  { value: 'monospace', label: 'monospace' },
];

/** A4 페이지 크기 (96 DPI: 794×1123) - 캔버스·PDF 출력 기본값 (하위 호환) */
export const PAGE_WIDTH = PRESET_SIZES.a4.widthPx;
export const PAGE_HEIGHT = PRESET_SIZES.a4.heightPx;

/** 앱 시작 시 기본 템플릿: 빈 A4 한 장 */
export const INITIAL_PAGES: Page[] = [
  {
    id: 'p1',
    title: '페이지 1',
    backgroundColor: '#ffffff',
    elements: [],
  },
];