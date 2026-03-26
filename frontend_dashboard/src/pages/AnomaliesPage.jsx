import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { getErrorMessage, useAnomalies, useAnomalyActions } from "../backend_api/hooks";

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

  const { createAlert } = useAnomalyActions();

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

  const onCreateAlert = async () => {
    if (!selected) return;
    try {
      await createAlert.run(selected.id);

      // Close modal and refresh anomalies; optionally the backend may update anomaly state later.
      setSelected(null);
      anomaliesState.reload();
    } catch {
      // Inline error banner + Retry keeps modal open.
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Anomalies"
          subtitle="Model-detected deviations from expected consumption patterns."
          right={
            <div className="ei-row" style={{ gap: 10 }}>
              <Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Anomaly filters" />
              <button className="ei-btn ei-btn--ghost" type="button" onClick={() => anomaliesState.reload()}>
                Refresh
              </button>
            </div>
          }
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
              onRowClick={(row) => {
                createAlert.reset();
                setSelected(row);
              }}
              rowActions={(row) => (
                <button
                  className="ei-btn ei-btn--ghost"
                  type="button"
                  onClick={() => {
                    createAlert.reset();
                    setSelected(row);
                  }}
                >
                  View
                </button>
              )}
              emptyLabel={
                tab === "all"
                  ? "No anomalies detected yet."
                  : "No anomalies for this filter."
              }
            />
          </div>
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected ? `${selected.siteName} — ${selected.category}` : "Anomaly"}
        description={selected ? `Detected ${new Date(selected.detectedAt).toLocaleString()}` : undefined}
        onClose={() => {
          createAlert.reset();
          setSelected(null);
        }}
        footer={
          <div className="ei-modal__footerRow">
            <button
              className="ei-btn ei-btn--ghost"
              type="button"
              onClick={() => {
                createAlert.reset();
                setSelected(null);
              }}
              disabled={createAlert.isLoading}
            >
              Close
            </button>
            <button
              className="ei-btn ei-btn--primary"
              type="button"
              onClick={onCreateAlert}
              disabled={!selected || createAlert.isLoading}
              aria-disabled={!selected || createAlert.isLoading}
            >
              {createAlert.isLoading ? "Creating alert…" : "Create alert"}
            </button>
          </div>
        }
      >
        {createAlert.error ? (
          <div className="ei-inlineAlert" role="alert" style={{ marginBottom: 12 }}>
            <div className="ei-inlineAlert__text">{getErrorMessage(createAlert.error)}</div>
            <button
              className="ei-btn ei-btn--ghost"
              type="button"
              onClick={onCreateAlert}
              disabled={createAlert.isLoading}
            >
              Retry
            </button>
          </div>
        ) : null}

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
