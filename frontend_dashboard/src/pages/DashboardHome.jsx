import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import KpiTile from "../components/dashboard/KpiTile";
import ChartPlaceholder from "../components/charts/ChartPlaceholder";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import { sampleAlerts, sampleSites } from "../mocks/sampleData";

function severityVariant(sev) {
  if (sev === "High") return "danger";
  if (sev === "Medium") return "warning";
  return "info";
}

/**
 * Core dashboard landing page:
 * - KPI tiles
 * - Chart placeholders (no charting dependency yet)
 * - Recent alerts + ingestion health highlights
 */
// PUBLIC_INTERFACE
export default function DashboardHome() {
  const kpis = useMemo(() => {
    const openAlerts = sampleAlerts.filter((a) => a.status === "Open").length;
    const sitesMonitored = sampleSites.length;
    const delayed = sampleSites.filter((s) => Date.now() - new Date(s.lastIngest).getTime() > 1000 * 60 * 60 * 48).length;

    return { openAlerts, sitesMonitored, delayed };
  }, []);

  const recentAlerts = useMemo(() => {
    return [...sampleAlerts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title="Portfolio snapshot"
          subtitle="A quick view of monitored sites, active alerts, and key trends."
          right={
            <div className="ei-row" style={{ gap: 10 }}>
              <div className="ei-chip ei-chip--info">Ocean Professional</div>
              <div className="ei-chip">Mock data</div>
            </div>
          }
        />
        <CardBody>
          <div className="ei-grid ei-grid--kpis">
            <KpiTile
              label="Active alerts"
              value={kpis.openAlerts}
              helper="Open alerts requiring triage"
              trend={kpis.openAlerts > 0 ? "Needs attention" : "All clear"}
              tone={kpis.openAlerts > 0 ? "danger" : "success"}
            />
            <KpiTile
              label="Sites monitored"
              value={kpis.sitesMonitored}
              helper="Sites currently configured"
              trend="Tracking"
              tone="info"
            />
            <KpiTile
              label="Data delays"
              value={kpis.delayed}
              helper="Sites >48h since last ingest"
              trend={kpis.delayed > 0 ? "Investigate" : "Healthy"}
              tone={kpis.delayed > 0 ? "warning" : "success"}
            />
            <KpiTile
              label="Benchmark status"
              value="—"
              helper="Pending backend integration"
              trend="Coming soon"
              tone="neutral"
            />
          </div>
        </CardBody>
      </Card>

      <div className="ei-grid ei-grid--twoCol">
        <Card className="ei-span-7">
          <CardHeader
            title="Consumption trend"
            subtitle="kWh across the portfolio (placeholder)."
            right={<button className="ei-btn ei-btn--ghost" type="button">View details</button>}
          />
          <CardBody>
            <ChartPlaceholder
              title="Total consumption (kWh)"
              subtitle="Integrate charting + API data in step 01.03."
              height={260}
            />
          </CardBody>
        </Card>

        <Card className="ei-span-5">
          <CardHeader
            title="Peak demand"
            subtitle="Daily peak summary (placeholder)."
            right={<div className="ei-chip ei-chip--warn">Beta</div>}
          />
          <CardBody>
            <ChartPlaceholder
              title="Peak demand (kW)"
              subtitle="Placeholder: show top sites by peak."
              height={260}
            />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Recent alerts"
          subtitle="Latest anomaly alerts and triage status."
          right={<a className="ei-link" href="/alerts">Go to Alerts →</a>}
        />
        <CardBody>
          <DataTable
            columns={[
              { key: "createdAt", header: "Created", width: "170px", render: (r) => new Date(r.createdAt).toLocaleString() },
              { key: "siteName", header: "Site" },
              { key: "type", header: "Type", width: "130px" },
              {
                key: "severity",
                header: "Severity",
                width: "120px",
                render: (r) => <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge>,
              },
              { key: "status", header: "Status", width: "150px" },
              { key: "summary", header: "Summary" },
            ]}
            rows={recentAlerts}
            emptyLabel="No alerts yet."
          />
        </CardBody>
      </Card>
    </>
  );
}
