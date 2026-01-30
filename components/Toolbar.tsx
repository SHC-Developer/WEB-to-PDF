import React from 'react';
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
  onSave: () => void;
  isSaving?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  showGrid, setShowGrid,
  isDoublePage, setIsDoublePage,
  scale, setScale,
  onUndo, onRedo,
  onSave,
  isSaving = false
}) => {
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
        
        <button 
          onClick={onSave}
          disabled={isSaving}
          className={`px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2
            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0091ff] hover:bg-[#007acc] text-white'}
          `}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};