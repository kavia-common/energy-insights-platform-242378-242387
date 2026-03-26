import React from "react";

export default function AlertsPage() {
  return (
    <section className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>Alerts</div>
      <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
        This page will show anomaly alerts, severity, and triage actions.
      </div>
    </section>
  );
}
