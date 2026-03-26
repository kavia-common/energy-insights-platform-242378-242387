import React from "react";
import { Navigate } from "react-router-dom";
import DashboardHome from "../pages/DashboardHome";
import AnomaliesPage from "../pages/AnomaliesPage";
import AlertsPage from "../pages/AlertsPage";
import AccountsSitesPage from "../pages/AccountsSitesPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";

/**
 * Route objects used by React Router.
 * Keeping them centralized makes the app easier to scale.
 */
export const routes = [
  { index: true, element: <DashboardHome /> },
  { path: "anomalies", element: <AnomaliesPage /> },
  { path: "alerts", element: <AlertsPage /> },
  { path: "accounts", element: <AccountsSitesPage /> },
  { path: "reports", element: <ReportsPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "*", element: <Navigate to="." replace /> },
];
