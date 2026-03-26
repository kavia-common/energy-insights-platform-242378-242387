import React from "react";

// PUBLIC_INTERFACE
export default function DataTable({
  columns,
  rows,
  keyField = "id",
  isLoading = false,
  emptyLabel = "No results.",
  rowActions,
  onRowClick,
}) {
  /**
   * Generic table renderer.
   * columns: [{ key, header, render?: (row)=>ReactNode, width?: string }]
   * rows: array of objects
   */
  return (
    <div className="ei-tableWrap" role="region" aria-label="Data table">
      <table className="ei-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
            {rowActions ? <th aria-label="Actions" /> : null}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td className="ei-table__state" colSpan={columns.length + (rowActions ? 1 : 0)}>
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td className="ei-table__state" colSpan={columns.length + (rowActions ? 1 : 0)}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row[keyField]}
                className={onRowClick ? "ei-table__rowClickable" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
                {rowActions ? <td className="ei-table__actionsCell">{rowActions(row)}</td> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
