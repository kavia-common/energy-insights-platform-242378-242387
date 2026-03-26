import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { sampleAlerts } from "../mocks/sampleData";

function severityVariant(sev) {
  if (sev === "High") return "danger";
  if (sev === "Medium") return "warning";
  return "info";
}

function statusVariant(status) {
  if (status === "Open") return "danger";
  if (status === "Acknowledged") return "warning";
  if (status === "Closed") return "success";
  return "neutral";
}

// PUBLIC_INTERFACE
export default function AlertsPage() {
  /** Alerts triage view: filter + list + details modal (mock). */
  const [tab, setTab] = useState("open");
  const [selected, setSelected] = useState(null);

  const tabs = useMemo(
    () => [
      { value: "open", label: "Open", count: sampleAlerts.filter((a) => a.status === "Open").length },
      { value: "ack", label: "Acknowledged", count: sampleAlerts.filter((a) => a.status === "Acknowledged").length },
      { value: "closed", label: "Closed", count: sampleAlerts.filter((a) => a.status === "Closed").length },
      { value: "all", label: "All", count: sampleAlerts.length },
    ],
    []
  );

  const rows = useMemo(() => {
    if (tab === "open") return sampleAlerts.filter((a) => a.status === "Open");
    if (tab === "ack") return sampleAlerts.filter((a) => a.status === "Acknowledged");
    if (tab === "closed") return sampleAlerts.filter((a) => a.status === "Closed");
    return sampleAlerts;
  }, [tab]);

  const columns = useMemo(
    () => [
      { key: "createdAt", header: "Created", width: "170px", render: (r) => new Date(r.createdAt).toLocaleString() },
      { key: "siteName", header: "Site" },
      { key: "type", header: "Type", width: "130px" },
      {
        key: "severity",
        header: "Severity",
        width: "120px",
        render: (r) => <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge>,
      },
      {
        key: "status",
        header: "Status",
        width: "150px",
        render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge>,
      },
      { key: "summary", header: "Summary" },
    ],
    []
  );

  return (
    <>
      <Card>
        <CardHeader
          title="Alerts"
          subtitle="Actionable notifications derived from anomaly detection and rule checks."
          right={<Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Alert filters" />}
        />
        <CardBody>
          <DataTable
            columns={columns}
            rows={rows}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(row)}>
                Triage
              </button>
            )}
            emptyLabel="No alerts for this filter."
          />
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected ? `${selected.siteName} — ${selected.type}` : "Alert"}
        description={selected ? selected.summary : undefined}
        onClose={() => setSelected(null)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(null)}>
              Close
            </button>
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(null)}>
              Acknowledge (mock)
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setSelected(null)}>
              Create report (mock)
            </button>
          </div>
        }
      >
        {selected ? (
          <div className="ei-detailGrid">
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Severity</div>
              <div className="ei-detailValue">
                <Badge variant={severityVariant(selected.severity)}>{selected.severity}</Badge>
              </div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Status</div>
              <div className="ei-detailValue">
                <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
              </div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Created</div>
              <div className="ei-detailValue">{new Date(selected.createdAt).toLocaleString()}</div>
            </div>
            <div className="ei-detailItem ei-detailItem--full">
              <div className="ei-detailLabel">Recommendation</div>
              <div className="ei-detailValue">{selected.recommendation}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
