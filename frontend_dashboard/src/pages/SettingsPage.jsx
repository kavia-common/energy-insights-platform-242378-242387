import React from "react";

export default function SettingsPage() {
  return (
    <section className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>Settings</div>
      <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
        This page will contain profile, organization, and notification settings.
      </div>
    </section>
  );
}
