import React, { useState, useRef } from 'react';
import { Icons } from './Icons';

interface ToolbarProps {
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  isDoublePage: boolean;
  setIsDoublePage: (isDouble: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSaveNormalQuality?: () => void;
  onSaveHighQuality?: () => void;
  onSaveProject?: () => void;
  isSaving?: boolean;
  onLoadBuiltInTemplate?: (templateId: string) => void;
  onLoadTemplateFromFile?: (file: File) => void;
}

const BUILT_IN_TEMPLATES = [
  { id: 'default', label: '기본 (PET Hospital)' },
] as const;

export const Toolbar: React.FC<ToolbarProps> = ({
  showGrid, setShowGrid,
  isDoublePage, setIsDoublePage,
  scale, setScale,
  onUndo, onRedo,
  onSaveNormalQuality,
  onSaveHighQuality,
  onSaveProject,
  isSaving = false,
  onLoadBuiltInTemplate,
  onLoadTemplateFromFile,
}) => {
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onLoadTemplateFromFile) {
      onLoadTemplateFromFile(file);
    }
    e.target.value = '';
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
          <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">Project Title</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
           <button onClick={onUndo} className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="실행 취소">
             <Icons.Undo size={18} />
           </button>
           <button onClick={onRedo} className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="다시 실행">
             <Icons.Redo size={18} />
           </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* 템플릿 불러오기 */}
        <div className="relative">
          <button
            onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="템플릿 불러오기"
          >
            <Icons.Template size={18} />
            <span>템플릿</span>
          </button>
          {templateMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTemplateMenuOpen(false)} />
              <div className="absolute left-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                {BUILT_IN_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onLoadBuiltInTemplate?.(t.id);
                      setTemplateMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setTemplateMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Icons.Upload size={16} />
                  파일에서 불러오기 (.json)
                </button>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* View Options */}
        <button 
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="그리드 보기"
        >
          <Icons.Grid size={18} />
        </button>

        <button 
          onClick={() => setIsDoublePage(!isDoublePage)}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${isDoublePage ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          {isDoublePage ? '두 페이지 보기' : '한 페이지 보기'}
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
           <button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="hover:text-blue-600 px-1">-</button>
           <span className="w-10 text-center">{Math.round(scale * 100)}%</span>
           <button onClick={() => setScale(Math.min(2, scale + 0.1))} className="hover:text-blue-600 px-1">+</button>
        </div>
        
        {onSaveProject && (
          <button
            onClick={onSaveProject}
            className="px-4 py-2 rounded font-medium text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            title="전체 페이지를 JSON 파일로 저장 (나중에 불러오기 가능)"
          >
            프로젝트 저장
          </button>
        )}
        {onSaveNormalQuality && (
          <button
            onClick={onSaveNormalQuality}
            disabled={isSaving}
            className={`px-4 py-2 rounded font-medium text-sm border transition-colors flex items-center gap-2
              ${isSaving ? 'bg-gray-200 border-gray-200 cursor-not-allowed text-gray-500' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
            `}
            title="PDF 일반화질 저장 (scale 3, JPEG)"
          >
            {isSaving ? '저장 중...' : '일반화질 저장'}
          </button>
        )}
        {onSaveHighQuality && (
          <button
            onClick={onSaveHighQuality}
            disabled={isSaving}
            className={`px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2
              ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0091ff] hover:bg-[#007acc] text-white'}
            `}
            title="PDF 고화질 저장 (scale 4, PNG 무손실)"
          >
            {isSaving ? '저장 중...' : '고화질 저장'}
          </button>
        )}
      </div>
    </div>
  );
};