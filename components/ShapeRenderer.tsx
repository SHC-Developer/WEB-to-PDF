import React from 'react';
import { EditorElement } from '../types';

const SHAPE_CLIP_PATHS: Record<string, string> = {
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  arrow: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
};

const gradientToCss = (g: NonNullable<EditorElement['styles']['gradient']>): string => {
  const stops = g.colors.map(c => `${c.color} ${c.stop * 100}%`).join(', ');
  if (g.type === 'radial') {
    return `radial-gradient(circle, ${stops})`;
  }
  const angle = g.angle ?? 90;
  return `linear-gradient(${angle}deg, ${stops})`;
};

export const getShapeStyle = (el: EditorElement): React.CSSProperties => {
  const { styles } = el;
  const shapeType = styles.shapeType ?? (styles.borderRadius && styles.borderRadius >= 999 ? 'circle' : 'rect');
  const base: React.CSSProperties = {
    width: '100%',
    height: '100%',
    opacity: styles.opacity ?? 1,
    borderRadius: shapeType === 'circle' ? '50%' : styles.borderRadius ?? 0,
    borderWidth: styles.borderWidth,
    borderColor: styles.borderColor,
    borderStyle: styles.borderStyle ?? 'solid',
    boxShadow: styles.boxShadow,
  };
  if (styles.gradient && styles.gradient.colors.length >= 2) {
    base.background = gradientToCss(styles.gradient);
  } else {
    base.backgroundColor = styles.backgroundColor ?? '#e7926b';
  }
  const clipPath = SHAPE_CLIP_PATHS[shapeType];
  if (clipPath) {
    base.clipPath = clipPath;
    base.WebkitClipPath = clipPath;
    base.borderRadius = 0;
  }
  return base;
};

interface ShapeRendererProps {
  element: EditorElement;
  className?: string;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({ element, className = '' }) => {
  const style = getShapeStyle(element);
  return <div className={className} style={style} />;
};
