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
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
  };
}

export interface Page {
  id: string;
  title: string;
  elements: EditorElement[];
  backgroundColor: string;
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