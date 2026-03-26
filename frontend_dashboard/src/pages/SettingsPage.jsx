import React from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings scaffold: profile + notifications (mock). */
  return (
    <div className="ei-grid ei-grid--twoCol">
      <Card className="ei-span-6">
        <CardHeader title="Profile" subtitle="User preferences and organization info." />
        <CardBody>
          <div className="ei-formGrid">
            <label className="ei-field">
              <span className="ei-field__label">Full name</span>
              <input className="ei-input" defaultValue="Alex Morgan" />
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Email</span>
              <input className="ei-input" defaultValue="alex@company.com" />
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Role</span>
              <input className="ei-input" defaultValue="Account Manager" />
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Timezone</span>
              <select className="ei-input" defaultValue="America/Los_Angeles">
                <option>America/Los_Angeles</option>
                <option>America/Denver</option>
                <option>America/Chicago</option>
                <option>America/New_York</option>
              </select>
            </label>
          </div>

          <div className="ei-row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
            <button className="ei-btn ei-btn--primary" type="button">
              Save (mock)
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="ei-span-6">
        <CardHeader title="Notifications" subtitle="Alert routing and digest preferences." />
        <CardBody>
          <div className="ei-formGrid">
            <label className="ei-field">
              <span className="ei-field__label">Severity threshold</span>
              <select className="ei-input" defaultValue="Medium">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Daily digest</span>
              <select className="ei-input" defaultValue="Enabled">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Delivery channel</span>
              <select className="ei-input" defaultValue="Email">
                <option>Email</option>
                <option>Slack (coming soon)</option>
              </select>
            </label>
            <label className="ei-field">
              <span className="ei-field__label">Escalation contact</span>
              <input className="ei-input" placeholder="name@company.com" />
            </label>
          </div>

          <div className="ei-row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
            <button className="ei-btn ei-btn--primary" type="button">
              Update (mock)
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
