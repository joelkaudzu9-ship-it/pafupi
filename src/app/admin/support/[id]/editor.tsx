"use client";

import { useState } from "react";
import { updateSupportService } from "../actions";

type Service = {
  id: string;
  name: string;
  service_type: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  region: string | null;
  hours: string | null;
  languages: string[] | null;
};

export function ServiceEditor({ service }: { service: Service }) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await updateSupportService(formData);
    } catch (e: any) {
      setError(e.message ?? "Could not save");
    }
  }

  return (
    <form action={handleSubmit} className="admin-editor">
      <input type="hidden" name="id" value={service.id} />
      <div className="admin-editor-grid">
        <label>
          <span>Name</span>
          <input name="name" defaultValue={service.name} required />
        </label>
        <label>
          <span>Service type</span>
          <input
            name="service_type"
            defaultValue={service.service_type}
            required
          />
        </label>
        <label>
          <span>Region</span>
          <input name="region" defaultValue={service.region ?? ""} />
        </label>
        <label>
          <span>Languages (comma-separated)</span>
          <input
            name="languages"
            defaultValue={(service.languages ?? ["en"]).join(", ")}
          />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" defaultValue={service.phone ?? ""} />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            defaultValue={service.email ?? ""}
          />
        </label>
        <label>
          <span>Website</span>
          <input
            name="website"
            type="url"
            defaultValue={service.website ?? ""}
            placeholder="https://"
          />
        </label>
        <label>
          <span>Hours</span>
          <input
            name="hours"
            defaultValue={service.hours ?? ""}
            placeholder="Mon–Fri, 08:00–17:00"
          />
        </label>
      </div>

      <label className="admin-editor-summary" style={{ marginBottom: 16 }}>
        <span>Address</span>
        <textarea
          name="address"
          defaultValue={service.address ?? ""}
          rows={2}
        />
      </label>

      <label className="admin-editor-summary">
        <span>Description</span>
        <textarea
          name="description"
          defaultValue={service.description ?? ""}
          rows={4}
        />
      </label>

      {error && <p className="admin-editor-error">{error}</p>}

      <div className="admin-editor-actions">
        <button type="submit" className="admin-btn admin-btn-primary">
          Save changes
        </button>
      </div>
    </form>
  );
}