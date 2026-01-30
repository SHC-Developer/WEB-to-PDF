import React, { useRef, useState } from 'react';
import { Page, EditorElement } from '../types';
import { Icons } from './Icons';

interface CanvasProps {
  page: Page;
  secondPage?: Page | null; // For double page view
  scale: number;
  showGrid: boolean;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onRecordChange: () => void;
}

interface SnapLine {
  orientation: 'vertical' | 'horizontal';
  position: number;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  page,
  secondPage, 
  scale, 
  showGrid,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onRecordChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  // Snap lines state
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);
  // To ensure we render snap lines on the correct page
  const [activeSnapPageId, setActiveSnapPageId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers for Move/Resize/Rotate
  const handleMouseDown = (e: React.MouseEvent, element: EditorElement, pageId: string, handleType?: string) => {
    e.stopPropagation();
    
    // Always select the element, even if locked
    onSelectElement(element.id);

    // If locked, prevent dragging/resizing/rotating
    if (element.locked) return;

    // Record history before starting interaction
    onRecordChange();

    const startX = e.clientX;
    const startY = e.clientY;
    const startElX = element.x;
    const startElY = element.y;
    const startWidth = element.width;
    const startHeight = element.height;
    
    // Identify current page and elements for snapping
    const currentPage = page.id === pageId ? page : secondPage;
    if (!currentPage) return; // Should not happen

    setActiveSnapPageId(pageId);

    // Prepare Snap Targets (only for dragging currently to keep it simple and robust)
    // Vertical Lines (X coordinates)
    const snapTargetsX: number[] = [0, 595 / 2, 595]; // Page Left, Center, Right
    // Horizontal Lines (Y coordinates)
    const snapTargetsY: number[] = [0, 842 / 2, 842]; // Page Top, Middle, Bottom

    currentPage.elements.forEach(el => {
      if (el.id === element.id) return;
      snapTargetsX.push(el.x, el.x + el.width / 2, el.x + el.width);
      snapTargetsY.push(el.y, el.y + el.height / 2, el.y + el.height);
    });

    const SNAP_THRESHOLD = 5;

    if (handleType === 'rotate') {
      setIsRotating(true);
      const onMouseMove = (moveEvent: MouseEvent) => {
        const rect = (moveEvent.target as HTMLElement).closest('.element-wrapper')?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const radians = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
          const degrees = (radians * (180 / Math.PI)) + 90; // +90 to align with top handle
          onUpdateElement(element.id, { rotation: degrees });
        }
      };
      const onMouseUp = () => {
        setIsRotating(false);
        setSnapLines([]);
        setActiveSnapPageId(null);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

    } else if (handleType) {
      // Resizing
      setIsResizing(true);
      
      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = (moveEvent.clientX - startX) / scale;
        const deltaY = (moveEvent.clientY - startY) / scale;
        
        let newX = startElX;
        let newY = startElY;
        let newWidth = startWidth;
        let newHeight = startHeight;

        if (handleType.includes('e')) newWidth = startWidth + deltaX;
        if (handleType.includes('w')) { newX = startElX + deltaX; newWidth = startWidth - deltaX; }
        if (handleType.includes('s')) newHeight = startHeight + deltaY;
        if (handleType.includes('n')) { newY = startElY + deltaY; newHeight = startHeight - deltaY; }

        if (newWidth > 10 && newHeight > 10) {
          onUpdateElement(element.id, { x: newX, y: newY, width: newWidth, height: newHeight });
        }
      };

      const onMouseUp = () => {
        setIsResizing(false);
        setSnapLines([]);
        setActiveSnapPageId(null);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

    } else {
      // Dragging with Snap
      setIsDragging(true);
      // setDragOffset({ x: e.clientX - element.x * scale, y: e.clientY - element.y * scale });
      
      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = (moveEvent.clientX - startX) / scale;
        const deltaY = (moveEvent.clientY - startY) / scale;
        
        let proposedX = startElX + deltaX;
        let proposedY = startElY + deltaY;
        
        const currentSnapLines: SnapLine[] = [];

        // Check X Snaps (Vertical Lines)
        // Candidates: Left, Center, Right of moving element
        const candidatesX = [
            { val: proposedX, offset: 0 },
            { val: proposedX + element.width / 2, offset: element.width / 2 },
            { val: proposedX + element.width, offset: element.width }
        ];

        let closestDistX = SNAP_THRESHOLD;
        let snappedX = proposedX;

        candidatesX.forEach(cand => {
            snapTargetsX.forEach(target => {
                const dist = Math.abs(cand.val - target);
                if (dist < closestDistX) {
                    closestDistX = dist;
                    snappedX = target - cand.offset;
                    // Add visual line
                    if (!currentSnapLines.find(l => l.orientation === 'vertical' && l.position === target)) {
                         currentSnapLines.push({ orientation: 'vertical', position: target });
                    }
                }
            });
        });

        // Check Y Snaps (Horizontal Lines)
        // Candidates: Top, Middle, Bottom of moving element
        const candidatesY = [
            { val: proposedY, offset: 0 },
            { val: proposedY + element.height / 2, offset: element.height / 2 },
            { val: proposedY + element.height, offset: element.height }
        ];

        let closestDistY = SNAP_THRESHOLD;
        let snappedY = proposedY;

        candidatesY.forEach(cand => {
            snapTargetsY.forEach(target => {
                const dist = Math.abs(cand.val - target);
                if (dist < closestDistY) {
                    closestDistY = dist;
                    snappedY = target - cand.offset;
                     if (!currentSnapLines.find(l => l.orientation === 'horizontal' && l.position === target)) {
                         currentSnapLines.push({ orientation: 'horizontal', position: target });
                    }
                }
            });
        });
        
        // Refine Snap Lines: Only keep lines that correspond to the actual snapped position
        const finalSnapLines: SnapLine[] = [];
        if (Math.abs(snappedX - proposedX) > 0.01) {
             candidatesX.forEach(cand => {
                 const currentVal = snappedX + cand.offset;
                 snapTargetsX.forEach(target => {
                     if (Math.abs(currentVal - target) < 0.1) {
                         if (!finalSnapLines.some(l => l.orientation === 'vertical' && l.position === target)) {
                             finalSnapLines.push({ orientation: 'vertical', position: target });
                         }
                     }
                 });
             });
        }
        if (Math.abs(snappedY - proposedY) > 0.01) {
             candidatesY.forEach(cand => {
                 const currentVal = snappedY + cand.offset;
                 snapTargetsY.forEach(target => {
                     if (Math.abs(currentVal - target) < 0.1) {
                         if (!finalSnapLines.some(l => l.orientation === 'horizontal' && l.position === target)) {
                             finalSnapLines.push({ orientation: 'horizontal', position: target });
                         }
                     }
                 });
             });
        }

        setSnapLines(finalSnapLines);
        
        onUpdateElement(element.id, {
          x: snappedX,
          y: snappedY
        });
      };

      const onMouseUp = () => {
        setIsDragging(false);
        setSnapLines([]);
        setActiveSnapPageId(null);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  const renderElement = (element: EditorElement, pageId: string) => {
    const isSelected = selectedElementId === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute group element-wrapper ${isSelected ? 'z-50' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          cursor: element.locked ? 'default' : 'move',
          zIndex: element.styles.zIndex
        }}
        onMouseDown={(e) => handleMouseDown(e, element, pageId)}
      >
        {/* Content */}
        <div 
          className={`w-full h-full ${element.type === 'text' ? '' : 'overflow-hidden'}`}
          style={{
            ...element.styles,
          }}
        >
           {element.type === 'text' && (
             <div className="w-full h-full break-words whitespace-pre-wrap outline-none" 
                contentEditable={isSelected && !element.locked}
                suppressContentEditableWarning
                onFocus={() => onRecordChange()}
                onBlur={(e) => onUpdateElement(element.id, { content: e.currentTarget.innerText })}
                style={{ 
                   cursor: 'text',
                   display: 'flex',
                   alignItems: 'center', 
                   pointerEvents: isSelected && !isDragging ? 'auto' : 'none'
                }}
             >
               {element.content}
             </div>
           )}

           {element.type === 'image' && (
             <img src={element.content} alt="" className="w-full h-full object-cover pointer-events-none" />
           )}

           {element.type === 'shape' && (
             <div className="w-full h-full flex items-center justify-center pointer-events-none">
             </div>
           )}
        </div>

        {/* Selection Border - Always show if selected */}
        {isSelected && (
           <div className={`absolute -inset-0.5 border pointer-events-none ${element.locked ? 'border-red-400' : 'border-blue-500'}`}></div>
        )}

        {/* Locked Overlay */}
        {element.locked && isSelected && (
           <div className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow z-50">
              <Icons.Lock size={12} />
           </div>
        )}

        {/* Resize/Rotate Handles - Only if not locked */}
        {isSelected && !element.locked && (
          <>
            {/* Rotate Handle */}
            <div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:text-blue-500"
              onMouseDown={(e) => handleMouseDown(e, element, pageId, 'rotate')}
            >
              <Icons.Rotate size={12} />
            </div>

            {/* Resize Handles */}
            {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((dir) => (
              <div
                key={dir}
                className={`absolute w-2.5 h-2.5 bg-white border border-blue-500 rounded-sm z-50
                  ${dir === 'n' || dir === 's' ? 'cursor-ns-resize' : ''}
                  ${dir === 'e' || dir === 'w' ? 'cursor-ew-resize' : ''}
                  ${dir === 'nw' || dir === 'se' ? 'cursor-nwse-resize' : ''}
                  ${dir === 'ne' || dir === 'sw' ? 'cursor-nesw-resize' : ''}
                `}
                style={{
                  top: dir.includes('n') ? '-5px' : dir.includes('s') ? 'calc(100% - 5px)' : 'calc(50% - 5px)',
                  left: dir.includes('w') ? '-5px' : dir.includes('e') ? 'calc(100% - 5px)' : 'calc(50% - 5px)',
                }}
                onMouseDown={(e) => handleMouseDown(e, element, pageId, dir)}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderSnapLines = (pageId: string) => {
    if (activeSnapPageId !== pageId) return null;
    return (
      <>
        {snapLines.map((line, i) => (
          <div
            key={i}
            className="absolute bg-pink-500 z-[60] pointer-events-none"
            style={{
              left: line.orientation === 'vertical' ? line.position : 0,
              top: line.orientation === 'horizontal' ? line.position : 0,
              width: line.orientation === 'vertical' ? '1px' : '100%',
              height: line.orientation === 'horizontal' ? '1px' : '100%',
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div 
      className="flex-1 bg-gray-200 overflow-auto flex items-center justify-center p-12 relative"
      onClick={() => onSelectElement(null)}
      ref={canvasRef}
    >
      <div className={`flex gap-1 transition-transform duration-200 ease-out`} style={{ transform: `scale(${scale})` }}>
        
        {/* Page 1 */}
        <div 
          className="bg-white shadow-xl relative overflow-hidden"
          style={{ 
            width: '595px', height: '842px', // A4
            backgroundColor: page.backgroundColor
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none z-0" 
                 style={{ 
                   backgroundImage: 'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }} 
            />
          )}
          {showGrid && <div className="absolute top-0 left-0 w-full h-4 bg-gray-100 border-b border-gray-300 z-0 text-[8px] flex items-end px-1 text-gray-400">0px</div>}
          
          {page.elements.map(el => renderElement(el, page.id))}
          {renderSnapLines(page.id)}
        </div>

        {/* Page 2 (Double Page View) */}
        {secondPage && (
          <div 
            className="bg-white shadow-xl relative overflow-hidden"
            style={{ 
              width: '595px', height: '842px', // A4
              backgroundColor: secondPage.backgroundColor
            }}
            onClick={(e) => e.stopPropagation()}
          >
             {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-0" 
                  style={{ 
                    backgroundImage: 'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                  }} 
              />
            )}
            {secondPage.elements.map(el => renderElement(el, secondPage.id))}
            {renderSnapLines(secondPage.id)}
          </div>
        )}

      </div>
      
      {/* Floating Info */}
      <div className="absolute bottom-6 right-6 flex bg-white rounded shadow-lg border border-gray-200 text-xs">
         <div className="px-3 py-2 border-r border-gray-100 font-mono">
            {selectedElementId ? `Selected: ${selectedElementId}` : 'No Selection'}
         </div>
      </div>
    </div>
  );
};