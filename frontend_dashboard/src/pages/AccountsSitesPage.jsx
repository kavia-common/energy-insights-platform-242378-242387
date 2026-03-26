import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ApiStateBanner from "../components/ui/ApiStateBanner";
import { getErrorMessage, useSiteActions, useSites } from "../backend_api/hooks";

function statusVariant(status) {
  if (status === "Active") return "success";
  if (status === "Paused") return "warning";
  return "neutral";
}

function isBlank(v) {
  return !v || !String(v).trim();
}

// PUBLIC_INTERFACE
export default function AccountsSitesPage() {
  /** Accounts/Sites management: searchable list + create/edit modals (mock or live). */
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const sitesState = useSites();
  const sites = sitesState.data || [];

  const { create, update } = useSiteActions();
  const actionBusy = create.isLoading || update.isLoading;

  // Create form state
  const [cName, setCName] = useState("");
  const [cAccount, setCAccount] = useState("");
  const [cCity, setCCity] = useState("");
  const [cStatus, setCStatus] = useState("Active");

  // Edit form state (only for fields this UI supports)
  const [eName, setEName] = useState("");
  const [eAccount, setEAccount] = useState("");
  const [eCity, setECity] = useState("");
  const [eStatus, setEStatus] = useState("Active");

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
        render: (r) => (r.lastIngest ? new Date(r.lastIngest).toLocaleString() : "—"),
      },
    ],
    []
  );

  const openEdit = (row) => {
    setSelected(row);
    setEName(row?.name || "");
    setEAccount(row?.account || "");
    setECity(row?.city || "");
    setEStatus(row?.status || "Active");
    update.reset();
  };

  const closeEdit = () => {
    update.reset();
    setSelected(null);
  };

  const closeCreate = () => {
    create.reset();
    setCreateOpen(false);
  };

  const canSubmitCreate = !isBlank(cName) && !isBlank(cAccount) && !isBlank(cCity);

  const onSubmitCreate = async () => {
    if (!canSubmitCreate) return;
    try {
      await create.run({
        name: cName.trim(),
        account: cAccount.trim(),
        city: cCity.trim(),
        status: cStatus,
      });

      // Clear form and refresh list so UI matches backend.
      setCName("");
      setCAccount("");
      setCCity("");
      setCStatus("Active");

      setCreateOpen(false);
      sitesState.reload();
    } catch {
      // Error shown inline; modal stays open for retry.
    }
  };

  const onSubmitEdit = async () => {
    if (!selected) return;
    if (isBlank(eName) || isBlank(eAccount) || isBlank(eCity)) return;

    try {
      await update.run({
        siteId: selected.id,
        patch: {
          name: eName.trim(),
          account: eAccount.trim(),
          city: eCity.trim(),
          status: eStatus,
        },
      });

      setSelected(null);
      sitesState.reload();
    } catch {
      // Error shown inline; modal stays open for retry.
    }
  };

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
              <button
                className="ei-btn ei-btn--primary"
                type="button"
                onClick={() => {
                  create.reset();
                  setCreateOpen(true);
                }}
              >
                Add site
              </button>
              <button className="ei-btn ei-btn--ghost" type="button" onClick={() => sitesState.reload()}>
                Refresh
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
              onRowClick={(row) => openEdit(row)}
              rowActions={(row) => (
                <button className="ei-btn ei-btn--ghost" type="button" onClick={() => openEdit(row)}>
                  Edit
                </button>
              )}
              emptyLabel={
                query.trim()
                  ? "No sites matched your search."
                  : "No sites yet. Create your first site to start monitoring."
              }
            />
          </div>
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected ? selected.name : "Site"}
        description={selected ? `${selected.account} • ${selected.city}` : undefined}
        onClose={closeEdit}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={closeEdit} disabled={actionBusy}>
              Close
            </button>
            <button
              className="ei-btn ei-btn--primary"
              type="button"
              onClick={onSubmitEdit}
              disabled={
                actionBusy || !selected || isBlank(eName) || isBlank(eAccount) || isBlank(eCity)
              }
            >
              {update.isLoading ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      >
        {update.error ? (
          <div className="ei-inlineAlert" role="alert" style={{ marginBottom: 12 }}>
            <div className="ei-inlineAlert__text">{getErrorMessage(update.error)}</div>
            <button
              className="ei-btn ei-btn--ghost"
              type="button"
              onClick={onSubmitEdit}
              disabled={update.isLoading}
            >
              Retry
            </button>
          </div>
        ) : null}

        {selected ? (
          <>
            <div className="ei-formGrid">
              <label className="ei-field">
                <span className="ei-field__label">Site name</span>
                <input
                  className="ei-input"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                  disabled={actionBusy}
                />
              </label>
              <label className="ei-field">
                <span className="ei-field__label">Account</span>
                <input
                  className="ei-input"
                  value={eAccount}
                  onChange={(e) => setEAccount(e.target.value)}
                  disabled={actionBusy}
                />
              </label>
              <label className="ei-field">
                <span className="ei-field__label">Location</span>
                <input
                  className="ei-input"
                  value={eCity}
                  onChange={(e) => setECity(e.target.value)}
                  disabled={actionBusy}
                />
              </label>
              <label className="ei-field">
                <span className="ei-field__label">Status</span>
                <select
                  className="ei-input"
                  value={eStatus}
                  onChange={(e) => setEStatus(e.target.value)}
                  disabled={actionBusy}
                >
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>
            </div>

            <div className="ei-detailGrid" style={{ marginTop: 12 }}>
              <div className="ei-detailItem">
                <div className="ei-detailLabel">Meters</div>
                <div className="ei-detailValue">{selected.meters ?? "—"}</div>
              </div>
              <div className="ei-detailItem">
                <div className="ei-detailLabel">Last ingest</div>
                <div className="ei-detailValue">
                  {selected.lastIngest ? new Date(selected.lastIngest).toLocaleString() : "—"}
                </div>
              </div>
              <div className="ei-detailItem ei-detailItem--full">
                <div className="ei-detailLabel">Notes</div>
                <div className="ei-detailValue" style={{ color: "var(--color-text-muted)" }}>
                  This page wires create/edit actions through the backend adapter (REST or mock). Backend
                  can ignore extra fields until fully implemented.
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        open={createOpen}
        title="Add a site"
        description="Create a new site record."
        onClose={closeCreate}
        footer={
          <div className="ei-modal__footerRow">
            <button className="ei-btn ei-btn--ghost" type="button" onClick={closeCreate} disabled={actionBusy}>
              Cancel
            </button>
            <button
              className="ei-btn ei-btn--primary"
              type="button"
              onClick={onSubmitCreate}
              disabled={actionBusy || !canSubmitCreate}
            >
              {create.isLoading ? "Creating…" : "Create site"}
            </button>
          </div>
        }
      >
        {create.error ? (
          <div className="ei-inlineAlert" role="alert" style={{ marginBottom: 12 }}>
            <div className="ei-inlineAlert__text">{getErrorMessage(create.error)}</div>
            <button
              className="ei-btn ei-btn--ghost"
              type="button"
              onClick={onSubmitCreate}
              disabled={create.isLoading}
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="ei-formGrid">
          <label className="ei-field">
            <span className="ei-field__label">Site name</span>
            <input
              className="ei-input"
              placeholder="e.g., Harbor Plaza"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              disabled={actionBusy}
            />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Account</span>
            <input
              className="ei-input"
              placeholder="e.g., Oceanic Retail Group"
              value={cAccount}
              onChange={(e) => setCAccount(e.target.value)}
              disabled={actionBusy}
            />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Location</span>
            <input
              className="ei-input"
              placeholder="City, State"
              value={cCity}
              onChange={(e) => setCCity(e.target.value)}
              disabled={actionBusy}
            />
          </label>
          <label className="ei-field">
            <span className="ei-field__label">Status</span>
            <select className="ei-input" value={cStatus} onChange={(e) => setCStatus(e.target.value)} disabled={actionBusy}>
              <option>Active</option>
              <option>Paused</option>
            </select>
          </label>
        </div>

        <div className="ei-muted" style={{ marginTop: 10 }}>
          If no backend is configured, this runs in mock mode (controlled by REACT_APP_FEATURE_FLAGS / API base URL).
        </div>
      </Modal>
    </>
  );
}
