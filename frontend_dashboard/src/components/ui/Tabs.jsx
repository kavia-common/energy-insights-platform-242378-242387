import React from "react";

// PUBLIC_INTERFACE
export default function Tabs({ tabs, value, onChange, ariaLabel = "Tabs" }) {
  /** Simple tabs control. tabs: [{ value, label, count? }] */
  return (
    <div className="ei-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`ei-tab ${active ? "ei-tab--active" : ""}`}
            onClick={() => onChange(t.value)}
          >
            <span>{t.label}</span>
            {typeof t.count === "number" ? <span className="ei-tab__count">{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
