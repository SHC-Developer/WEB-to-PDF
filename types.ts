export type ElementType = 'text' | 'image' | 'shape' | 'line' | 'table' | 'chart' | 'video' | 'group';

export interface EditorElement {
  id: string;
  type: ElementType;
  content?: string; // Text content or Image URL (group에는 없음)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  groupId?: string;
  /** type === 'group' 일 때만: 자식 요소들 (x,y는 그룹 기준 상대 좌표) */
  groupChildren?: EditorElement[];
  /** type === 'line' 일 때: 선의 시작/끝 (0–1 정규화, 요소 내 상대) */
  lineStart?: { x: number; y: number };
  lineEnd?: { x: number; y: number };
  /** type === 'line' 일 때: 화살표 표시 */
  arrowStart?: boolean;
  arrowEnd?: boolean;
  /** type === 'table' 일 때: 표 데이터 */
  tableData?: {
    rows: number;
    cols: number;
    cellContents: string[][];
  };
  /** type === 'chart' 일 때: 차트 데이터 */
  chartData?: {
    chartType: 'bar' | 'line' | 'pie';
    data: { label: string; value: number }[];
  };
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    borderRadius?: number;
    opacity?: number;
    zIndex?: number;
    border?: string;
    borderBottom?: string;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    alignItems?: 'flex-start' | 'center' | 'flex-end';
    /** type === 'shape' 일 때: rect | circle | triangle | diamond | arrow | star */
    shapeType?: 'rect' | 'circle' | 'triangle' | 'diamond' | 'arrow' | 'star';
    /** 그라데이션 채우기 (shape, text 배경 등) */
    gradient?: {
      type: 'linear' | 'radial';
      angle?: number;
      colors: { color: string; stop: number }[];
    };
    /** box-shadow (예: "2px 2px 4px rgba(0,0,0,0.3)") */
    boxShadow?: string;
  };
}

/** 커버 제외 페이지에서 콘텐츠 영역(여백 + 희미한 회색 배경) */
export interface ContentArea {
  margin: number;
  backgroundColor?: string;
}

export interface Page {
  id: string;
  title: string;
  elements: EditorElement[];
  backgroundColor: string;
  /** 있으면 해당 페이지에 여백과 콘텐츠 영역 배경 적용 (커버 제외 시 사용) */
  contentArea?: ContentArea;
}

/** 문서 크기 프리셋 (constants.DocumentPreset과 동일) */
export type DocumentPreset = 'a4' | 'businessCard';

export interface AppState {
  pages: Page[];
  activePageIndex: number;
  selectedElementId: string | null;
  activeTool: string;
  scale: number;
  showGrid: boolean;
  isDoublePage: boolean;
  /** 문서 크기: A4 카탈로그 또는 명함(92×52mm) */
  documentPreset: DocumentPreset;
}