import React from 'react';
import './Table.css';

interface Column<T> {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: string;
  onRowClick?: (record: T) => void;
  emptyText?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  emptyText = 'No data',
}: TableProps<T>) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">{emptyText}</td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={record[rowKey] || index}
                onClick={onRowClick ? () => onRowClick(record) : undefined}
                className={onRowClick ? 'table-row-clickable' : ''}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(record[col.key], record, index)
                      : record[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
