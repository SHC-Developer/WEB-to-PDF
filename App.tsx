import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Drawer } from './components/Drawer';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StaticPage } from './components/StaticPage';
import { INITIAL_PAGES, getPageSize } from './constants';
import { Page, EditorElement, DocumentPreset } from './types';
import { toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

function App() {
  const [activeTool, setActiveTool] = useState('text');
  
  // History State
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [history, setHistory] = useState<Page[][]>([]);
  const [future, setFuture] = useState<Page[][]>([]);

  // Clipboard State (다중 선택 시 여러 개체, 그룹은 하나의 요소로 저장)
  const [clipboardPage, setClipboardPage] = useState<Page | null>(null);
  const [clipboardElements, setClipboardElements] = useState<EditorElement[]>([]);
  /** 복사한 요소들이 있던 페이지 인덱스 (다른 페이지에 붙여넣을 때 동일 위치 유지용) */
  const [clipboardSourcePageIndex, setClipboardSourcePageIndex] = useState<number | null>(null);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const selectedElementId = selectedElementIds[0] ?? null;
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isDoublePage, setIsDoublePage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documentPreset, setDocumentPreset] = useState<DocumentPreset>('a4');

  const { widthPx: pageWidth, heightPx: pageHeight, widthMm: pageWidthMm, heightMm: pageHeightMm } = getPageSize(documentPreset);

  /** 프로젝트 저장 시 선택한 파일 핸들 (Ctrl+S 두 번째부터 같은 파일에 덮어쓰기) */
  const projectFileHandleRef = useRef<FileSystemFileHandle | null>(null);

  // Helper to get active page
  const activePage = pages[activePageIndex];
  const secondPage = isDoublePage && pages.length > activePageIndex + 1 ? pages[activePageIndex + 1] : null;

  // Find selected element across currently visible pages
  const visiblePages = secondPage ? [activePage, secondPage] : [activePage];
  let selectedElement: EditorElement | null = null;
  
  for (const page of visiblePages) {
    const el = page.elements.find(e => e.id === selectedElementId);
    if (el) {
      selectedElement = el;
      break;
    }
  }

  // --- History Management ---

  const saveHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, pages];
      // Optional: Limit history size
      if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
      return newHistory;
    });
    setFuture([]);
  }, [pages]);

  const undo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.length === 0) return prevHistory;
      
      const previousState = prevHistory[prevHistory.length - 1];
      const newHistory = prevHistory.slice(0, -1);
      
      setFuture(prevFuture => [pages, ...prevFuture]);
      setPages(previousState);
      
      return newHistory;
    });
  }, [pages]);

  const redo = useCallback(() => {
    setFuture(prevFuture => {
      if (prevFuture.length === 0) return prevFuture;
      
      const nextState = prevFuture[0];
      const newFuture = prevFuture.slice(1);
      
      setHistory(prevHistory => [...prevHistory, pages]);
      setPages(nextState);
      
      return newFuture;
    });
  }, [pages]);

  /** 요소(및 그룹 자식)에 새 id 부여한 복제 */
  const cloneElementWithNewIds = useCallback((el: EditorElement): EditorElement => {
    const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const cloned = JSON.parse(JSON.stringify(el)) as EditorElement;
    cloned.id = newId;
    if (cloned.type === 'group' && cloned.groupChildren?.length) {
      cloned.groupChildren = cloned.groupChildren.map(c => cloneElementWithNewIds(c));
    }
    return cloned;
  }, []);

  // --- Element Management ---

  const handleAddText = () => {
    saveHistory();
    const newElement: EditorElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 300,
      height: 50,
      content: '새로운 텍스트',
      styles: {
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
        fontWeight: 'normal'
      }
    };
    addContentToPage(newElement);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const dataUrl = readerEvent.target?.result as string;
          const img = new Image();
          img.onload = () => {
            saveHistory();
            const newElement: EditorElement = {
              id: `img-${Date.now()}`,
              type: 'image',
              x: 150,
              y: 150,
              width: img.naturalWidth,
              height: img.naturalHeight,
              content: dataUrl,
              styles: { objectFit: 'contain' }
            };
            addContentToPage(newElement);
          };
          img.onerror = () => {
            saveHistory();
            addContentToPage({
              id: `img-${Date.now()}`,
              type: 'image',
              x: 150,
              y: 150,
              width: 300,
              height: 200,
              content: dataUrl,
              styles: { objectFit: 'contain' }
            });
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddChart = () => {
    saveHistory();
    const newElement: EditorElement = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      x: 150,
      y: 150,
      width: 300,
      height: 200,
      styles: {},
      chartData: {
        chartType: 'bar',
        data: [
          { label: '1월', value: 40 },
          { label: '2월', value: 30 },
          { label: '3월', value: 50 },
          { label: '4월', value: 20 },
        ],
      },
    };
    addContentToPage(newElement);
  };

  const handleAddTable = () => {
    saveHistory();
    const rows = 3;
    const cols = 3;
    const cellContents = Array.from({ length: rows }, () => Array(cols).fill(''));
    const newElement: EditorElement = {
      id: `table-${Date.now()}`,
      type: 'table',
      x: 100,
      y: 100,
      width: 300,
      height: 120,
      styles: {
        borderColor: '#000000',
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 14,
      },
      tableData: { rows, cols, cellContents },
    };
    addContentToPage(newElement);
  };

  const handleAddLine = () => {
    saveHistory();
    const newElement: EditorElement = {
      id: `line-${Date.now()}`,
      type: 'line',
      x: 150,
      y: 200,
      width: 200,
      height: 24,
      styles: {
        borderColor: '#000000',
        borderWidth: 2,
        borderStyle: 'solid'
      },
      lineStart: { x: 0, y: 0.5 },
      lineEnd: { x: 1, y: 0.5 },
      arrowStart: false,
      arrowEnd: true
    };
    addContentToPage(newElement);
  };

  const handleAddShape = (shapeType: 'rect' | 'circle' | 'triangle' | 'diamond' | 'arrow' | 'star') => {
    saveHistory();
    const newElement: EditorElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 200,
      y: 200,
      width: 150,
      height: 150,
      content: '',
      styles: {
        backgroundColor: '#e7926b',
        borderRadius: shapeType === 'circle' ? 999 : 0,
        shapeType: shapeType === 'rect' || shapeType === 'circle' ? shapeType : shapeType
      }
    };
    addContentToPage(newElement);
  };

  const addContentToPage = (element: EditorElement) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx !== activePageIndex) return p;
      return { ...p, elements: [...p.elements, element] };
    }));
    setSelectedElementIds([element.id]);
  };

  // --- Updates ---

  const handleUpdatePage = (updates: Partial<Page>) => {
    setPages(prev => prev.map((p, idx) => 
      idx === activePageIndex ? { ...p, ...updates } : p
    ));
  };

  const handleUpdateElement = (id: string, updates: Partial<EditorElement>) => {
    setPages(prev => prev.map(page => {
      if (!page.elements.some(e => e.id === id)) return page;
      return {
        ...page,
        elements: page.elements.map(el => el.id === id ? { ...el, ...updates } : el)
      };
    }));
  };

  const handleUpdateElements = (updates: { id: string; updates: Partial<EditorElement> }[]) => {
    if (updates.length === 0) return;
    const byId = new Map(updates.map(u => [u.id, u.updates]));
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.map(el => {
        const u = byId.get(el.id);
        return u ? { ...el, ...u } : el;
      })
    })));
  };

  const handleDeleteElement = (id: string) => {
    saveHistory();
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.filter(el => el.id !== id)
    })));
    setSelectedElementIds(prev => prev.filter(i => i !== id));
  };

  const handleDeleteSelected = () => {
    if (selectedElementIds.length === 0) return;
    saveHistory();
    const ids = new Set(selectedElementIds);
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.filter(el => !ids.has(el.id))
    })));
    setSelectedElementIds([]);
  };

  const handleDuplicateElement = (id: string) => {
    if (!selectedElement) return;
    saveHistory();
    const newEl: EditorElement = {
      ...JSON.parse(JSON.stringify(selectedElement)),
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    };
    addContentToPage(newEl);
  };

  const handleGroup = () => {
    if (selectedElementIds.length < 2) return;
    saveHistory();
    const idSet = new Set(selectedElementIds);
    const newGroupIds: string[] = [];
    setPages(prev => prev.map(page => {
      const selected = page.elements.filter(el => idSet.has(el.id));
      if (selected.length < 2) return page;
      const groupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      newGroupIds.push(groupId);
      const minX = Math.min(...selected.map(el => el.x));
      const minY = Math.min(...selected.map(el => el.y));
      const maxX = Math.max(...selected.map(el => el.x + el.width));
      const maxY = Math.max(...selected.map(el => el.y + el.height));
      const groupChildren: EditorElement[] = selected.map(el => ({
        ...JSON.parse(JSON.stringify(el)),
        x: el.x - minX,
        y: el.y - minY,
        groupId: undefined,
      }));
      const groupElement: EditorElement = {
        id: groupId,
        type: 'group',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        styles: {},
        groupChildren,
      };
      const rest = page.elements.filter(el => !idSet.has(el.id));
      return { ...page, elements: [...rest, groupElement] };
    }));
    setSelectedElementIds(newGroupIds);
  };

  /** 정렬: 선택된 여러 요소를 페이지 기준으로 정렬 */
  const handleAlignElements = (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElementIds.length < 2) return;
    saveHistory();
    const elements = selectedElementIds.flatMap(id => {
      for (const p of visiblePages) {
        const el = p.elements.find(e => e.id === id);
        if (el) return [el];
      }
      return [];
    });
    if (elements.length < 2) return;
    const minX = Math.min(...elements.map(e => e.x));
    const maxX = Math.max(...elements.map(e => e.x + e.width));
    const minY = Math.min(...elements.map(e => e.y));
    const maxY = Math.max(...elements.map(e => e.y + e.height));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const updates: { id: string; updates: Partial<EditorElement> }[] = [];
    for (const el of elements) {
      let x = el.x, y = el.y;
      if (align === 'left') x = minX;
      else if (align === 'center') x = centerX - el.width / 2;
      else if (align === 'right') x = maxX - el.width;
      else if (align === 'top') y = minY;
      else if (align === 'middle') y = centerY - el.height / 2;
      else if (align === 'bottom') y = maxY - el.height;
      updates.push({ id: el.id, updates: { x, y } });
    }
    handleUpdateElements(updates);
  };

  /** 분배: 선택된 여러 요소를 균등 간격으로 배치 */
  const handleUpdateTableData = (id: string, tableData: { rows: number; cols: number; cellContents: string[][] }) => {
    handleUpdateElement(id, { tableData });
  };

  const handleDistributeElements = (mode: 'horizontal' | 'vertical') => {
    if (selectedElementIds.length < 3) return;
    saveHistory();
    const elements = selectedElementIds.flatMap(id => {
      for (const p of visiblePages) {
        const el = p.elements.find(e => e.id === id);
        if (el) return [el];
      }
      return [];
    });
    if (elements.length < 3) return;
    const sorted = mode === 'horizontal'
      ? [...elements].sort((a, b) => a.x + a.width / 2 - (b.x + b.width / 2))
      : [...elements].sort((a, b) => a.y + a.height / 2 - (b.y + b.height / 2));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalSpace = mode === 'horizontal'
      ? (last.x + last.width) - first.x
      : (last.y + last.height) - first.y;
    const sumSizes = mode === 'horizontal'
      ? sorted.reduce((s, e) => s + e.width, 0)
      : sorted.reduce((s, e) => s + e.height, 0);
    const totalGap = totalSpace - sumSizes;
    const gapCount = sorted.length - 1;
    const gap = gapCount > 0 ? totalGap / gapCount : 0;
    const updates: { id: string; updates: Partial<EditorElement> }[] = [];
    let offset = 0;
    for (let i = 0; i < sorted.length; i++) {
      const el = sorted[i];
      if (mode === 'horizontal') {
        updates.push({ id: el.id, updates: { x: first.x + offset } });
        offset += el.width + gap;
      } else {
        updates.push({ id: el.id, updates: { y: first.y + offset } });
        offset += el.height + gap;
      }
    }
    handleUpdateElements(updates);
  };

  const handleUngroup = () => {
    if (selectedElementIds.length === 0) return;
    saveHistory();
    const idSet = new Set(selectedElementIds);
    setPages(prev => prev.map(page => {
      const newElements: EditorElement[] = [];
      for (const el of page.elements) {
        if (!idSet.has(el.id)) {
          newElements.push(el);
          continue;
        }
        if (el.type === 'group' && el.groupChildren?.length) {
          for (const child of el.groupChildren) {
            newElements.push({
              ...child,
              x: el.x + child.x,
              y: el.y + child.y,
            });
          }
        }
      }
      return { ...page, elements: newElements };
    }));
    setSelectedElementIds([]);
  };

  const handleLayerChange = (id: string, direction: 'front' | 'back') => {
    saveHistory();
    setPages(prev => prev.map(page => {
      if (!page.elements.some(e => e.id === id)) return page;
      
      const idx = page.elements.findIndex(e => e.id === id);
      const newElements = [...page.elements];
      const [el] = newElements.splice(idx, 1);
      
      if (direction === 'front') newElements.push(el);
      else newElements.unshift(el);
      
      return { ...page, elements: newElements };
    }));
  };

  // --- Page Management (Thumbnail Actions) ---

  const handleDuplicatePage = (index: number) => {
    saveHistory();
    const pageToCopy = pages[index];
    const newPage: Page = {
      ...JSON.parse(JSON.stringify(pageToCopy)),
      id: `p${Date.now()}`,
      title: `${pageToCopy.title} (Copy)`,
      elements: pageToCopy.elements.map(el => ({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };

    const newPages = [...pages];
    newPages.splice(index + 1, 0, newPage);
    
    setPages(newPages);
    setActivePageIndex(index + 1);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      alert("최소 한 개의 페이지는 필요합니다.");
      return;
    }
    saveHistory();
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    
    // Adjust active index if needed
    if (index < activePageIndex) {
      setActivePageIndex(activePageIndex - 1);
    } else if (index === activePageIndex) {
      setActivePageIndex(Math.min(index, newPages.length - 1));
    }
  };

  /** 좌측 썸네일 드래그로 페이지 순서 변경 */
  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= pages.length) return;
    saveHistory();
    const newPages = [...pages];
    const [removed] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, removed);
    setPages(newPages);
    if (activePageIndex === fromIndex) {
      setActivePageIndex(toIndex);
    } else if (fromIndex < activePageIndex && toIndex >= activePageIndex) {
      setActivePageIndex(activePageIndex - 1);
    } else if (fromIndex > activePageIndex && toIndex <= activePageIndex) {
      setActivePageIndex(activePageIndex + 1);
    }
  };

  // --- Template Loading (기본만 내장, 나머지는 JSON 파일로만 불러오기) ---
  const handleLoadBuiltInTemplate = useCallback((templateId: string) => {
    if (templateId === 'default') {
      setDocumentPreset('a4');
      setScale(1);
      setPages(JSON.parse(JSON.stringify(INITIAL_PAGES)));
    }
    setHistory([]);
    setFuture([]);
    setActivePageIndex(0);
    setSelectedElementIds([]);
  }, []);

  /** 명함 디자인 전용: 빈 명함 1장으로 전환 (명함은 작으므로 기본 확대 2.5배) */
  const handleSwitchToBusinessCard = useCallback(() => {
    setDocumentPreset('businessCard');
    setScale(2);
    setPages([{ id: `p${Date.now()}`, title: '명함 1', backgroundColor: '#ffffff', elements: [] }]);
    setHistory([]);
    setFuture([]);
    setActivePageIndex(0);
    setSelectedElementIds([]);
  }, []);

  const handleLoadTemplateFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        // 지원 형식: { pages, documentPreset? } 또는 Page[] (기존)
        let pages: Page[];
        let preset: DocumentPreset = 'a4';
        if (Array.isArray(data)) {
          pages = data;
        } else if (data && Array.isArray(data.pages)) {
          pages = data.pages;
          if (data.documentPreset === 'businessCard' || data.documentPreset === 'a4') preset = data.documentPreset;
        } else {
          throw new Error('유효한 Page 배열 또는 { pages, documentPreset } 형식이 아닙니다.');
        }
        if (pages.some(p => !p.id || !p.title || !Array.isArray(p.elements))) {
          throw new Error('Page 형식이 올바르지 않습니다.');
        }
        setDocumentPreset(preset);
        setScale(preset === 'businessCard' ? 2 : 1);
        setPages(pages);
        setHistory([]);
        setFuture([]);
        setActivePageIndex(0);
        setSelectedElementIds([]);
      } catch (err) {
        console.error('Template load error:', err);
        alert('템플릿 파일을 불러올 수 없습니다. 형식이 올바른 JSON(Page[] 또는 { pages, documentPreset })인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  }, []);

  // --- PDF Export (공통: scale/포맷 옵션, 현재 documentPreset 크기 그대로 사용) ---
  const savePdfWithOptions = async (options: {
    scale: number;
    format: 'jpeg' | 'png';
    jpegQuality?: number;
    maxExportDimension?: number;
    maxExportPixels?: number;
    compressPdf?: boolean;
  }) => {
    const {
      scale: captureScale,
      format,
      jpegQuality = 1,
      maxExportDimension = 8192,
      maxExportPixels = 67_000_000,
      compressPdf = true,
    } = options;
    const MAX_EXPORT_DIMENSION = maxExportDimension;
    const MAX_EXPORT_PIXELS = maxExportPixels;
    const safeScaleByDimension = Math.min(MAX_EXPORT_DIMENSION / pageWidth, MAX_EXPORT_DIMENSION / pageHeight);
    const safeScaleByArea = Math.sqrt(MAX_EXPORT_PIXELS / (pageWidth * pageHeight));
    const safeCaptureScale = Math.max(1, Math.min(captureScale, safeScaleByDimension, safeScaleByArea));

    await new Promise(resolve => setTimeout(resolve, 100));
    if ('fonts' in document) {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    }

    const container = document.getElementById('pdf-export-container');
    if (!container) {
      console.error("PDF container not found");
      return;
    }

    const pageElements = Array.from(container.children);
    const capturedImages: string[] = [];

    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i] as HTMLElement;
      const exportOptions = {
        cacheBust: true,
        pixelRatio: safeCaptureScale,
        width: pageWidth,
        height: pageHeight,
        fontEmbedCSS: '',
      };

      const imageData = format === 'png'
        ? await toPng(pageEl, exportOptions)
        : await toJpeg(pageEl, { ...exportOptions, quality: jpegQuality });

      capturedImages.push(imageData);
    }

    const isLandscape = documentPreset === 'businessCard';
    const pdf = new jsPDF({
      orientation: isLandscape ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidthMm, pageHeightMm],
      compress: compressPdf,
    });

    for (let i = 0; i < capturedImages.length; i++) {
      if (i > 0) pdf.addPage([pageWidthMm, pageHeightMm], isLandscape ? 'l' : 'p');
      pdf.addImage(capturedImages[i], format === 'png' ? 'PNG' : 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
    }

    pdf.save(`project-${Date.now()}.pdf`);
  };

  const handleSaveNormalQuality = async () => {
    try {
      setIsSaving(true);
      await savePdfWithOptions({ scale: 3, format: 'jpeg', jpegQuality: 1 });
    } catch (error) {
      console.error("Failed to save PDF:", error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`PDF 저장 중 오류가 발생했습니다.\n${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHighQuality = async () => {
    try {
      setIsSaving(true);
      await savePdfWithOptions({
        scale: 12,
        format: 'png',
        maxExportDimension: 12000,
        maxExportPixels: 120_000_000,
        compressPdf: false,
      });
    } catch (error) {
      console.error("Failed to save PDF:", error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`PDF 저장 중 오류가 발생했습니다.\n${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 프로젝트 저장: 첫 저장 = 다른 이름으로 저장(파일 선택), 이후 = 같은 파일에 덮어쓰기
  const handleSaveProject = useCallback(async () => {
    const state = { pages, documentPreset };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const writeToHandle = async (handle: FileSystemFileHandle) => {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    };

    try {
      if (projectFileHandleRef.current) {
        await writeToHandle(projectFileHandleRef.current);
        return;
      }

      if (typeof (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker === 'function') {
        const handle = await (window as unknown as { showSaveFilePicker: (opts: { suggestedName?: string; types?: { description: string; accept: Record<string, string[]> }[] }) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: `project-${new Date().toISOString().slice(0, 10)}.json`,
          types: [{ description: 'JSON 프로젝트', accept: { 'application/json': ['.json'] } }],
        });
        projectFileHandleRef.current = handle;
        await writeToHandle(handle);
        return;
      }

      // Fallback: 브라우저가 showSaveFilePicker 미지원 시 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [pages, documentPreset]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Skip if editing input
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Copy (Ctrl+C / Cmd+C) — 다중 선택 시 모두 복사, 그룹은 하나의 요소로 복사
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (!isInput) {
          e.preventDefault();
          if (selectedElementIds.length > 0) {
            const elements: EditorElement[] = [];
            let sourcePageIndex: number | null = null;
            for (const id of selectedElementIds) {
              const el0 = activePage.elements.find(el => el.id === id);
              if (el0) {
                elements.push(el0);
                if (sourcePageIndex === null) sourcePageIndex = activePageIndex;
                continue;
              }
              if (secondPage) {
                const el1 = secondPage.elements.find(el => el.id === id);
                if (el1) {
                  elements.push(el1);
                  if (sourcePageIndex === null) sourcePageIndex = activePageIndex + 1;
                }
              }
            }
            setClipboardElements(elements.map(el => JSON.parse(JSON.stringify(el))));
            setClipboardSourcePageIndex(sourcePageIndex);
            setClipboardPage(null);
          } else {
            setClipboardPage(pages[activePageIndex]);
            setClipboardElements([]);
            setClipboardSourcePageIndex(null);
          }
        }
      }

      // Paste (Ctrl+V / Cmd+V) — 복사된 여러 개체/그룹 모두 붙여넣기
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (!isInput) {
          e.preventDefault();
          if (clipboardElements.length > 0) {
            saveHistory();
            const samePage = clipboardSourcePageIndex === activePageIndex;
            const offsetX = samePage ? 20 : 0;
            const offsetY = samePage ? 20 : 0;
            const pasted = clipboardElements.map(el => {
              const cloned = cloneElementWithNewIds(el);
              return { ...cloned, x: cloned.x + offsetX, y: cloned.y + offsetY };
            });
            const nextPages = pages.map((p, i) =>
              i === activePageIndex
                ? { ...p, elements: [...p.elements, ...pasted] }
                : p
            );
            setPages(nextPages);
            setSelectedElementIds(pasted.map(el => el.id));
          } else if (selectedElementIds.length === 0 && clipboardPage) {
             saveHistory();
             const newPage: Page = {
               ...JSON.parse(JSON.stringify(clipboardPage)),
               id: `p${Date.now()}`,
               title: `${clipboardPage.title} (Copy)`,
               elements: clipboardPage.elements.map(el => ({
                 ...el,
                 id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
               }))
             };
             const newPages = [...pages];
             newPages.splice(activePageIndex + 1, 0, newPage);
             setPages(newPages);
             setActivePageIndex(activePageIndex + 1);
          }
        }
      }

      // Save project (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject();
      }

      // Undo/Redo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      }

      if (e.key === 'Delete' && selectedElementIds.length > 0) {
        if (!isInput) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }

      // Arrow keys: move selected element(s) by 1px
      const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      if (!isInput && selectedElementIds.length > 0 && arrowKeys.includes(e.key)) {
        e.preventDefault();
        const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
        const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
        saveHistory();
        const updates = selectedElementIds.flatMap(id => {
          for (const p of pages) {
            const el = p.elements.find(el => el.id === id);
            if (el) return [{ id, updates: { x: el.x + dx, y: el.y + dy } as Partial<EditorElement> }];
          }
          return [];
        });
        handleUpdateElements(updates);
      }

      // 글자 좌우 간격: Alt+Shift+N (-0.1px), Alt+Shift+W (+0.1px)
      if (e.altKey && e.shiftKey && (e.key.toLowerCase() === 'n' || e.key.toLowerCase() === 'w')) {
        const textUpdates = selectedElementIds.flatMap(id => {
          for (const p of pages) {
            const el = p.elements.find(el => el.id === id);
            if (el && el.type === 'text') {
              const current = el.styles.letterSpacing ?? 0;
              const delta = e.key.toLowerCase() === 'n' ? -0.1 : 0.1;
              const next = Math.round((current + delta) * 10) / 10;
              return [{ id, nextLetterSpacing: next }];
            }
          }
          return [];
        });
        if (textUpdates.length > 0) {
          e.preventDefault();
          saveHistory();
          const byId = new Map(textUpdates.map(u => [u.id, u.nextLetterSpacing]));
          setPages(prev => prev.map(page => ({
            ...page,
            elements: page.elements.map(el => {
              const next = byId.get(el.id);
              if (next === undefined || el.type !== 'text') return el;
              return { ...el, styles: { ...el.styles, letterSpacing: next } };
            }),
          })));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, undo, redo, handleDeleteSelected, handleUpdateElement, handleUpdateElements, handleDeleteElement, handleSaveProject, pages, activePageIndex, clipboardPage, clipboardElements, clipboardSourcePageIndex, visiblePages, saveHistory, cloneElementWithNewIds]);


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-800 bg-gray-100">
      <Toolbar 
        showGrid={showGrid} setShowGrid={setShowGrid}
        isDoublePage={isDoublePage} setIsDoublePage={setIsDoublePage}
        scale={scale} setScale={setScale}
        onUndo={undo} onRedo={redo}
        onSaveNormalQuality={handleSaveNormalQuality}
        onSaveHighQuality={handleSaveHighQuality}
        onSaveProject={handleSaveProject}
        isSaving={isSaving}
        documentPreset={documentPreset}
        onLoadBuiltInTemplate={handleLoadBuiltInTemplate}
        onLoadTemplateFromFile={handleLoadTemplateFromFile}
        onSwitchToBusinessCard={handleSwitchToBusinessCard}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation */}
        <Sidebar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool} 
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onAddShape={handleAddShape}
          onAddLine={handleAddLine}
          onAddTable={handleAddTable}
          onAddChart={handleAddChart}
        />
        
        {/* Context Drawer (Thumbnails) */}
        <Drawer 
          activeTool={activeTool}
          pages={pages} 
          activePageIndex={activePageIndex}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          onPageSelect={(index) => {
            setActivePageIndex(index);
            setSelectedElementIds([]);
          }}
          onAddPage={() => {
            saveHistory();
            const newPage = { id: `p${Date.now()}`, title: 'New Page', backgroundColor: '#ffffff', elements: [] };
            setPages([...pages, newPage]);
            setActivePageIndex(pages.length);
          }}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onReorderPages={handleReorderPages}
        />
        
        {/* Main Canvas Area */}
        <Canvas 
          page={activePage}
          secondPage={secondPage}
          scale={scale}
          showGrid={showGrid}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          selectedElementIds={selectedElementIds}
          onSelectElements={setSelectedElementIds}
          onUpdateElement={handleUpdateElement}
          onRecordChange={saveHistory}
        />
        
        {/* Right Properties Panel */}
        <PropertiesPanel 
          selectedElement={selectedElement}
          selectedElementIds={selectedElementIds}
          activePage={activePage}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          onUpdateElement={handleUpdateElement}
          onUpdatePage={handleUpdatePage}
          onDeleteElement={handleDeleteElement}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateElement={handleDuplicateElement}
          onGroup={handleGroup}
          onUngroup={handleUngroup}
          onAlignElements={handleAlignElements}
          onDistributeElements={handleDistributeElements}
          onUpdateTableData={handleUpdateTableData}
          onBringForward={(id) => handleLayerChange(id, 'front')}
          onSendBackward={(id) => handleLayerChange(id, 'back')}
          onRecordChange={saveHistory}
        />
      </div>

      {/* Hidden Container for PDF Generation - 고정 크기로 레이아웃 보장 */}
      <div 
        id="pdf-export-container"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: -10000,
          width: pageWidth,
          minWidth: pageWidth,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {pages.map(page => (
          <StaticPage key={page.id} page={page} pageWidth={pageWidth} pageHeight={pageHeight} />
        ))}
      </div>
    </div>
  );
}

export default App;