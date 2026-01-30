import React from 'react';
import { Icons } from './Icons';
import { Page } from '../types';

interface DrawerProps {
  activeTool: string;
  pages: Page[];
  activePageIndex: number;
  onPageSelect: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
}

export const Drawer: React.FC<DrawerProps> = ({ 
  activeTool, 
  pages, 
  activePageIndex, 
  onPageSelect, 
  onAddPage,
  onDuplicatePage,
  onDeletePage
}) => {
  return (
    <div className="w-[280px] bg-[#f7f8fa] border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={onAddPage}
          className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          <Icons.Plus size={16} />
          새 빈 페이지
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pages.map((page, index) => (
          <div key={page.id} className="group relative">
             <div 
               onClick={() => onPageSelect(index)}
               className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2 
                 ${activePageIndex === index ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}
               `}
               style={{ aspectRatio: '0.707' }} // A4 aspect ratio approx
             >
                {/* Miniature of the page */}
                <div 
                  className="w-full h-full bg-white relative overflow-hidden" 
                  style={{ backgroundColor: page.backgroundColor }}
                >
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] relative p-8">
                     {/* Simply rendering text elements for preview */}
                     {page.elements.filter(e => e.type === 'text').map(el => (
                       <div key={el.id} style={{
                         position: 'absolute',
                         left: el.x,
                         top: el.y,
                         color: el.styles.color,
                         fontSize: el.styles.fontSize,
                         fontWeight: el.styles.fontWeight,
                         width: el.width,
                         whiteSpace: 'nowrap',
                         overflow: 'hidden',
                         textOverflow: 'ellipsis'
                       }}>
                         {el.content}
                       </div>
                     ))}
                     {/* Image placeholders */}
                     {page.elements.filter(e => e.type === 'image').map(el => (
                        <img 
                          key={el.id}
                          src={el.content} 
                          alt="" 
                          className="absolute object-cover opacity-50"
                          style={{
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height
                          }}
                        />
                     ))}
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {String(index + 1).padStart(2, '0')}
                </div>
             </div>
             
             {/* Hover Actions */}
             <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDuplicatePage(index); }}
                  className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-blue-500"
                  title="페이지 복제"
                >
                  <Icons.Copy size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeletePage(index); }}
                  className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-500"
                  title="페이지 삭제"
                >
                  <Icons.Trash size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};