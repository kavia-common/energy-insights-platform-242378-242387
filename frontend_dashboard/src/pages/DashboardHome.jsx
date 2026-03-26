import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import KpiTile from "../components/dashboard/KpiTile";
import ChartPlaceholder from "../components/charts/ChartPlaceholder";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { useAlerts, useSites } from "../backend_api/hooks";
import { getBackendConfig } from "../backend_api/config";

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
  const cfg = getBackendConfig();

  const sitesState = useSites();
  const alertsState = useAlerts();

  const sites = sitesState.data || [];
  const alerts = alertsState.data || [];

  const kpis = useMemo(() => {
    const openAlerts = alerts.filter((a) => a.status === "Open").length;
    const sitesMonitored = sites.length;
    const delayed = sites.filter(
      (s) => Date.now() - new Date(s.lastIngest).getTime() > 1000 * 60 * 60 * 48
    ).length;

    return { openAlerts, sitesMonitored, delayed };
  }, [alerts, sites]);

  const recentAlerts = useMemo(() => {
    return [...alerts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [alerts]);

  return (
    <>
      <Card>
        <CardHeader
          title="Portfolio snapshot"
          subtitle="A quick view of monitored sites, active alerts, and key trends."
          right={
            <div className="ei-row" style={{ gap: 10 }}>
              <div className="ei-chip ei-chip--info">Ocean Professional</div>
              <div className="ei-chip">{cfg.useMock ? "Mock data" : "Live data"}</div>
            </div>
          }
        />
        <CardBody>
          <ApiStateBanner
            isLoading={sitesState.isLoading || alertsState.isLoading}
            error={sitesState.error || alertsState.error}
            label="Dashboard data"
            onRetry={() => {
              sitesState.reload();
              alertsState.reload();
            }}
          />

          <div className="ei-grid ei-grid--kpis" style={{ marginTop: 12 }}>
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
            right={
              <button className="ei-btn ei-btn--ghost" type="button">
                View details
              </button>
            }
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
          right={
            <a className="ei-link" href="/alerts">
              Go to Alerts →
            </a>
          }
        />
        <CardBody>
          <DataTable
            columns={[
              {
                key: "createdAt",
                header: "Created",
                width: "170px",
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
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
            isLoading={alertsState.isLoading}
          />
        </CardBody>
      </Card>
    </>
  );
}
