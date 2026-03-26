import React from "react";

export default function ReportsPage() {
  return (
    <section className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>Reports</div>
      <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
        This page will host benchmarking reports and downloadable summaries.
      </div>
    </section>
  );
}
