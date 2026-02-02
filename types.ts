export type ElementType = 'text' | 'image' | 'shape' | 'video';

export interface EditorElement {
  id: string;
  type: ElementType;
  content?: string; // Text content or Image URL
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  groupId?: string;
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

export interface AppState {
  pages: Page[];
  activePageIndex: number;
  selectedElementId: string | null;
  activeTool: string;
  scale: number;
  showGrid: boolean;
  isDoublePage: boolean;
}