import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { useSites } from "../backend_api/hooks";

function statusVariant(status) {
  if (status === "Active") return "success";
  if (status === "Paused") return "warning";
  return "neutral";
}

// PUBLIC_INTERFACE
export default function AccountsSitesPage() {
  /** Accounts/Sites management: searchable list + simple create/edit modal (mock or live). */
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const sitesState = useSites();
  const sites = sitesState.data || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sites;
    return sites.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.account.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    );
  }, [query, sites]);

  const columns = useMemo(
    () => [
      { key: "name", header: "Site" },
      { key: "account", header: "Account" },
      { key: "city", header: "Location", width: "180px" },
      { key: "meters", header: "Meters", width: "90px" },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge>,
      },
      {
        key: "lastIngest",
        header: "Last ingest",
        width: "170px",
        render: (r) => new Date(r.lastIngest).toLocaleString(),
      },
    ],
    []
  );

  return (
    <>
      <Card>
        <CardHeader
          title="Accounts & Sites"
          subtitle="Manage monitored sites, meter counts, and ingestion health."
          right={
            <div className="ei-row" style={{ gap: 10 }}>
              <div className="ei-inputWrap" role="search" aria-label="Search sites">
                <span aria-hidden="true">⌕</span>
                <input
                  className="ei-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by site, account, location…"
                />
              </div>
              <button className="ei-btn ei-btn--primary" type="button" onClick={() => setCreateOpen(true)}>
                Add site
              </button>
            </div>
          }
        />
        <CardBody>
          <ApiStateBanner
            isLoading={sitesState.isLoading}
            error={sitesState.error}
            label="Sites"
            onRetry={() => sitesState.reload()}
          />
          <div style={{ marginTop: 12 }}>
            <DataTable
              columns={columns}
              rows={filtered}
              isLoading={sitesState.isLoading}
              onRowClick={(row) => setSelected(row)}
              rowActions={(row) => (
                <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(row)}>
                  Manage
                </button>
              )}
              emptyLabel="No sites matched your search."
            />
          </div>
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected ? selected.name : "Site"}
        description={selected ? `${selected.account} • ${selected.city}` : undefined}
        onClose={() => setSelected(null)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setSelected(null)}>
              Close
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setSelected(null)}>
              Save changes (mock)
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
              <div className="ei-detailLabel">Meters</div>
              <div className="ei-detailValue">{selected.meters}</div>
            </div>
            <div className="ei-detailItem">
              <div className="ei-detailLabel">Last ingest</div>
              <div className="ei-detailValue">{new Date(selected.lastIngest).toLocaleString()}</div>
            </div>
            <div className="ei-detailItem ei-detailItem--full">
              <div className="ei-detailLabel">Notes</div>
              <div className="ei-detailValue" style={{ color: "var(--color-text-muted)" }}>
                Future: meters list, ingestion errors, baseline settings, contacts.
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={createOpen}
        title="Add a site"
        description="Create a new site record (mock UI; API integration comes next)."
        onClose={() => setCreateOpen(false)}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={() => setCreateOpen(false)}>
              Cancel
            </button>
            <button className="ei-btn ei-btn--primary" type="button" onClick={() => setCreateOpen(false)}>
              Create site (mock)
            </button>
          </div>
        }
      >
        <div className="ei-formGrid">
          <label className="ei-field">
            <span className="ei-field__label">Site name</span>
            <input className="ei-input" placeholder="e.g., Harbor Plaza" />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Account</span>
            <input className="ei-input" placeholder="e.g., Oceanic Retail Group" />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Location</span>
            <input className="ei-input" placeholder="City, State" />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Status</span>
            <select className="ei-input" defaultValue="Active">
              <option>Active</option>
              <option>Paused</option>
            </select>
          </label>
        </div>
        <div className="ei-muted" style={{ marginTop: 10 }}>
          This form is a placeholder. In the next step, it will POST to the backend.
        </div>
      </Modal>
    </>
  );
}
