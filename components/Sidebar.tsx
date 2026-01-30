import React from 'react';
import { Icons } from './Icons';

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: (shapeType: 'rect' | 'circle') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  onAddText, 
  onAddImage,
  onAddShape
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

        <div className="relative group w-full">
          <button
            className="flex flex-col items-center justify-center py-2 w-full hover:text-white hover:bg-[#2c2e36] transition-colors"
          >
            <Icons.Shape size={24} strokeWidth={1.5} className="mb-1 text-gray-400 group-hover:text-yellow-400" />
            <span className="text-[10px] font-medium">도형</span>
          </button>
          
          {/* Shape Dropdown on Hover */}
          <div className="absolute left-full top-0 ml-1 bg-white shadow-lg rounded-md border border-gray-200 hidden group-hover:flex flex-col p-2 gap-2 min-w-[100px] z-50">
             <button onClick={() => onAddShape('rect')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 text-xs text-gray-700">
               <Icons.Square size={14} /> 사각형
             </button>
             <button onClick={() => onAddShape('circle')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 text-xs text-gray-700">
               <Icons.Circle size={14} /> 원형
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};