import React from "react";

// PUBLIC_INTERFACE
export default function ChartPlaceholder({ title = "Chart", subtitle, height = 220 }) {
  /** Placeholder panel for charts (no charting dependency yet). */
  return (
    <div className="ei-chartPh">
      <div className="ei-chartPh__top">
        <div>
          <div className="ei-chartPh__title">{title}</div>
          {subtitle ? <div className="ei-chartPh__subtitle">{subtitle}</div> : null}
        </div>
        <div className="ei-chartPh__chip">Chart placeholder</div>
      </div>

      <div className="ei-chartPh__canvas" style={{ height }} aria-label={`${title} placeholder`} />
    </div>
  );
}
