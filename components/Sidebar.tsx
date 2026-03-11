import React from 'react';
import { Icons } from './Icons';

type ShapeType = 'rect' | 'circle' | 'triangle' | 'diamond' | 'arrow' | 'star';

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: (shapeType: ShapeType) => void;
  onAddLine: () => void;
  onAddTable: () => void;
  onAddChart: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  onAddText, 
  onAddImage,
  onAddShape,
  onAddLine,
  onAddTable,
  onAddChart
}) => {
  return (
    <div className="w-[70px] bg-[#1e2025] flex flex-col items-center py-4 text-gray-400 border-r border-gray-800 z-20 shrink-0">
      <div className="mb-6">
         {/* Brand Logo */}
         <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">F</div>
      </div>
      
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={onAddText}
          className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors group"
          title="텍스트 상자 추가"
        >
          <Icons.Text size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-blue-400" />
          <span className="text-[10px] font-medium">텍스트</span>
        </button>

        <button
          onClick={onAddImage}
          className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors group"
          title="이미지 추가"
        >
          <Icons.Image size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-green-400" />
          <span className="text-[10px] font-medium">이미지</span>
        </button>

        <button
          onClick={onAddTable}
          className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors group"
          title="표 추가"
        >
          <Icons.Grid size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-indigo-400" />
          <span className="text-[10px] font-medium">표</span>
        </button>

        <button
          onClick={onAddChart}
          className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors group"
          title="차트 추가"
        >
          <Icons.Shape size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-teal-400" />
          <span className="text-[10px] font-medium">차트</span>
        </button>

        <button
          onClick={onAddLine}
          className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors group"
          title="선/화살표 추가"
        >
          <Icons.GoTo size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-orange-400" />
          <span className="text-[10px] font-medium">선</span>
        </button>

        <div className="relative group w-full">
          <button
            className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors"
          >
            <Icons.Shape size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-yellow-400" />
            <span className="text-[10px] font-medium">도형</span>
          </button>
          
          {/* Shape Dropdown on Hover */}
          <div className="absolute left-full top-0 ml-1 bg-white shadow-lg rounded-md border border-gray-200 hidden group-hover:flex flex-col p-2 gap-1 min-w-[110px] z-50">
             <button onClick={() => onAddShape('rect')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.Square size={14} /> 사각형
             </button>
             <button onClick={() => onAddShape('circle')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.Circle size={14} /> 원형
             </button>
             <button onClick={() => onAddShape('triangle')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.Triangle size={14} /> 삼각형
             </button>
             <button onClick={() => onAddShape('diamond')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.Shape size={14} /> 마름모
             </button>
             <button onClick={() => onAddShape('arrow')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.GoTo size={14} /> 화살표
             </button>
             <button onClick={() => onAddShape('star')} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 text-xs text-gray-700 rounded">
               <Icons.Shape size={14} /> 별
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};