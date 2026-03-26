import React from "react";
import { render, screen, within } from "@testing-library/react";
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
    // Scope assertions to the routed page content to avoid collisions with sidebar/topbar labels.
    const main = screen.getByRole("main");
    expect(within(main).getByText(/Portfolio snapshot/i)).toBeInTheDocument();
  });

  test("renders Anomalies route", () => {
    renderAt("/anomalies");
    // "Anomalies" also appears in the sidebar nav; assert within main content only.
    const main = screen.getByRole("main");
    expect(within(main).getByText(/^Anomalies$/i)).toBeInTheDocument();
  });

  test("renders Alerts route", () => {
    renderAt("/alerts");
    // "Alerts" also appears in the sidebar nav; assert within main content only.
    const main = screen.getByRole("main");
    expect(within(main).getByText(/^Alerts$/i)).toBeInTheDocument();
  });

  test("renders Accounts/Sites route", () => {
    renderAt("/accounts");
    const main = screen.getByRole("main");
    expect(within(main).getByText(/Accounts & Sites/i)).toBeInTheDocument();
  });

  test("renders Reports route", () => {
    renderAt("/reports");
    const main = screen.getByRole("main");
    expect(within(main).getByText(/Generated reports/i)).toBeInTheDocument();
  });

  test("renders Settings route", () => {
    renderAt("/settings");
    // Settings page has multiple cards; keep assertions scoped to main to avoid topbar actions.
    const main = screen.getByRole("main");
    expect(within(main).getByText(/^Profile$/i)).toBeInTheDocument();
    expect(within(main).getByText(/^Notifications$/i)).toBeInTheDocument();
  });
});
