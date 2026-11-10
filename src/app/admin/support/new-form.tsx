"use client";

import { useState } from "react";
import { createSupportService } from "./actions";

export function NewServiceForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        className="admin-btn admin-btn-primary admin-new-btn"
        onClick={() => setOpen(true)}
      >
        + Add service
      </button>
    );
  }

  return (
    <form action={createSupportService} className="admin-new-form">
      <div className="admin-new-form-row">
        <div>
          <label htmlFor="s-name">Name</label>
          <input id="s-name" name="name" required />
        </div>
        <div>
          <label htmlFor="s-type">Service type</label>
          <input
            id="s-type"
            name="service_type"
            required
            placeholder="counselling, crisis_line, clinic…"
          />
        </div>
        <div>
          <label htmlFor="s-region">Region</label>
          <input id="s-region" name="region" placeholder="Lilongwe" />
        </div>
      </div>
      <div className="admin-new-form-row">
        <div>
          <label htmlFor="s-phone">Phone</label>
          <input id="s-phone" name="phone" placeholder="+265..." />
        </div>
        <div>
          <label htmlFor="s-email">Email</label>
          <input id="s-email" name="email" type="email" />
        </div>
        <div>
          <label htmlFor="s-langs">Languages (comma)</label>
          <input
            id="s-langs"
            name="languages"
            defaultValue="en"
            placeholder="en, ny"
          />
        </div>
      </div>
      <div className="admin-new-form-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary">
          Create (unverified, inactive)
        </button>
      </div>
    </form>
  );
}