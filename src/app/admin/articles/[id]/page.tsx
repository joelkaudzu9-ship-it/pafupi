import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { updateArticle, toggleArticlePublished } from "../../actions";
import { ArticleEditor } from "./editor";

type Params = Promise<{ id: string }>;

function EditorSkeleton() {
  return <p style={{ opacity: 0.4 }}>Loading editor…</p>;
}

async function EditorContent({ params }: { params: Params }) {
  await connection();
  const { id } = await params;

  const check = await requireAdmin();
  if (!check.ok) return null;

  const { data, error } = await check.supabase
    .from("articles")
    .select(
      "id, slug, title, summary, category, language, content, published"
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <>
      <div className="admin-editor-top">
        <Link href="/admin/articles" className="admin-back">
          ← All articles
        </Link>
        <div className="admin-editor-status">
          {data.published ? (
            <span className="admin-badge admin-badge-live">Published</span>
          ) : (
            <span className="admin-badge admin-badge-draft">Draft</span>
          )}
          <form action={toggleArticlePublished}>
            <input type="hidden" name="id" value={data.id} />
            <input
              type="hidden"
              name="next"
              value={(!data.published).toString()}
            />
            <button
              type="submit"
              className={`admin-btn ${
                data.published
                  ? "admin-btn-secondary"
                  : "admin-btn-primary"
              }`}
            >
              {data.published ? "Unpublish" : "Publish now"}
            </button>
          </form>
        </div>
      </div>

      <ArticleEditor article={data} />
    </>
  );
}

export default function AdminArticleEditPage({
  params,
}: {
  params: Params;
}) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorContent params={params} />
    </Suspense>
  );
}