import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ChartPlaceholder from "../components/charts/ChartPlaceholder";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { getErrorMessage, useReportActions, useReports } from "../backend_api/hooks";

function statusVariant(status) {
  if (status === "Ready") return "success";
  if (status === "Draft") return "warning";
  return "neutral";
}

// PUBLIC_INTERFACE
export default function ReportsPage() {
  /** Reports hub: templates + generated reports list (mock or live). */
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [genType, setGenType] = useState("Monthly Portfolio Summary");
  const [genPeriod, setGenPeriod] = useState("");
  const [genFormat, setGenFormat] = useState("PDF");
  const [genIncludeAlerts, setGenIncludeAlerts] = useState("Yes");

  const reportsState = useReports();
  const reports = reportsState.data || [];

  const { generate } = useReportActions();

  const onSubmitGenerate = async () => {
    try {
      await generate.run({
        type: genType,
        period: genPeriod || undefined,
        format: genFormat,
        includeAlertDetails: genIncludeAlerts === "Yes",
      });

      setGenerateOpen(false);
      reportsState.reload();
    } catch {
      // keep modal open; error shown inline for retry.
    }
  };

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
      {
        key: "generatedAt",
        header: "Generated",
        width: "170px",
        render: (r) => (r.generatedAt ? new Date(r.generatedAt).toLocaleString() : "—"),
      },
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
              <div className="ei-row" style={{ gap: 10 }}>
                <button
                  className="ei-btn ei-btn--primary"
                  type="button"
                  onClick={() => {
                    generate.reset();
                    setGenerateOpen(true);
                  }}
                >
                  Generate report
                </button>
              </div>
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
        <CardHeader
          title="Generated reports"
          subtitle="Downloadable artifacts and drafts."
          right={
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => reportsState.reload()}>
              Refresh
            </button>
          }
        />
        <CardBody>
          <ApiStateBanner
            isLoading={reportsState.isLoading}
            error={reportsState.error}
            label="Reports"
            onRetry={() => reportsState.reload()}
          />
          <div style={{ marginTop: 12 }}>
            <DataTable
              columns={columns}
              rows={reports}
              isLoading={reportsState.isLoading}
              onRowClick={(row) => setSelected(row)}
              rowActions={(row) => (
                <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(row)}>
                  Open
                </button>
              )}
              emptyLabel="No reports yet. Generate your first report to create an artifact."
            />
          </div>
        </CardBody>
      </Card>

      <Modal
        open={generateOpen}
        title="Generate a report"
        description="Select report type and period."
        onClose={() => {
          generate.reset();
          setGenerateOpen(false);
        }}
        footer={
          <div className="ei-modal__footerRow">
            <button
              className="ei-btn ei-btn--ghost"
              type="button"
              onClick={() => {
                generate.reset();
                setGenerateOpen(false);
              }}
              disabled={generate.isLoading}
            >
              Cancel
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={onSubmitGenerate} disabled={generate.isLoading}>
              {generate.isLoading ? "Generating…" : "Generate"}
            </button>
          </div>
        }
      >
        {generate.error ? (
          <div className="ei-inlineAlert" role="alert" style={{ marginBottom: 12 }}>
            <div className="ei-inlineAlert__text">{getErrorMessage(generate.error)}</div>
            <button className="ei-btn ei-btn--ghost" type="button" onClick={onSubmitGenerate} disabled={generate.isLoading}>
              Retry
            </button>
          </div>
        ) : null}

        <div className="ei-formGrid">
          <label className="ei-field">
            <span className="ei-field__label">Report type</span>
            <select className="ei-input" value={genType} onChange={(e) => setGenType(e.target.value)} disabled={generate.isLoading}>
              <option>Monthly Portfolio Summary</option>
              <option>Site Benchmarking</option>
              <option>Alert Digest</option>
            </select>
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Period</span>
            <input
              className="ei-input"
              value={genPeriod}
              onChange={(e) => setGenPeriod(e.target.value)}
              placeholder="e.g., Feb 2026 or Q1 2026"
              disabled={generate.isLoading}
            />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Format</span>
            <select className="ei-input" value={genFormat} onChange={(e) => setGenFormat(e.target.value)} disabled={generate.isLoading}>
              <option>PDF</option>
              <option>HTML</option>
              <option>CSV</option>
            </select>
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Include alert details</span>
            <select
              className="ei-input"
              value={genIncludeAlerts}
              onChange={(e) => setGenIncludeAlerts(e.target.value)}
              disabled={generate.isLoading}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
        </div>
        <div className="ei-muted" style={{ marginTop: 10 }}>
          If no backend is configured, this runs in mock mode (controlled by REACT_APP_FEATURE_FLAGS / API base URL).
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
              <div className="ei-detailValue">{selected.generatedAt ? new Date(selected.generatedAt).toLocaleString() : "—"}</div>
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
