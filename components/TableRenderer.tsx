import React from 'react';
import { EditorElement } from '../types';

interface TableRendererProps {
  element: EditorElement;
  editable?: boolean;
  onCellChange?: (row: number, col: number, value: string) => void;
  onRecordChange?: () => void;
  className?: string;
}

export const TableRenderer: React.FC<TableRendererProps> = ({
  element,
  editable = false,
  onCellChange,
  onRecordChange,
  className = ''
}) => {
  const data = element.tableData ?? { rows: 2, cols: 2, cellContents: [['', ''], ['', '']] };
  const { rows, cols, cellContents } = data;
  const { styles } = element;
  const borderColor = styles.borderColor ?? '#000000';
  const borderWidth = styles.borderWidth ?? 1;
  const borderStyle = styles.borderStyle ?? 'solid';

  const safeContents = (): string[][] => {
    const out: string[][] = [];
    for (let r = 0; r < rows; r++) {
      out[r] = [];
      for (let c = 0; c < cols; c++) {
        out[r][c] = cellContents?.[r]?.[c] ?? '';
      }
    }
    return out;
  };

  const contents = safeContents();

  return (
    <table
      className={`w-full h-full border-collapse ${className}`}
      style={{
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        fontSize: styles.fontSize ?? 14,
        color: styles.color ?? '#000000',
      }}
    >
      <tbody>
        {contents.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                  padding: 4,
                  verticalAlign: 'top',
                  backgroundColor: styles.backgroundColor,
                }}
              >
                {editable && onCellChange ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={onRecordChange}
                    onBlur={(e) => onCellChange(ri, ci, e.currentTarget.innerText)}
                    className="min-h-[1em] outline-none"
                  >
                    {cell}
                  </div>
                ) : (
                  <div className="min-h-[1em] break-words whitespace-pre-wrap">{cell}</div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
