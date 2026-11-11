import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { io } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { WellbeingArticle } from "@/lib/content";
import PageLoader from "@/components/ui/page-loader";
import "./wellbeing.css";

export const metadata: Metadata = {
  title: "Mental Wellbeing",
  description:
    "Explore mental wellbeing, understand your feelings and discover practical ways to care for yourself.",
};

const pathways = [
  {
    number: "01",
    title: "Understand your feelings",
    description:
      "Learn about depression, anxiety, stress, grief and other experiences that affect wellbeing.",
    href: "/mental-wellbeing/screening",
    action: "Start screening",
  },
  {
    number: "02",
    title: "Check in with yourself",
    description:
      "Pause, notice how you are feeling, and reflect on what's happening — privately.",
    href: "/mental-wellbeing/check-in",
    action: "Begin a check-in",
  },
  {
    number: "03",
    title: "Recovery and self-care",
    description:
      "Small, realistic ways to cope and care for yourself. No streaks, no scores.",
    href: "/account/recovery",
    action: "Open recovery",
  },
  {
    number: "04",
    title: "Find support",
    description:
      "Understand the different kinds of support available and when to seek care.",
    href: "/mental-wellbeing/support",
    action: "See support options",
  },
];

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="wb-arrow"
    >
      <path
        d="M3 8h10m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function getPublishedArticles(): Promise<WellbeingArticle[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id, slug, title, summary, category, language, content")
      .eq("published", true)
      .eq("language", "en")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load wellbeing articles:", error.message);
      return [];
    }

    return (data ?? []) as WellbeingArticle[];
  } catch (error) {
    console.error("Wellbeing article request failed:", error);
    return [];
  }
}

async function ArticleGrid() {
  await io();
  const articles = await getPublishedArticles();

  if (articles.length === 0) {
    return (
      <div className="wb-empty">
        <p className="wb-empty-eyebrow">COMING SOON</p>
        <h3 className="wb-empty-title">Learning resources are being prepared.</h3>
        <p className="wb-empty-body">
          We&apos;re working to make these resources useful, responsible and
          relevant to the communities PAFUPI serves.
        </p>
      </div>
    );
  }

  return (
    <div className="wb-articles">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/mental-wellbeing/${article.slug}`}
          className="wb-article"
        >
          <div className="wb-article-meta">
            <span className="wb-article-category">{article.category}</span>
            <span className="wb-article-time">5 min read</span>
          </div>
          <h3 className="wb-article-title">{article.title}</h3>
          <p className="wb-article-summary">{article.summary}</p>
          <span className="wb-article-cta">
            Read article <Arrow />
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function MentalWellbeingPage() {
  return (
    <main className="wb-page">
      {/* ===== HERO ===== */}
      <section className="wb-hero">
        <div className="wb-container">
          <p className="wb-eyebrow">MENTAL WELLBEING</p>

          <h1 className="wb-title">
            You don&apos;t have to
            <br />
            figure it all out
            <br />
            <em>alone.</em>
          </h1>

          <p className="wb-lede">
            Life can become overwhelming. Sometimes we need to understand
            what we&apos;re experiencing, find a way to cope, or simply pause.
            This is a place to begin.
          </p>

          <div className="wb-hero-actions">
            <Link
              href="/mental-wellbeing/check-in"
              className="wb-btn wb-btn-primary"
            >
              Check in with yourself <Arrow />
            </Link>
            <a href="#explore" className="wb-btn wb-btn-ghost">
              Explore below
            </a>
          </div>

          <p className="wb-reassurance">
            Private by default · No diagnosis · Not an emergency service
          </p>
        </div>
      </section>

      {/* ===== PATHWAYS ===== */}
      <section className="wb-pathways" id="explore">
        <div className="wb-container">
          <header className="wb-section-header">
            <p className="wb-eyebrow">A PLACE TO BEGIN</p>
            <h2 className="wb-section-title">What would help right now?</h2>
            <p className="wb-section-desc">
              There&apos;s no prescribed order. Choose what feels most
              relevant today.
            </p>
          </header>

          <div className="wb-pathway-grid">
            {pathways.map((p) => (
              <Link
                key={p.number}
                href={p.href}
                className="wb-pathway"
              >
                <span className="wb-pathway-number">{p.number}</span>
                <h3 className="wb-pathway-title">{p.title}</h3>
                <p className="wb-pathway-desc">{p.description}</p>
                <span className="wb-pathway-action">
                  {p.action} <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ARTICLES ===== */}
      <section className="wb-library">
        <div className="wb-container">
          <header className="wb-section-header">
            <p className="wb-eyebrow">LEARN AT YOUR OWN PACE</p>
            <h2 className="wb-section-title">Understanding can be a first step.</h2>
            <p className="wb-section-desc">
              You don&apos;t need a diagnosis to learn about what you&apos;re
              feeling.
            </p>
          </header>

          <Suspense fallback={<PageLoader message="Loading resources…" />}>
            <ArticleGrid />
          </Suspense>

          <p className="wb-disclaimer">
            These resources are for general information and do not replace
            assessment, diagnosis or care from a qualified health professional.
          </p>
        </div>
      </section>

      {/* ===== SOFT CLOSING ===== */}
      <section className="wb-closing">
        <div className="wb-container wb-closing-inner">
          <div className="wb-closing-symbol" aria-hidden="true">
            ♡
          </div>
          <h2 className="wb-closing-title">
            You deserve to be heard, respected and supported.
          </h2>
          <p className="wb-closing-body">
            Take things at your own pace. There&apos;s no right way to begin,
            and no timeline you need to meet.
          </p>
          <Link
            href="/mental-wellbeing/check-in"
            className="wb-btn wb-btn-primary"
          >
            Take a moment for yourself <Arrow />
          </Link>
        </div>
      </section>

      {/* ===== EMERGENCY ===== */}
      <section className="wb-emergency">
        <div className="wb-container wb-emergency-inner">
          <span className="wb-emergency-icon" aria-hidden="true">
            !
          </span>
          <p className="wb-emergency-text">
            <strong>Need urgent help?</strong> If you or someone else is in
            immediate danger, seek urgent in-person help from the nearest
            health facility or local emergency service. Do not wait for a
            response from this website.
          </p>
        </div>
      </section>
    </main>
  );
}