import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Drawer } from './components/Drawer';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StaticPage } from './components/StaticPage';
import { INITIAL_PAGES, PAGE_WIDTH, PAGE_HEIGHT } from './constants';
import { CATALOG_PAGES } from './Templates/catalog/catalog';
import { RENEWAL_CATALOG_PAGES } from './Templates/catalog/catalog-renewal';
import { Page, EditorElement } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const [activeTool, setActiveTool] = useState('text');
  
  // History State
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [history, setHistory] = useState<Page[][]>([]);
  const [future, setFuture] = useState<Page[][]>([]);

  // Clipboard State
  const [clipboardPage, setClipboardPage] = useState<Page | null>(null);
  const [clipboardElement, setClipboardElement] = useState<EditorElement | null>(null);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const selectedElementId = selectedElementIds[0] ?? null;
  const [scale, setScale] = useState(0.8);
  const [showGrid, setShowGrid] = useState(false);
  const [isDoublePage, setIsDoublePage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddShape = (shapeType: 'rect' | 'circle') => {
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
        borderRadius: shapeType === 'circle' ? 999 : 0
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
    const groupId = `group-${Date.now()}`;
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.map(el =>
        selectedElementIds.includes(el.id) ? { ...el, groupId } : el
      )
    })));
  };

  const handleUngroup = () => {
    if (selectedElementIds.length === 0) return;
    saveHistory();
    const ids = new Set(selectedElementIds);
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.map(el =>
        ids.has(el.id) ? { ...el, groupId: undefined } : el
      )
    })));
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

  // --- Template Loading ---
  const handleLoadBuiltInTemplate = useCallback((templateId: string) => {
    if (templateId === 'catalog') {
      setPages(JSON.parse(JSON.stringify(CATALOG_PAGES)));
    } else if (templateId === 'catalog-renewal') {
      setPages(JSON.parse(JSON.stringify(RENEWAL_CATALOG_PAGES)));
    } else {
      setPages(JSON.parse(JSON.stringify(INITIAL_PAGES)));
    }
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
        if (!Array.isArray(data)) {
          throw new Error('유효한 Page 배열이 아닙니다.');
        }
        const pages = data as Page[];
        if (pages.some(p => !p.id || !p.title || !Array.isArray(p.elements))) {
          throw new Error('Page 형식이 올바르지 않습니다.');
        }
        setPages(pages);
        setHistory([]);
        setFuture([]);
        setActivePageIndex(0);
        setSelectedElementIds([]);
      } catch (err) {
        console.error('Template load error:', err);
        alert('템플릿 파일을 불러올 수 없습니다. 형식이 올바른 JSON(Page[])인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  }, []);

  // --- PDF Export ---
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Allow DOM to update and render the export container
      await new Promise(resolve => setTimeout(resolve, 100));

      const container = document.getElementById('pdf-export-container');
      if (!container) {
        console.error("PDF container not found");
        setIsSaving(false);
        return;
      }

      // Initialize jsPDF (A4 Portrait: 210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const pageElements = Array.from(container.children);
      
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;
        
        // 고정 크기로 캡처해 PDF 비율(210:297)과 일치시킴 → 이미지 세로 눌림 방지
        const canvas = await html2canvas(pageEl, {
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: PAGE_WIDTH,
          windowHeight: PAGE_HEIGHT,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) {
          pdf.addPage();
        }

        // 캡처 비율(794:1123 ≈ A4) 그대로 PDF에 맞춤
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`project-${Date.now()}.pdf`);

    } catch (error) {
      console.error("Failed to save PDF:", error);
      alert("PDF 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 프로젝트 저장: 첫 저장 = 다른 이름으로 저장(파일 선택), 이후 = 같은 파일에 덮어쓰기
  const handleSaveProject = useCallback(async () => {
    const json = JSON.stringify(pages, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const writeToHandle = async (handle: FileSystemFileHandle) => {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    };

    try {
      if (projectFileHandleRef.current) {
        await writeToHandle(projectFileHandleRef.current);
        alert(`전체 ${pages.length}개 페이지가 저장되었습니다.`);
        return;
      }

      if (typeof (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker === 'function') {
        const handle = await (window as unknown as { showSaveFilePicker: (opts: { suggestedName?: string; types?: { description: string; accept: Record<string, string[]> }[] }) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: `project-${new Date().toISOString().slice(0, 10)}.json`,
          types: [{ description: 'JSON 프로젝트', accept: { 'application/json': ['.json'] } }],
        });
        projectFileHandleRef.current = handle;
        await writeToHandle(handle);
        alert(`전체 ${pages.length}개 페이지가 저장되었습니다.\n같은 파일에 Ctrl+S로 덮어쓸 수 있습니다.`);
        return;
      }

      // Fallback: 브라우저가 showSaveFilePicker 미지원 시 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert(`전체 ${pages.length}개 페이지가 저장되었습니다.\n파일에서 불러오기로 복원할 수 있습니다.`);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [pages]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Skip if editing input
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (!isInput) {
          e.preventDefault();
          const el = visiblePages.flatMap(p => p.elements).find(e => e.id === selectedElementId);
          if (selectedElementId && el) {
            setClipboardElement(JSON.parse(JSON.stringify(el)));
          } else {
            setClipboardPage(pages[activePageIndex]);
          }
        }
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (!isInput) {
          e.preventDefault();
          if (clipboardElement) {
            saveHistory();
            const newId = `${clipboardElement.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const pasted: EditorElement = {
              ...JSON.parse(JSON.stringify(clipboardElement)),
              id: newId,
              x: clipboardElement.x + 20,
              y: clipboardElement.y + 20,
            };
            const nextPages = pages.map((p, i) =>
              i === activePageIndex
                ? { ...p, elements: [...p.elements, pasted] }
                : p
            );
            setPages(nextPages);
            setSelectedElementIds([newId]);
          } else if (!selectedElementId && clipboardPage) {
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
  }, [selectedElementIds, undo, redo, handleDeleteSelected, handleUpdateElement, handleUpdateElements, handleDeleteElement, handleSaveProject, pages, activePageIndex, clipboardPage, clipboardElement, visiblePages, saveHistory]);


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-800 bg-gray-100">
      <Toolbar 
        showGrid={showGrid} setShowGrid={setShowGrid}
        isDoublePage={isDoublePage} setIsDoublePage={setIsDoublePage}
        scale={scale} setScale={setScale}
        onUndo={undo} onRedo={redo}
        onSave={handleSave}
        onSaveProject={handleSaveProject}
        isSaving={isSaving}
        onLoadBuiltInTemplate={handleLoadBuiltInTemplate}
        onLoadTemplateFromFile={handleLoadTemplateFromFile}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation */}
        <Sidebar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool} 
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onAddShape={handleAddShape}
        />
        
        {/* Context Drawer (Thumbnails) */}
        <Drawer 
          activeTool={activeTool}
          pages={pages} 
          activePageIndex={activePageIndex}
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
        />
        
        {/* Main Canvas Area */}
        <Canvas 
          page={activePage}
          secondPage={secondPage}
          scale={scale}
          showGrid={showGrid}
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
          onUpdateElement={handleUpdateElement}
          onUpdatePage={handleUpdatePage}
          onDeleteElement={handleDeleteElement}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateElement={handleDuplicateElement}
          onGroup={handleGroup}
          onUngroup={handleUngroup}
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
          width: PAGE_WIDTH,
          minWidth: PAGE_WIDTH,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {pages.map(page => (
          <StaticPage key={page.id} page={page} />
        ))}
      </div>
    </div>
  );
}

export default App;