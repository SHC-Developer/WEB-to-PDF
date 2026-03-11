import React from 'react';
import { EditorElement } from '../types';

interface LineRendererProps {
  element: EditorElement;
  width: number;
  height: number;
  className?: string;
}

export const LineRenderer: React.FC<LineRendererProps> = ({ element, width, height, className = '' }) => {
  const start = element.lineStart ?? { x: 0, y: 0.5 };
  const end = element.lineEnd ?? { x: 1, y: 0.5 };
  const arrowStart = element.arrowStart ?? false;
  const arrowEnd = element.arrowEnd ?? true;
  const { styles } = element;
  const strokeColor = styles.borderColor ?? styles.color ?? '#000000';
  const strokeWidth = styles.borderWidth ?? 2;
  const strokeStyle = styles.borderStyle ?? 'solid';

  const x1 = start.x * width;
  const y1 = start.y * height;
  const x2 = end.x * width;
  const y2 = end.y * height;

  const dashArray = strokeStyle === 'dashed' ? '8,4' : strokeStyle === 'dotted' ? '2,2' : undefined;

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowSize = 10;

  const markerEndId = `arrow-end-${element.id}`;
  const markerStartId = `arrow-start-${element.id}`;

  return (
    <svg width={width} height={height} className={className} style={{ overflow: 'visible' }}>
      <defs>
        {arrowEnd && (
          <marker
            id={markerEndId}
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            refX={arrowSize}
            refY={arrowSize / 2}
            orient="auto"
          >
            <polygon
              points={`0,0 ${arrowSize},${arrowSize / 2} 0,${arrowSize}`}
              fill={strokeColor}
            />
          </marker>
        )}
        {arrowStart && (
          <marker
            id={markerStartId}
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            refX={0}
            refY={arrowSize / 2}
            orient="auto"
          >
            <polygon
              points={`${arrowSize},0 0,${arrowSize / 2} ${arrowSize},${arrowSize}`}
              fill={strokeColor}
            />
          </marker>
        )}
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={arrowEnd ? `url(#${markerEndId})` : undefined}
        markerStart={arrowStart ? `url(#${markerStartId})` : undefined}
      />
    </svg>
  );
};
