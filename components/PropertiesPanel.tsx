import React from 'react';
import { Icons } from './Icons';
import { EditorElement, Page } from '../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../constants';

interface PropertiesPanelProps {
  selectedElement: EditorElement | null;
  selectedElementIds: string[];
  activePage: Page;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onUpdatePage: (updates: Partial<Page>) => void;
  onDeleteElement: (id: string) => void;
  onDeleteSelected: () => void;
  onDuplicateElement: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onRecordChange: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement, 
  selectedElementIds,
  activePage, 
  onUpdateElement,
  onUpdatePage,
  onDeleteElement,
  onDeleteSelected,
  onDuplicateElement,
  onGroup,
  onUngroup,
  onBringForward,
  onSendBackward,
  onRecordChange
}) => {
  
  // Multiple selection: show group/ungroup and delete selected
  if (selectedElementIds.length > 1) {
    return (
      <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-sm">{selectedElementIds.length}개 선택</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500">빈 공간 드래그로 영역 선택 · Ctrl+클릭으로 추가/제외</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { onRecordChange(); onGroup(); }} className="px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50">
              그룹화
            </button>
            <button onClick={() => { onRecordChange(); onUngroup(); }} className="px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50">
              그룹 해제
            </button>
            <button onClick={() => { onRecordChange(); onDeleteSelected(); }} className="px-3 py-2 rounded border border-red-200 text-red-600 text-sm hover:bg-red-50">
              선택 삭제
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedElement) {
    return (
      <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
           <h3 className="font-bold text-gray-800 text-sm">페이지 설정</h3>
        </div>
        
        <div className="p-4 space-y-6">
           <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
              <p>페이지의 빈 공간을 클릭하여 페이지 설정을 확인하세요.</p>
           </div>
           
           <div>
            <div className="text-xs font-bold text-gray-700 mb-2">배경 색상</div>
            <div className="grid grid-cols-5 gap-2">
               {['#ffffff', '#f3f4f6', '#fff1f2', '#ecfdf5', '#eff6ff', '#1e293b', '#4b5563', '#991b1b', '#1e40af', '#000000'].map(color => (
                 <button 
                   key={color} 
                   onClick={() => { onRecordChange(); onUpdatePage({ backgroundColor: color }); }}
                   className={`w-full aspect-square rounded border border-gray-200 shadow-sm ${activePage.backgroundColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
            </div>
           </div>
        </div>
      </div>
    );
  }

  const { styles } = selectedElement;

  // Helper to record before change
  const handleChange = (key: keyof EditorElement | 'styles', value: any) => {
    // We rely on onFocus/onMouseDown for recording history for inputs/sliders
    // because onChange fires too often.
    if (key === 'styles') {
       onUpdateElement(selectedElement.id, { styles: { ...styles, ...value } });
    } else {
       onUpdateElement(selectedElement.id, { [key]: value });
    }
  };

  const record = () => onRecordChange();

  return (
    <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
        <span className="text-sm font-bold text-gray-800 capitalize">{selectedElement.type === 'group' ? '그룹' : selectedElement.type} 속성</span>
        <div className="flex gap-1">
           <button onClick={() => { record(); onUpdateElement(selectedElement.id, { locked: !selectedElement.locked }); }} className={`p-1.5 rounded hover:bg-gray-100 ${selectedElement.locked ? 'text-red-500 bg-red-50' : 'text-gray-500'}`} title="잠금/해제">
              {selectedElement.locked ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
           </button>
           <button onClick={() => onDuplicateElement(selectedElement.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="복사">
              <Icons.Copy size={16} />
           </button>
           <button onClick={() => onDeleteElement(selectedElement.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500" title="삭제">
              <Icons.Trash size={16} />
           </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* 그룹 선택 시: 그룹 해제 버튼 */}
        {selectedElement.type === 'group' && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-700">그룹</div>
            <p className="text-xs text-gray-500">그룹 해제 시 포함된 개체들이 각각 분리됩니다.</p>
            <button
              onClick={() => { record(); onUngroup(); }}
              className="w-full px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50"
            >
              그룹 해제
            </button>
          </div>
        )}

        {/* Layout & Position */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-700">정렬 및 배치</div>
          
          <div className="grid grid-cols-2 gap-2">
             <div className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1.5">
                <span className="text-xs text-gray-400 font-medium">W</span>
                <input 
                   type="number" 
                   value={Math.round(selectedElement.width)}
                   onFocus={record}
                   onChange={(e) => handleChange('width', Number(e.target.value))}
                   className="w-full text-sm outline-none bg-transparent"
                />
             </div>
             <div className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1.5">
                <span className="text-xs text-gray-400 font-medium">H</span>
                <input 
                   type="number" 
                   value={Math.round(selectedElement.height)}
                   onFocus={record}
                   onChange={(e) => handleChange('height', Number(e.target.value))}
                   className="w-full text-sm outline-none bg-transparent"
                />
             </div>
          </div>

          <div className="flex gap-1 justify-between">
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { x: 0 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="왼쪽 정렬"><Icons.AlignLeft size={16} /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { x: PAGE_WIDTH/2 - selectedElement.width/2 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="가운데 정렬"><Icons.AlignCenter size={16} /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { x: PAGE_WIDTH - selectedElement.width }); }} className="p-1.5 border rounded hover:bg-gray-50" title="오른쪽 정렬"><Icons.AlignRight size={16} /></button>
             <div className="w-px bg-gray-300 mx-1"></div>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: 0 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="위쪽 정렬"><Icons.AlignTop size={16} className="rotate-90" /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: PAGE_HEIGHT/2 - selectedElement.height/2 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="중간 정렬"><Icons.AlignMiddle size={16} className="rotate-90" /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: PAGE_HEIGHT - selectedElement.height }); }} className="p-1.5 border rounded hover:bg-gray-50" title="아래쪽 정렬"><Icons.AlignBottom size={16} className="rotate-90" /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <button onClick={() => onBringForward(selectedElement.id)} className="flex items-center justify-center gap-2 py-1.5 border rounded text-xs hover:bg-gray-50"><Icons.BringToFront size={14} /> 앞으로</button>
             <button onClick={() => onSendBackward(selectedElement.id)} className="flex items-center justify-center gap-2 py-1.5 border rounded text-xs hover:bg-gray-50"><Icons.SendToBack size={14} /> 뒤로</button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Text Specific */}
        {selectedElement.type === 'text' && (
          <div className="space-y-4">
             <div className="text-xs font-bold text-gray-700">텍스트 스타일</div>
             
             <div className="flex items-center border border-gray-200 rounded px-2">
               <input 
                  type="number" 
                  value={styles.fontSize} 
                  onFocus={record}
                  onChange={(e) => handleChange('styles', { fontSize: Number(e.target.value) })}
                  className="w-full py-1.5 text-sm outline-none" 
               />
               <span className="text-xs text-gray-400">px</span>
             </div>

             <div className="flex gap-2">
                <input 
                  type="color" 
                  value={styles.color || '#000000'} 
                  onMouseDown={record}
                  onChange={(e) => handleChange('styles', { color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                />
                <div className="flex flex-1 border border-gray-200 rounded overflow-hidden">
                   <button 
                     onClick={() => { record(); handleChange('styles', { fontWeight: styles.fontWeight === 'bold' ? 'normal' : 'bold' }); }}
                     className={`flex-1 flex justify-center items-center hover:bg-gray-50 ${styles.fontWeight === 'bold' ? 'bg-gray-100 text-blue-600' : ''}`}
                   ><span className="font-bold">B</span></button>
                   <button 
                     onClick={() => { record(); handleChange('styles', { fontStyle: styles.fontStyle === 'italic' ? 'normal' : 'italic' }); }}
                     className={`flex-1 flex justify-center items-center hover:bg-gray-50 ${styles.fontStyle === 'italic' ? 'bg-gray-100 text-blue-600' : ''}`}
                   ><span className="italic">I</span></button>
                   <button 
                     onClick={() => { record(); handleChange('styles', { textDecoration: styles.textDecoration === 'underline' ? 'none' : 'underline' }); }}
                     className={`flex-1 flex justify-center items-center hover:bg-gray-50 ${styles.textDecoration === 'underline' ? 'bg-gray-100 text-blue-600' : ''}`}
                   ><span className="underline">U</span></button>
                </div>
             </div>

             <div className="flex border border-gray-200 rounded overflow-hidden">
                {['left', 'center', 'right', 'justify'].map((align) => (
                   <button 
                     key={align}
                     onClick={() => { record(); handleChange('styles', { textAlign: align as any }); }}
                     className={`flex-1 py-1.5 flex justify-center hover:bg-gray-50 ${styles.textAlign === align ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                   >
                     {align === 'left' && <Icons.AlignLeft size={16} />}
                     {align === 'center' && <Icons.AlignCenter size={16} />}
                     {align === 'right' && <Icons.AlignRight size={16} />}
                     {align === 'justify' && <Icons.AlignJustify size={16} />}
                   </button>
                ))}
             </div>

             <div className="text-xs font-bold text-gray-700 mt-2">글자/줄 간격</div>
             <div className="grid grid-cols-2 gap-2 items-start">
               <div className="flex flex-col min-h-[4.5rem]">
                 <label className="text-xs text-gray-500 block mb-1 h-4 flex-shrink-0">좌우 간격</label>
                 <div className="flex items-center border border-gray-200 rounded px-2 h-9 flex-1 min-h-0">
                   <input
                     type="number"
                     step={0.1}
                     value={styles.letterSpacing ?? 0}
                     onFocus={record}
                     onChange={(e) => handleChange('styles', { letterSpacing: Number(e.target.value) })}
                     className="w-full py-1.5 text-sm outline-none h-full min-h-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     title="소수점 입력 가능 (예: 0.5, 1.2)"
                   />
                   <span className="text-xs text-gray-400 ml-1 flex-shrink-0">px</span>
                 </div>
               </div>
               <div className="flex flex-col min-h-[4.5rem]">
                 <label className="text-xs text-gray-500 block mb-1 h-4 flex-shrink-0">상하 간격</label>
                 <div className="flex items-center border border-gray-200 rounded px-2 h-9 flex-1 min-h-0">
                   <input
                     type="number"
                     step={0.01}
                     min={0.5}
                     max={3}
                     value={styles.lineHeight ?? 1.2}
                     onFocus={record}
                     onChange={(e) => handleChange('styles', { lineHeight: Number(e.target.value) })}
                     className="w-full py-1.5 text-sm outline-none h-full min-h-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     title="소수점 입력 가능 (예: 1.25, 1.5)"
                   />
                   <span className="text-xs text-gray-400 ml-1 flex-shrink-0">배수</span>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Image Specific */}
        {selectedElement.type === 'image' && (
           <div className="space-y-4">
              <div className="text-xs font-bold text-gray-700">이미지 옵션</div>
              
              <button 
                className="w-full py-2 border border-blue-200 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-2"
                onClick={() => alert("Background removal requires backend integration. Mocking success.")}
              >
                 <Icons.RemoveBg size={16} /> 배경 제거 (AI)
              </button>

              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-gray-500"><span>불투명도</span> <span>{Math.round((styles.opacity || 1) * 100)}%</span></div>
                 <input 
                   type="range" 
                   min="0" max="1" step="0.1" 
                   value={styles.opacity ?? 1} 
                   onMouseDown={record}
                   onChange={(e) => handleChange('styles', { opacity: parseFloat(e.target.value) })}
                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-gray-500"><span>둥근 모서리</span> <span>{styles.borderRadius || 0}px</span></div>
                 <input 
                   type="range" 
                   min="0" max="100" 
                   value={styles.borderRadius || 0} 
                   onMouseDown={record}
                   onChange={(e) => handleChange('styles', { borderRadius: parseInt(e.target.value) })}
                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
              </div>

              {/* Border Control */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-700 flex justify-between items-center">
                      <span>테두리</span>
                      <input 
                          type="checkbox"
                          checked={!!styles.borderWidth && styles.borderWidth > 0}
                          onChange={(e) => {
                              const isChecked = e.target.checked;
                              record();
                              if (isChecked) {
                                  handleChange('styles', { borderWidth: 1, borderColor: '#000000', borderStyle: 'solid' });
                              } else {
                                  handleChange('styles', { borderWidth: 0 });
                              }
                          }}
                          className="accent-blue-500"
                      />
                  </div>
                  
                  {styles.borderWidth && styles.borderWidth > 0 ? (
                      <>
                          <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                  <span>두께</span>
                                  <span>{styles.borderWidth}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" max="20" 
                                value={styles.borderWidth} 
                                onMouseDown={record}
                                onChange={(e) => handleChange('styles', { borderWidth: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                          </div>
                          
                          <div className="space-y-2">
                              <div className="text-xs text-gray-500">색상</div>
                              <div className="flex gap-2 items-center">
                                  <input 
                                    type="color" 
                                    value={styles.borderColor || '#000000'} 
                                    onMouseDown={record}
                                    onChange={(e) => handleChange('styles', { borderColor: e.target.value })}
                                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                                  />
                                  <div className="text-xs text-gray-400 font-mono">{styles.borderColor || '#000000'}</div>
                              </div>
                          </div>
                      </>
                  ) : null}
              </div>
           </div>
        )}

        {/* Shape Specific */}
        {selectedElement.type === 'shape' && (
           <div className="space-y-4">
              <div className="text-xs font-bold text-gray-700">도형 채우기</div>
              <div className="flex items-center gap-2">
                 <input
                   type="checkbox"
                   id="shape-no-fill"
                   checked={styles.backgroundColor === 'transparent'}
                   onChange={(e) => {
                     record();
                     handleChange('styles', { backgroundColor: e.target.checked ? 'transparent' : '#cccccc' });
                   }}
                   className="accent-blue-500"
                 />
                 <label htmlFor="shape-no-fill" className="text-sm text-gray-700">채우기 없음</label>
              </div>
              {styles.backgroundColor !== 'transparent' && (
                <input
                  type="color"
                  value={styles.backgroundColor || '#cccccc'}
                  onMouseDown={record}
                  onChange={(e) => handleChange('styles', { backgroundColor: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                />
              )}
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-gray-500"><span>모서리 반경</span> <span>{styles.borderRadius || 0}px</span></div>
                 <input
                   type="range"
                   min="0" max="100"
                   value={styles.borderRadius || 0}
                   onMouseDown={record}
                   onChange={(e) => handleChange('styles', { borderRadius: parseInt(e.target.value) })}
                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-100">
                 <div className="text-xs font-bold text-gray-700 flex justify-between items-center">
                   <span>도형 테두리</span>
                   <input
                     type="checkbox"
                     checked={!!styles.borderWidth && styles.borderWidth > 0}
                     onChange={(e) => {
                       record();
                       if (e.target.checked) {
                         handleChange('styles', { borderWidth: 1, borderColor: '#000000', borderStyle: 'solid' });
                       } else {
                         handleChange('styles', { borderWidth: 0 });
                       }
                     }}
                     className="accent-blue-500"
                   />
                 </div>
                 {styles.borderWidth != null && styles.borderWidth > 0 && (
                   <>
                     <div className="space-y-2">
                       <div className="flex justify-between text-xs text-gray-500">
                         <span>두께</span>
                         <span>{styles.borderWidth}px</span>
                       </div>
                       <input
                         type="range"
                         min="1"
                         max="20"
                         value={styles.borderWidth}
                         onMouseDown={record}
                         onChange={(e) => handleChange('styles', { borderWidth: parseInt(e.target.value) })}
                         className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                       />
                     </div>
                     <div className="space-y-2">
                       <div className="text-xs text-gray-500">색상</div>
                       <div className="flex gap-2 items-center">
                         <input
                           type="color"
                           value={styles.borderColor || '#000000'}
                           onMouseDown={record}
                           onChange={(e) => handleChange('styles', { borderColor: e.target.value })}
                           className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                         />
                         <span className="text-xs text-gray-400 font-mono">{styles.borderColor || '#000000'}</span>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="text-xs text-gray-500">스타일</div>
                       <div className="flex gap-1 flex-wrap">
                         {(['solid', 'dashed', 'dotted', 'double'] as const).map((style) => (
                           <button
                             key={style}
                             onClick={() => { record(); handleChange('styles', { borderStyle: style }); }}
                             className={`px-2 py-1 text-xs rounded border ${
                               (styles.borderStyle || 'solid') === style
                                 ? 'bg-blue-50 border-blue-300 text-blue-700'
                                 : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                             }`}
                           >
                             {style === 'solid' && '실선'}
                             {style === 'dashed' && '대시'}
                             {style === 'dotted' && '점선'}
                             {style === 'double' && '이중선'}
                           </button>
                         ))}
                       </div>
                     </div>
                   </>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};