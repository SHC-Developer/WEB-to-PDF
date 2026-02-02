import React from 'react';
import { Page, EditorElement } from '../types';

interface StaticPageProps {
  page: Page;
}

// A simplified version of Canvas that renders elements for PDF generation
// No event handlers, selection outlines, or resize handles.
export const StaticPage: React.FC<StaticPageProps> = ({ page }) => {
  const renderElement = (element: EditorElement) => {
    return (
      <div
        key={element.id}
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: element.styles.zIndex
        }}
      >
        <div 
          className={`w-full h-full ${element.type === 'text' ? '' : 'overflow-hidden'}`}
          style={{
            ...element.styles,
            display: element.type === 'text' ? 'flex' : undefined,
            alignItems: element.type === 'text' ? (element.styles.alignItems || 'center') : undefined,
          }}
        >
           {element.type === 'text' && (
             <div className="w-full break-words whitespace-pre-wrap" style={{ cursor: 'text' }}>
               {element.content}
             </div>
           )}

           {element.type === 'image' && (
             <img 
               src={element.content} 
               alt="" 
               className="w-full h-full"
               style={{ objectFit: element.styles.objectFit || 'cover' }}
               crossOrigin="anonymous" // Important for html2canvas
             />
           )}

           {element.type === 'shape' && (
             <div className="w-full h-full"></div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative overflow-hidden bg-white"
      style={{ 
        width: '595px', 
        height: '842px', 
        backgroundColor: page.backgroundColor 
      }}
    >
      {/* Background Grid is NOT rendered for PDF */}
      {page.elements.map(renderElement)}
    </div>
  );
};