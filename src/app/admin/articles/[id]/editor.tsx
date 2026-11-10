"use client";

import { useState } from "react";
import { updateArticle } from "../../actions";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string;
  language: string;
  content: any;
  published: boolean;
};

export function ArticleEditor({ article }: { article: Article }) {
  const [bodyText, setBodyText] = useState(
    JSON.stringify(article.content ?? {}, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await updateArticle(formData);
    } catch (e: any) {
      setError(e.message ?? "Could not save");
    }
  }

  return (
    <form action={handleSubmit} className="admin-editor">
      <div className="admin-editor-grid">
        <label>
          <span>Title</span>
          <input name="title" defaultValue={article.title} required />
        </label>
        <label>
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={article.slug}
            pattern="[a-z0-9-]+"
            required
          />
        </label>
        <label>
          <span>Category</span>
          <input name="category" defaultValue={article.category} required />
        </label>
        <label>
          <span>Language</span>
          <input
            name="language"
            defaultValue={article.language}
            disabled
          />
        </label>
      </div>

      <label className="admin-editor-summary">
        <span>Summary</span>
        <textarea
          name="summary"
          defaultValue={article.summary ?? ""}
          rows={3}
        />
      </label>

      <label className="admin-editor-body">
        <span>Body (JSON)</span>
        <small>
          Structured content — intro string, sections array. Invalid JSON will
          be rejected on save.
        </small>
        <textarea
          name="body"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={18}
          spellCheck={false}
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