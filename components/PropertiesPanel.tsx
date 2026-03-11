import React, { useState } from 'react';
import { Icons } from './Icons';
import { EditorElement, Page } from '../types';

/** #RGB 또는 #RRGGBB 형식인지 검사 후, 적용 가능한 #RRGGBB 반환. 아니면 null */
function parseHexColor(s: string): string | null {
  const t = s.trim();
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(t)) {
    if (t.length === 4) {
      const r = t[1] + t[1], g = t[2] + t[2], b = t[3] + t[3];
      return `#${r}${g}${b}`;
    }
    return t.length === 7 ? t : null;
  }
  return null;
}

/** 색상 문자열을 type="color"용 #RRGGBB로 정규화 */
function toRrggbb(hex: string): string {
  const parsed = parseHexColor(hex);
  return parsed ?? '#ffffff';
}

interface PropertiesPanelProps {
  selectedElement: EditorElement | null;
  selectedElementIds: string[];
  activePage: Page;
  pageWidth: number;
  pageHeight: number;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onUpdatePage: (updates: Partial<Page>) => void;
  onDeleteElement: (id: string) => void;
  onDeleteSelected: () => void;
  onDuplicateElement: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onAlignElements: (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeElements: (mode: 'horizontal' | 'vertical') => void;
  onUpdateTableData?: (id: string, data: { rows: number; cols: number; cellContents: string[][] }) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onRecordChange: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement, 
  selectedElementIds,
  activePage,
  pageWidth,
  pageHeight,
  onUpdateElement,
  onUpdatePage,
  onDeleteElement,
  onDeleteSelected,
  onDuplicateElement,
  onGroup,
  onUngroup,
  onAlignElements,
  onDistributeElements,
  onUpdateTableData,
  onBringForward,
  onSendBackward,
  onRecordChange
}) => {
  /** 페이지 배경 헥사 입력 중일 때만 값 유지 (블러/엔터 시 적용) */
  const [pageBgHexInput, setPageBgHexInput] = useState<string | null>(null);

  // Multiple selection: show group/ungroup and delete selected
  if (selectedElementIds.length > 1) {
    return (
      <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-sm">{selectedElementIds.length}개 선택</h3>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-xs text-gray-500">빈 공간 드래그로 영역 선택 · Ctrl+클릭으로 추가/제외</p>
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">정렬</div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => { onRecordChange(); onAlignElements('left'); }} className="p-2 border rounded hover:bg-gray-50" title="왼쪽 정렬"><Icons.AlignLeft size={16} /></button>
              <button onClick={() => { onRecordChange(); onAlignElements('center'); }} className="p-2 border rounded hover:bg-gray-50" title="가로 가운데"><Icons.AlignCenter size={16} /></button>
              <button onClick={() => { onRecordChange(); onAlignElements('right'); }} className="p-2 border rounded hover:bg-gray-50" title="오른쪽 정렬"><Icons.AlignRight size={16} /></button>
              <div className="w-px bg-gray-300 mx-1" />
              <button onClick={() => { onRecordChange(); onAlignElements('top'); }} className="p-2 border rounded hover:bg-gray-50" title="위쪽 정렬"><Icons.AlignTop size={16} className="rotate-90" /></button>
              <button onClick={() => { onRecordChange(); onAlignElements('middle'); }} className="p-2 border rounded hover:bg-gray-50" title="세로 가운데"><Icons.AlignMiddle size={16} className="rotate-90" /></button>
              <button onClick={() => { onRecordChange(); onAlignElements('bottom'); }} className="p-2 border rounded hover:bg-gray-50" title="아래쪽 정렬"><Icons.AlignBottom size={16} className="rotate-90" /></button>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">분배 (3개 이상)</div>
            <div className="flex gap-2">
              <button onClick={() => { onRecordChange(); onDistributeElements('horizontal'); }} disabled={selectedElementIds.length < 3} className="px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" title="수평 균등 분배">
                수평 분배
              </button>
              <button onClick={() => { onRecordChange(); onDistributeElements('vertical'); }} disabled={selectedElementIds.length < 3} className="px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" title="수직 균등 분배">
                수직 분배
              </button>
            </div>
          </div>
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
                   onClick={() => { onRecordChange(); setPageBgHexInput(null); onUpdatePage({ backgroundColor: color }); }}
                   className={`w-full aspect-square rounded border border-gray-200 shadow-sm ${activePage.backgroundColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={toRrggbb(activePage.backgroundColor || '#ffffff')}
                onChange={(e) => { onRecordChange(); setPageBgHexInput(null); onUpdatePage({ backgroundColor: e.target.value }); }}
                className="w-10 h-10 rounded cursor-pointer border border-gray-200 p-0.5 shrink-0"
                title="팔레트에서 선택"
              />
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="text"
                  value={pageBgHexInput !== null ? pageBgHexInput : (activePage.backgroundColor || '#ffffff')}
                  onChange={(e) => setPageBgHexInput(e.target.value)}
                  onFocus={() => setPageBgHexInput(activePage.backgroundColor || '#ffffff')}
                  onBlur={() => {
                    const hex = parseHexColor(pageBgHexInput ?? activePage.backgroundColor ?? '');
                    if (hex) { onRecordChange(); onUpdatePage({ backgroundColor: hex }); }
                    setPageBgHexInput(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const hex = parseHexColor(pageBgHexInput ?? activePage.backgroundColor ?? '');
                      if (hex) { onRecordChange(); onUpdatePage({ backgroundColor: hex }); }
                      setPageBgHexInput(null);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  placeholder="#000000"
                  className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm font-mono focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">팔레트를 열어 선택하거나, 헥사값(#RRGGBB)을 입력하세요.</p>
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
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { x: pageWidth/2 - selectedElement.width/2 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="가운데 정렬"><Icons.AlignCenter size={16} /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { x: pageWidth - selectedElement.width }); }} className="p-1.5 border rounded hover:bg-gray-50" title="오른쪽 정렬"><Icons.AlignRight size={16} /></button>
             <div className="w-px bg-gray-300 mx-1"></div>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: 0 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="위쪽 정렬"><Icons.AlignTop size={16} className="rotate-90" /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: pageHeight/2 - selectedElement.height/2 }); }} className="p-1.5 border rounded hover:bg-gray-50" title="중간 정렬"><Icons.AlignMiddle size={16} className="rotate-90" /></button>
             <button onClick={() => { record(); onUpdateElement(selectedElement.id, { y: pageHeight - selectedElement.height }); }} className="p-1.5 border rounded hover:bg-gray-50" title="아래쪽 정렬"><Icons.AlignBottom size={16} className="rotate-90" /></button>
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

             <div>
               <label className="text-xs text-gray-500 block mb-1">폰트</label>
               <select
                 value={styles.fontFamily ?? ''}
                 onFocus={record}
                 onChange={(e) => handleChange('styles', { fontFamily: e.target.value || undefined })}
                 className="w-full py-1.5 px-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
               >
                 <option value="">기본</option>
                 <option value="HY신명조">HY신명조</option>
               </select>
             </div>
             
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
             <div>
               <div className="text-xs font-bold text-gray-700 mb-1">그림자</div>
               <div className="flex flex-wrap gap-1">
                 {['none', '0 2px 4px rgba(0,0,0,0.2)'].map((shadow) => (
                   <button
                     key={shadow}
                     onClick={() => { record(); handleChange('styles', { boxShadow: shadow === 'none' ? undefined : shadow }); }}
                     className={`px-2 py-1 text-xs rounded border ${
                       (styles.boxShadow ?? 'none') === shadow ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:bg-gray-50'
                     }`}
                   >
                     {shadow === 'none' ? '없음' : '적용'}
                   </button>
                 ))}
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
              <div>
                <div className="text-xs font-bold text-gray-700 mb-2">도형 종류</div>
                <div className="flex flex-wrap gap-1">
                  {(['rect', 'circle', 'triangle', 'diamond', 'arrow', 'star'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => { record(); handleChange('styles', { shapeType: st, borderRadius: st === 'circle' ? 999 : st === 'rect' ? 0 : styles.borderRadius ?? 0 }); }}
                      className={`px-2 py-1.5 text-xs rounded border ${
                        (styles.shapeType ?? (styles.borderRadius && styles.borderRadius >= 999 ? 'circle' : 'rect')) === st
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {st === 'rect' && '사각형'}
                      {st === 'circle' && '원'}
                      {st === 'triangle' && '삼각형'}
                      {st === 'diamond' && '마름모'}
                      {st === 'arrow' && '화살표'}
                      {st === 'star' && '별'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs font-bold text-gray-700">도형 채우기</div>
              <div className="flex items-center gap-2">
                 <input
                   type="checkbox"
                   id="shape-no-fill"
                   checked={!styles.gradient && styles.backgroundColor === 'transparent'}
                   onChange={(e) => {
                     record();
                     if (e.target.checked) {
                       handleChange('styles', { backgroundColor: 'transparent', gradient: undefined });
                     } else {
                       handleChange('styles', { backgroundColor: '#e7926b', gradient: undefined });
                     }
                   }}
                   className="accent-blue-500"
                 />
                 <label htmlFor="shape-no-fill" className="text-sm text-gray-700">채우기 없음</label>
              </div>
              {!styles.gradient && styles.backgroundColor !== 'transparent' && (
                <input
                  type="color"
                  value={styles.backgroundColor || '#e7926b'}
                  onMouseDown={record}
                  onChange={(e) => handleChange('styles', { backgroundColor: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                />
              )}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">그라데이션</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      record();
                      handleChange('styles', {
                        gradient: { type: 'linear', angle: 90, colors: [{ color: '#e7926b', stop: 0 }, { color: '#f59e0b', stop: 1 }] },
                        backgroundColor: undefined
                      });
                    }}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
                  >
                    선형
                  </button>
                  <button
                    onClick={() => {
                      record();
                      handleChange('styles', {
                        gradient: { type: 'radial', colors: [{ color: '#e7926b', stop: 0 }, { color: '#f59e0b', stop: 1 }] },
                        backgroundColor: undefined
                      });
                    }}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
                  >
                    원형
                  </button>
                  {styles.gradient && (
                    <button
                      onClick={() => { record(); handleChange('styles', { gradient: undefined, backgroundColor: '#e7926b' }); }}
                      className="px-2 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      제거
                    </button>
                  )}
                </div>
                {styles.gradient && styles.gradient.type === 'linear' && (
                  <div className="mt-2 space-y-1">
                    <label className="text-xs text-gray-500">각도</label>
                    <input
                      type="range"
                      min="0" max="360"
                      value={styles.gradient.angle ?? 90}
                      onMouseDown={record}
                      onChange={(e) => handleChange('styles', {
                        gradient: styles.gradient ? { ...styles.gradient, angle: parseInt(e.target.value) } : undefined
                      })}
                      className="w-full h-1 bg-gray-200 rounded accent-blue-500"
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">그림자</div>
                <div className="flex flex-wrap gap-1">
                  {['none', '0 2px 4px rgba(0,0,0,0.2)', '0 4px 8px rgba(0,0,0,0.3)', '2px 2px 4px rgba(0,0,0,0.2)'].map((shadow) => (
                    <button
                      key={shadow}
                      onClick={() => { record(); handleChange('styles', { boxShadow: shadow === 'none' ? undefined : shadow }); }}
                      className={`px-2 py-1 text-xs rounded border ${
                        (styles.boxShadow ?? 'none') === shadow ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {shadow === 'none' ? '없음' : shadow.includes('0 2px') ? '작게' : shadow.includes('0 4px') ? '중간' : '오프셋'}
                    </button>
                  ))}
                </div>
              </div>
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

        {/* Line Specific */}
        {selectedElement.type === 'line' && (
           <div className="space-y-4">
              <div className="text-xs font-bold text-gray-700">선 스타일</div>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-gray-500"><span>두께</span> <span>{selectedElement.styles.borderWidth ?? 2}px</span></div>
                 <input
                   type="range"
                   min="1" max="20"
                   value={selectedElement.styles.borderWidth ?? 2}
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
                     value={selectedElement.styles.borderColor || '#000000'}
                     onMouseDown={record}
                     onChange={(e) => handleChange('styles', { borderColor: e.target.value })}
                     className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                   />
                   <span className="text-xs text-gray-400 font-mono">{selectedElement.styles.borderColor || '#000000'}</span>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="text-xs text-gray-500">스타일</div>
                 <div className="flex gap-1 flex-wrap">
                   {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                     <button
                       key={style}
                       onClick={() => { record(); handleChange('styles', { borderStyle: style }); }}
                       className={`px-2 py-1 text-xs rounded border ${
                         (selectedElement.styles.borderStyle || 'solid') === style
                           ? 'bg-blue-50 border-blue-300 text-blue-700'
                           : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                       }`}
                     >
                       {style === 'solid' && '실선'}
                       {style === 'dashed' && '대시'}
                       {style === 'dotted' && '점선'}
                     </button>
                   ))}
                 </div>
              </div>
              <div>
                 <div className="text-xs font-bold text-gray-700 mb-2">화살표</div>
                 <div className="flex gap-2">
                   <label className="flex items-center gap-2 text-sm">
                     <input
                       type="checkbox"
                       checked={!!selectedElement.arrowStart}
                       onChange={(e) => { record(); onUpdateElement(selectedElement.id, { arrowStart: e.target.checked }); }}
                       className="accent-blue-500"
                     />
                     시작
                   </label>
                   <label className="flex items-center gap-2 text-sm">
                     <input
                       type="checkbox"
                       checked={selectedElement.arrowEnd !== false}
                       onChange={(e) => { record(); onUpdateElement(selectedElement.id, { arrowEnd: e.target.checked }); }}
                       className="accent-blue-500"
                     />
                     끝
                   </label>
                 </div>
              </div>
              <div>
                 <div className="text-xs font-bold text-gray-700 mb-2">선 방향</div>
                 <div className="grid grid-cols-3 gap-1">
                   {[
                     { label: '가로', start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
                     { label: '세로', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
                     { label: '대각선', start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
                   ].map(({ label, start, end }) => (
                     <button
                       key={label}
                       onClick={() => { record(); onUpdateElement(selectedElement.id, { lineStart: start, lineEnd: end }); }}
                       className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
                     >
                       {label}
                     </button>
                   ))}
                 </div>
              </div>
           </div>
        )}

        {/* Chart Specific */}
        {selectedElement.type === 'chart' && selectedElement.chartData && (
           <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-700 mb-2">차트 종류</div>
                <div className="flex flex-wrap gap-1">
                  {(['bar', 'line', 'pie'] as const).map((ct) => (
                    <button
                      key={ct}
                      onClick={() => {
                        record();
                        onUpdateElement(selectedElement.id, {
                          chartData: {
                            ...selectedElement.chartData!,
                            chartType: ct
                          }
                        });
                      }}
                      className={`px-2 py-1.5 text-xs rounded border ${
                        selectedElement.chartData.chartType === ct
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {ct === 'bar' && '막대'}
                      {ct === 'line' && '선'}
                      {ct === 'pie' && '원형'}
                    </button>
                  ))}
                </div>
              </div>
           </div>
        )}

        {/* Table Specific */}
        {selectedElement.type === 'table' && selectedElement.tableData && (
           <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-700 mb-2">행/열</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (!onUpdateTableData) return;
                      record();
                      const d = selectedElement.tableData!;
                      const newRow = Array(d.cols).fill('');
                      onUpdateTableData(selectedElement.id, {
                        rows: d.rows + 1,
                        cols: d.cols,
                        cellContents: [...d.cellContents, newRow]
                      });
                    }}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
                  >
                    행 추가
                  </button>
                  <button
                    onClick={() => {
                      if (!onUpdateTableData || selectedElement.tableData!.rows <= 1) return;
                      record();
                      const d = selectedElement.tableData!;
                      onUpdateTableData(selectedElement.id, {
                        rows: d.rows - 1,
                        cols: d.cols,
                        cellContents: d.cellContents.slice(0, -1)
                      });
                    }}
                    disabled={selectedElement.tableData.rows <= 1}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    행 삭제
                  </button>
                  <button
                    onClick={() => {
                      if (!onUpdateTableData) return;
                      record();
                      const d = selectedElement.tableData!;
                      onUpdateTableData(selectedElement.id, {
                        rows: d.rows,
                        cols: d.cols + 1,
                        cellContents: d.cellContents.map(row => [...row, ''])
                      });
                    }}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
                  >
                    열 추가
                  </button>
                  <button
                    onClick={() => {
                      if (!onUpdateTableData || selectedElement.tableData!.cols <= 1) return;
                      record();
                      const d = selectedElement.tableData!;
                      onUpdateTableData(selectedElement.id, {
                        rows: d.rows,
                        cols: d.cols - 1,
                        cellContents: d.cellContents.map(row => row.slice(0, -1))
                      });
                    }}
                    disabled={selectedElement.tableData.cols <= 1}
                    className="px-2 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    열 삭제
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedElement.tableData.rows}×{selectedElement.tableData.cols}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500"><span>테두리 두께</span> <span>{selectedElement.styles.borderWidth ?? 1}px</span></div>
                <input
                  type="range"
                  min="0" max="5"
                  value={selectedElement.styles.borderWidth ?? 1}
                  onMouseDown={record}
                  onChange={(e) => handleChange('styles', { borderWidth: parseInt(e.target.value) })}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">테두리 색상</div>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedElement.styles.borderColor || '#000000'}
                    onMouseDown={record}
                    onChange={(e) => handleChange('styles', { borderColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                  />
                  <span className="text-xs text-gray-400 font-mono">{selectedElement.styles.borderColor || '#000000'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">글자 크기</div>
                <input
                  type="number"
                  min="8" max="72"
                  value={selectedElement.styles.fontSize ?? 14}
                  onFocus={record}
                  onChange={(e) => handleChange('styles', { fontSize: parseInt(e.target.value) || 14 })}
                  className="w-full py-1.5 text-sm border border-gray-200 rounded px-2"
                />
              </div>
           </div>
        )}
      </div>
    </div>
  );
};