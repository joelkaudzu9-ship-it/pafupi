"use client";

import { useState } from "react";
import { createArticle } from "../actions";

export function NewArticleForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        className="admin-btn admin-btn-primary admin-new-btn"
        onClick={() => setOpen(true)}
      >
        + New article
      </button>
    );
  }

  return (
    <form action={createArticle} className="admin-new-form">
      <div className="admin-new-form-row">
        <div>
          <label htmlFor="new-title">Title</label>
          <input id="new-title" name="title" required />
        </div>
        <div>
          <label htmlFor="new-slug">Slug</label>
          <input
            id="new-slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, hyphens only"
            placeholder="understanding-stress"
          />
        </div>
        <div>
          <label htmlFor="new-category">Category</label>
          <input
            id="new-category"
            name="category"
            defaultValue="MOOD"
            required
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
          Create draft
        </button>
      </div>
    </form>
  );
}