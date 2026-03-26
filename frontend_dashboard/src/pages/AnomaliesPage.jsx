import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { useAnomalies } from "../backend_api/hooks";

function scoreTone(score) {
  if (score >= 0.85) return "danger";
  if (score >= 0.7) return "warning";
  return "info";
}

function formatScore(score) {
  return `${Math.round(score * 100)}%`;
}

// PUBLIC_INTERFACE
export default function AnomaliesPage() {
  /** Anomalies triage view: filter + list + details modal. */
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);

  const anomaliesState = useAnomalies();
  const anomalies = anomaliesState.data || [];

  const rows = useMemo(() => {
    if (tab === "high") return anomalies.filter((a) => a.score >= 0.85);
    if (tab === "watch") return anomalies.filter((a) => a.score >= 0.7 && a.score < 0.85);
    return anomalies;
  }, [tab, anomalies]);

  const tabs = useMemo(
    () => [
      { value: "all", label: "All", count: anomalies.length },
      { value: "high", label: "High", count: anomalies.filter((a) => a.score >= 0.85).length },
      {
        value: "watch",
        label: "Watch",
        count: anomalies.filter((a) => a.score >= 0.7 && a.score < 0.85).length,
      },
    ],
    [anomalies]
  );

  const columns = useMemo(
    () => [
      {
        key: "detectedAt",
        header: "Detected",
        width: "170px",
        render: (r) => new Date(r.detectedAt).toLocaleString(),
      },
      { key: "siteName", header: "Site" },
      { key: "category", header: "Category" },
      {
        key: "score",
        header: "Score",
        width: "130px",
        render: (r) => <Badge variant={scoreTone(r.score)}>{formatScore(r.score)}</Badge>,
      },
      { key: "window", header: "Window", width: "140px" },
    ],
    []
  );

  return (
    <>
      <Card>
        <CardHeader
          title="Anomalies"
          subtitle="Model-detected deviations from expected consumption patterns."
          right={<Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Anomaly filters" />}
        />
        <CardBody>
          <ApiStateBanner
            isLoading={anomaliesState.isLoading}
            error={anomaliesState.error}
            label="Anomalies"
            onRetry={() => anomaliesState.reload()}
          />
          <div style={{ marginTop: 12 }}>
            <DataTable
              columns={columns}
              rows={rows}
              isLoading={anomaliesState.isLoading}
              onRowClick={(row) => setSelected(row)}
              rowActions={(row) => (
                <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(row)}>
                  View
                </button>
              )}
              emptyLabel="No anomalies for this filter."
            />
          </div>
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected ? `${selected.siteName} — ${selected.category}` : "Anomaly"}
        description={selected ? `Detected ${new Date(selected.detectedAt).toLocaleString()}` : undefined}
        onClose={() => setSelected(null)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(null)}>
              Close
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setSelected(null)}>
              Create alert (mock)
            </button>
          </div>
        }
      >
        {selected ? (
          <div className="ei-detailGrid">
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Model</div>
              <div className="ei-detailValue">{selected.model}</div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Score</div>
              <div className="ei-detailValue">
                <Badge variant={scoreTone(selected.score)}>{formatScore(selected.score)}</Badge>
              </div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Window</div>
              <div className="ei-detailValue">{selected.window}</div>
            </div>
            <div className="ei-detailItem ei-detailItem--full">
              <div className="ei-detailLabel">Notes</div>
              <div className="ei-detailValue">{selected.notes}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
