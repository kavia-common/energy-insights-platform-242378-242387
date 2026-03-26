import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import { routes } from "./app/routes";

/**
 * UI smoke tests:
 * - Ensure AppShell renders stable, global UI
 * - Ensure core routes mount without crashing (basic text assertions per page)
 *
 * Note: We use MemoryRouter to deterministically test navigation in Jest/JSDOM.
 */

function renderAt(pathname) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {routes.map((r) =>
            r.index ? (
              <Route key="index" index element={r.element} />
            ) : (
              <Route key={r.path} path={r.path} element={r.element} />
            )
          )}
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AppShell + core routes (smoke)", () => {
  test("renders global shell chrome (brand + search + actions)", () => {
    renderAt("/");

    // Brand block
    expect(screen.getByLabelText(/Energy Insights Platform/i)).toBeInTheDocument();

    // Topbar search
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();

    // Topbar actions
    expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create report/i })).toBeInTheDocument();
  });

  test("renders Dashboard route", () => {
    renderAt("/");
    expect(screen.getByText(/Portfolio snapshot/i)).toBeInTheDocument();
  });

  test("renders Anomalies route", () => {
    renderAt("/anomalies");
    expect(screen.getByText(/Anomalies/i)).toBeInTheDocument();
  });

  test("renders Alerts route", () => {
    renderAt("/alerts");
    expect(screen.getByText(/^Alerts$/i)).toBeInTheDocument();
  });

  test("renders Accounts/Sites route", () => {
    renderAt("/accounts");
    expect(screen.getByText(/Accounts & Sites/i)).toBeInTheDocument();
  });

  test("renders Reports route", () => {
    renderAt("/reports");
    expect(screen.getByText(/Generated reports/i)).toBeInTheDocument();
  });

  test("renders Settings route", () => {
    renderAt("/settings");
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });
});
