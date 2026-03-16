import React from 'react';
import { Page, EditorElement } from '../types';
import { FONT_FAMILY_CSS } from '../constants';
import { ShapeRenderer } from './ShapeRenderer';
import { LineRenderer } from './LineRenderer';
import { TableRenderer } from './TableRenderer';
import { ChartRenderer } from './ChartRenderer';

interface StaticPageProps {
  page: Page;
  pageWidth: number;
  pageHeight: number;
}

const ALIGN_TO_VALIGN: Record<string, 'top' | 'middle' | 'bottom'> = {
  'flex-start': 'top',
  'center': 'middle',
  'flex-end': 'bottom',
};

const renderElementContent = (el: EditorElement) => {
  const baseStyle: React.CSSProperties = el.type === 'line'
    ? { overflow: 'visible' }
    : el.type === 'table' || el.type === 'chart'
    ? { overflow: 'hidden' }
    : {
        ...el.styles,
        ...(el.styles.fontFamily && FONT_FAMILY_CSS[el.styles.fontFamily]
          ? { fontFamily: FONT_FAMILY_CSS[el.styles.fontFamily] }
          : {}),
      };
  return (
  <div
    className={`w-full h-full ${el.type === 'text' ? '' : el.type === 'line' ? '' : 'overflow-hidden'}`}
    style={baseStyle}
  >
    {el.type === 'text' && (
      <div
        style={{
          display: 'table',
          width: '100%',
          height: '100%',
          tableLayout: 'fixed',
        }}
      >
        <div
          className="break-words whitespace-pre-wrap"
          style={{
            display: 'table-cell',
            verticalAlign: ALIGN_TO_VALIGN[el.styles.alignItems || 'center'] || 'middle',
            width: '100%',
            wordBreak: 'keep-all',
          }}
        >
          {el.styles?.textAlign === 'justify' ? (
            <div style={{ width: '100%' }}>
              {(el.content || '').split('\n').map((line, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: line.length > 1 ? 'space-between' : 'center', width: '100%' }}>
                  {line.split('').map((char, j) => (
                    <span key={j}>{char}</span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="break-words whitespace-pre-wrap"
              style={{
                textAlign: el.styles?.textAlign || 'left',
                wordBreak: 'keep-all',
              }}
            >
              {el.content}
            </div>
          )}
        </div>
      </div>
    )}
    {el.type === 'image' && (
      <div
        className="w-full h-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={el.content}
          alt=""
          crossOrigin="anonymous"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        />
      </div>
    )}
    {el.type === 'shape' && <ShapeRenderer element={el} className="w-full h-full" />}
    {el.type === 'line' && <LineRenderer element={el} width={el.width} height={el.height} className="w-full h-full" />}
    {el.type === 'table' && <TableRenderer element={el} className="w-full h-full" />}
    {el.type === 'chart' && <ChartRenderer element={el} width={el.width} height={el.height} className="w-full h-full" />}
  </div>
  );
};

// A simplified version of Canvas that renders elements for PDF generation
// No event handlers, selection outlines, or resize handles.
export const StaticPage: React.FC<StaticPageProps> = ({ page, pageWidth, pageHeight }) => {
  const renderElement = (element: EditorElement) => {
    if (element.type === 'group') {
      return (
        <div
          key={element.id}
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            zIndex: element.styles.zIndex,
          }}
        >
          <div className="w-full h-full relative overflow-hidden">
            {element.groupChildren?.map((child) => (
              <div
                key={child.id}
                data-element-type={child.type}
                style={{
                  position: 'absolute',
                  left: child.x,
                  top: child.y,
                  width: child.width,
                  height: child.height,
                }}
              >
                {renderElementContent(child)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div
        key={element.id}
        data-element-type={element.type}
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
        {renderElementContent(element)}
      </div>
    );
  };

  const margin = page.contentArea?.margin ?? 0;
  const contentBg = page.contentArea?.backgroundColor ?? 'transparent';
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  const contentArea = margin > 0 ? (
    <div
      className="relative overflow-hidden"
      style={{
        position: 'absolute',
        left: margin,
        top: margin,
        width: contentWidth,
        height: contentHeight,
        backgroundColor: contentBg,
      }}
    >
      {page.elements.map(renderElement)}
    </div>
  ) : (
    page.elements.map(renderElement)
  );

  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        backgroundColor: page.backgroundColor,
      }}
    >
      {contentArea}
    </div>
  );
};