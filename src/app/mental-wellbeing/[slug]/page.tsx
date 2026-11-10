import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isArticleContent, type WellbeingArticle } from "@/lib/content";
import "./article.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string): Promise<WellbeingArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, summary, category, language, content")
    .eq("slug", slug)
    .eq("language", "en")
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Unable to load article:", error.message);
    return null;
  }

  if (!data || !isArticleContent(data.content)) return null;
  return data as WellbeingArticle;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: "Resource not found | PAFUPI" };

  return {
    title: `${article.title} | PAFUPI`,
    description: article.summary,
  };
}

export default async function WellbeingArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const content = article.content;

  return (
    <main className="article-page">
      <div className="article-shell">
        <Link href="/mental-wellbeing#understanding" className="article-back-link">
          ← Back to mental wellbeing
        </Link>

        <header className="article-header">
          <span className="article-category">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="article-summary">{article.summary}</p>
        </header>

        <article className="article-body">
          <p className="article-introduction">{content.introduction}</p>

          {content.sections.map((section, index) => (
            <section className="article-section" key={`${section.heading}-${index}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {content.closing_note ? (
            <aside className="article-closing-note">{content.closing_note}</aside>
          ) : null}
        </article>

        <aside className="article-disclaimer">
          <strong>A note about this resource</strong>
          <p>
            This page provides general educational information. It cannot diagnose
            a condition or replace advice, assessment or treatment from a qualified
            health professional. If you are in immediate danger, seek urgent
            in-person help.
          </p>
        </aside>

        <div className="article-footer-link">
          <Link href="/mental-wellbeing#understanding">Explore more wellbeing resources →</Link>
        </div>
      </div>
    </main>
  );
}
