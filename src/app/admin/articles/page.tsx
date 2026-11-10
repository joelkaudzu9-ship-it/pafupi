import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { toggleArticlePublished } from "../actions";
import { NewArticleForm } from "./new-form";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string;
  language: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

function ArticlesSkeleton() {
  return <p style={{ opacity: 0.4 }}>Loading articles…</p>;
}

async function ArticlesList() {
  await connection();
  const check = await requireAdmin();
  if (!check.ok) return null;

  const { data } = await check.supabase
    .from("articles")
    .select(
      "id, slug, title, summary, category, language, published, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  const articles = (data ?? []) as Article[];

  return (
    <>
      <NewArticleForm />

      {articles.length === 0 ? (
        <p className="admin-empty">No articles yet. Create one above.</p>
      ) : (
        <ul className="admin-articles">
          {articles.map((a) => (
            <li key={a.id} className="admin-article-row">
              <div className="admin-article-main">
                <div className="admin-article-meta">
                  <span className="admin-badge">{a.category}</span>
                  {a.published ? (
                    <span className="admin-badge admin-badge-live">
                      Published
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge-draft">
                      Draft
                    </span>
                  )}
                  <span className="admin-article-slug">/{a.slug}</span>
                </div>
                <h3>{a.title}</h3>
                {a.summary && <p>{a.summary}</p>}
              </div>
              <div className="admin-article-actions">
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="admin-btn admin-btn-secondary"
                >
                  Edit
                </Link>
                <form action={toggleArticlePublished}>
                  <input type="hidden" name="id" value={a.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={(!a.published).toString()}
                  />
                  <button
                    type="submit"
                    className={`admin-btn ${
                      a.published
                        ? "admin-btn-secondary"
                        : "admin-btn-primary"
                    }`}
                  >
                    {a.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AdminArticlesPage() {
  return (
    <>
      <p className="admin-intro">
        Create and publish wellbeing articles. Draft articles are invisible on
        the public site.
      </p>
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesList />
      </Suspense>
    </>
  );
}