import React from "react";
import Badge from "../ui/Badge";

// PUBLIC_INTERFACE
export default function KpiTile({ label, value, helper, trend, tone = "neutral" }) {
  /** Compact KPI tile with optional trend badge and helper text. */
  return (
    <div className="ei-kpi">
      <div className="ei-kpi__top">
        <div className="ei-kpi__label">{label}</div>
        {trend ? <Badge variant={tone}>{trend}</Badge> : null}
      </div>
      <div className="ei-kpi__value">{value}</div>
      {helper ? <div className="ei-kpi__helper">{helper}</div> : null}
    </div>
  );
}
