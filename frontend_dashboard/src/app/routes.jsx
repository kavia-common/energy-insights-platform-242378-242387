import React from "react";
import { Navigate } from "react-router-dom";
import DashboardHome from "../pages/DashboardHome";
import AlertsPage from "../pages/AlertsPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";

/**
 * Route objects used by React Router.
 * Keeping them centralized makes the app easier to scale.
 */
export const routes = [
  { index: true, element: <DashboardHome /> },
  { path: "alerts", element: <AlertsPage /> },
  { path: "reports", element: <ReportsPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "*", element: <Navigate to="." replace /> },
];
