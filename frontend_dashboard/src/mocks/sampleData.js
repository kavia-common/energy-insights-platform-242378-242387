/**
 * Lightweight in-memory mock data used until backend contracts are integrated.
 * Keep schemas close to likely backend payloads (id, timestamps, severity, status).
 */

export const sampleSites = [
  {
    id: "site_101",
    name: "Harbor Plaza",
    account: "Oceanic Retail Group",
    city: "San Diego, CA",
    meters: 12,
    status: "Active",
    lastIngest: "2026-03-25T18:10:00Z",
  },
  {
    id: "site_102",
    name: "Seaside Distribution Center",
    account: "BlueWave Logistics",
    city: "Long Beach, CA",
    meters: 28,
    status: "Active",
    lastIngest: "2026-03-26T07:45:00Z",
  },
  {
    id: "site_103",
    name: "Cove Office Park",
    account: "North Shore Properties",
    city: "Irvine, CA",
    meters: 7,
    status: "Paused",
    lastIngest: "2026-03-20T12:00:00Z",
  },
];

export const sampleAlerts = [
  {
    id: "al_9001",
    createdAt: "2026-03-26T06:30:00Z",
    siteId: "site_102",
    siteName: "Seaside Distribution Center",
    type: "Spike",
    severity: "High",
    status: "Open",
    summary: "Overnight kWh spike vs baseline (+38%).",
    recommendation: "Check refrigeration schedules and loading bay lighting.",
  },
  {
    id: "al_9002",
    createdAt: "2026-03-25T15:10:00Z",
    siteId: "site_101",
    siteName: "Harbor Plaza",
    type: "Drift",
    severity: "Medium",
    status: "Acknowledged",
    summary: "Weekday baseload creeping upward (+9%).",
    recommendation: "Investigate HVAC setpoints; review tenant after-hours usage.",
  },
  {
    id: "al_9003",
    createdAt: "2026-03-24T09:25:00Z",
    siteId: "site_103",
    siteName: "Cove Office Park",
    type: "Missing data",
    severity: "Low",
    status: "Closed",
    summary: "Meter interval data delayed > 48h.",
    recommendation: "Verify data pipeline; confirm meter connectivity.",
  },
];

export const sampleAnomalies = [
  {
    id: "an_4001",
    detectedAt: "2026-03-26T06:15:00Z",
    siteId: "site_102",
    siteName: "Seaside Distribution Center",
    model: "Seasonal baseline v2",
    score: 0.92,
    category: "Consumption spike",
    window: "02:00–05:00",
    notes: "Largest deviation in last 30 days.",
  },
  {
    id: "an_4002",
    detectedAt: "2026-03-25T14:40:00Z",
    siteId: "site_101",
    siteName: "Harbor Plaza",
    model: "Baseload drift",
    score: 0.71,
    category: "Baseload drift",
    window: "Mon–Thu",
    notes: "Steady increase, check HVAC cycling.",
  },
];

export const sampleReports = [
  {
    id: "rp_2001",
    name: "Monthly Portfolio Summary",
    period: "Feb 2026",
    status: "Ready",
    generatedAt: "2026-03-01T08:00:00Z",
    description: "High-level KPIs, savings opportunities, and anomalies.",
  },
  {
    id: "rp_2002",
    name: "Site Benchmarking",
    period: "Q1 2026",
    status: "Draft",
    generatedAt: "2026-03-20T11:00:00Z",
    description: "Comparative intensity metrics across similar facilities.",
  },
];
