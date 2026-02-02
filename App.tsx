import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Drawer } from './components/Drawer';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StaticPage } from './components/StaticPage';
import { INITIAL_PAGES } from './constants';
import { CATALOG_PAGES } from './Templates/catalog/catalog';
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

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.8);
  const [showGrid, setShowGrid] = useState(false);
  const [isDoublePage, setIsDoublePage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    // Simulation of file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
           saveHistory();
           const newElement: EditorElement = {
            id: `img-${Date.now()}`,
            type: 'image',
            x: 150,
            y: 150,
            width: 300,
            height: 200,
            content: readerEvent.target?.result as string,
            styles: {}
          };
          addContentToPage(newElement);
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
    setSelectedElementId(element.id);
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

  const handleDeleteElement = (id: string) => {
    saveHistory();
    setPages(prev => prev.map(page => ({
      ...page,
      elements: page.elements.filter(el => el.id !== id)
    })));
    setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    if (!selectedElement) return;
    saveHistory();
    const newEl = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    };
    addContentToPage(newEl);
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
    } else {
      setPages(JSON.parse(JSON.stringify(INITIAL_PAGES)));
    }
    setHistory([]);
    setFuture([]);
    setActivePageIndex(0);
    setSelectedElementId(null);
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
        setSelectedElementId(null);
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
        
        // High quality scale
        const canvas = await html2canvas(pageEl, {
          scale: 2, 
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF, filling the page
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


  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Skip if editing input
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (!isInput) {
          if (!selectedElementId) {
            setClipboardPage(pages[activePageIndex]);
          }
        }
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (!isInput) {
          if (!selectedElementId && clipboardPage) {
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

      if (e.key === 'Delete' && selectedElementId) {
        if (!isInput) {
           handleDeleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, undo, redo, handleDeleteElement, pages, activePageIndex, clipboardPage, saveHistory]);


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-800 bg-gray-100">
      <Toolbar 
        showGrid={showGrid} setShowGrid={setShowGrid}
        isDoublePage={isDoublePage} setIsDoublePage={setIsDoublePage}
        scale={scale} setScale={setScale}
        onUndo={undo} onRedo={redo}
        onSave={handleSave}
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
            setSelectedElementId(null);
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
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onRecordChange={saveHistory}
        />
        
        {/* Right Properties Panel */}
        <PropertiesPanel 
          selectedElement={selectedElement}
          activePage={activePage}
          onUpdateElement={handleUpdateElement}
          onUpdatePage={handleUpdatePage}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={(id) => handleLayerChange(id, 'front')}
          onSendBackward={(id) => handleLayerChange(id, 'back')}
          onRecordChange={saveHistory}
        />
      </div>

      {/* Hidden Container for PDF Generation */}
      {/* Position fixed far away to be rendered but not visible */}
      <div 
        id="pdf-export-container"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: -10000,
          display: 'flex',
          flexDirection: 'column'
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