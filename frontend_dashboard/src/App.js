import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import { routes } from "./app/routes";

/**
 * Application root: sets up client-side routing.
 * UI shell (sidebar/topbar) lives in AppShell and wraps routed content.
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
