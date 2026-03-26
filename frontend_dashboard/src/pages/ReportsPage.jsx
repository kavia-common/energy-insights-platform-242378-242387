import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ChartPlaceholder from "../components/charts/ChartPlaceholder";
import { sampleReports } from "../mocks/sampleData";

function statusVariant(status) {
  if (status === "Ready") return "success";
  if (status === "Draft") return "warning";
  return "neutral";
}

// PUBLIC_INTERFACE
export default function ReportsPage() {
  /** Reports hub: templates + generated reports list (mock). */
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const columns = useMemo(
    () => [
      { key: "name", header: "Report" },
      { key: "period", header: "Period", width: "130px" },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge>,
      },
      { key: "generatedAt", header: "Generated", width: "170px", render: (r) => new Date(r.generatedAt).toLocaleString() },
      { key: "description", header: "Description" },
    ],
    []
  );

  return (
    <>
      <div className="ei-grid ei-grid--twoCol">
        <Card className="ei-span-6">
          <CardHeader
            title="Report templates"
            subtitle="Generate common views for stakeholders."
            right={
              <button className="ei-btn ei-btn--primary" type="button" onClick={() => setGenerateOpen(true)}>
                Generate report
              </button>
            }
          />
          <CardBody>
            <div className="ei-templateList">
              <div className="ei-template">
                <div className="ei-template__title">Monthly Portfolio Summary</div>
                <div className="ei-template__desc">KPIs, anomalies, and key savings opportunities.</div>
              </div>
              <div className="ei-template">
                <div className="ei-template__title">Site Benchmarking</div>
                <div className="ei-template__desc">Compare energy intensity across similar site cohorts.</div>
              </div>
              <div className="ei-template">
                <div className="ei-template__title">Alert Digest</div>
                <div className="ei-template__desc">Triage-ready list of open items, grouped by severity.</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="ei-span-6">
          <CardHeader title="Preview" subtitle="Placeholder preview panel until report rendering is wired." />
          <CardBody>
            <ChartPlaceholder title="Report preview" subtitle="Render PDF/HTML previews in a later step." height={260} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Generated reports" subtitle="Downloadable artifacts and drafts." />
        <CardBody>
          <DataTable
            columns={columns}
            rows={sampleReports}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(row)}>
                Open
              </button>
            )}
            emptyLabel="No reports yet."
          />
        </CardBody>
      </Card>

      <Modal
        open={generateOpen}
        title="Generate a report"
        description="Select report type and period (mock UI)."
        onClose={() => setGenerateOpen(false)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setGenerateOpen(false)}>
              Cancel
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setGenerateOpen(false)}>
              Generate (mock)
            </button>
          </div>
        }
      >
        <div className="ei-formGrid">
          <label className="ei-field">
            <span className="ei-field__label">Report type</span>
            <select className="ei-input" defaultValue="Monthly Portfolio Summary">
              <option>Monthly Portfolio Summary</option>
              <option>Site Benchmarking</option>
              <option>Alert Digest</option>
            </select>
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Period</span>
            <input className="ei-input" placeholder="e.g., Feb 2026 or Q1 2026" />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Format</span>
            <select className="ei-input" defaultValue="PDF">
              <option>PDF</option>
              <option>HTML</option>
              <option>CSV</option>
            </select>
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Include alert details</span>
            <select className="ei-input" defaultValue="Yes">
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
        </div>
        <div className="ei-muted" style={{ marginTop: 10 }}>
          Next step: call backend report generation endpoint and poll status.
        </div>
      </Modal>

      <Modal
        open={Boolean(selected)}
        title={selected ? selected.name : "Report"}
        description={selected ? `${selected.period} • ${selected.status}` : undefined}
        onClose={() => setSelected(null)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(null)}>
              Close
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setSelected(null)}>
              Download (mock)
            </button>
          </div>
        }
      >
        {selected ? (
          <div className="ei-detailGrid">
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Status</div>
              <div className="ei-detailValue">
                <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
              </div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Generated</div>
              <div className="ei-detailValue">{new Date(selected.generatedAt).toLocaleString()}</div>
            </div>
            <div className="ei-detailItem ei-detailItem--full">
              <div className="ei-detailLabel">Description</div>
              <div className="ei-detailValue">{selected.description}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
