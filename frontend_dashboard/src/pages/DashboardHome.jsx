import React from "react";

/**
 * Baseline dashboard landing page (placeholder).
 * Future steps will replace these cards with real analytics and visualizations.
 */
export default function DashboardHome() {
  return (
    <>
      <section className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              Portfolio snapshot
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
              Commercial Energy Overview
            </div>
            <div style={{ marginTop: 6, color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              UI shell is ready. Next steps will connect insights, anomaly detection, and alert streams.
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: 12,
              borderRadius: "var(--radius-md)",
              background: "rgba(37, 99, 235, 0.08)",
              borderColor: "rgba(37, 99, 235, 0.18)",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              Status
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              Theme + Routing OK
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 16,
        }}
      >
        <div className="card" style={{ gridColumn: "span 4", padding: 16, minHeight: 120 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            Active alerts
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>
            —
          </div>
          <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
            Connect backend to populate.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 4", padding: 16, minHeight: 120 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            Sites monitored
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>
            —
          </div>
          <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
            Coming with account management.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 4", padding: 16, minHeight: 120 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            Data freshness
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>
            —
          </div>
          <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
            To be shown per meter ingestion.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 12", padding: 16, minHeight: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Consumption trend
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>
                Placeholder chart region
              </div>
            </div>
            <div style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
              Next: integrate charting + data fetching scaffold
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              height: 140,
              borderRadius: "var(--radius-md)",
              border: "1px dashed rgba(17, 24, 39, 0.20)",
              background: "linear-gradient(180deg, rgba(245, 158, 11, 0.10), rgba(255,255,255,0))",
            }}
            aria-label="Chart placeholder"
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          section[style*="grid-template-columns"] > .card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </>
  );
}
