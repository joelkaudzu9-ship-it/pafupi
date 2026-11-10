import type { Metadata } from "next";
import Image from "next/image";
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
    icon: "◌",
    title: "Understand your feelings",
    description: "Explore experiences such as low mood, anxiety, stress and grief.",
    href: "/mental-wellbeing/screening",
    action: "Begin screening",
  },
  {
    number: "02",
    icon: "♡",
    title: "Check in with yourself",
    description: "Pause, notice how you are feeling and reflect on what is happening.",
    href: "/mental-wellbeing/check-in",
    action: "Start a check-in",
  },
  {
    number: "03",
    icon: "✳",
    title: "Recovery and self-care",
    description: "Find realistic ways to cope, care for yourself and take small steps.",
    href: "#recovery",
    action: "Explore recovery",
  },
  {
    number: "04",
    icon: "↗",
    title: "Finding support",
    description: "Learn about different kinds of support and when to seek professional care.",
    href: "/mental-wellbeing/support",
    action: "Understand your options",
  },
];

function Arrow() {
  return <span aria-hidden="true" className="wb-arrow">↗</span>;
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
      <div className="wellbeing-library-empty">
        <h3>Learning resources are being prepared.</h3>
        <p>
          We&apos;re working to make these resources useful, responsible and
          relevant to the communities PAFUPI serves.
        </p>
      </div>
    );
  }

  return (
    <div className="wellbeing-topic-grid">
      {articles.map((article) => (
        <article className="wellbeing-topic-card" key={article.id}>
          <span className="topic-category">{article.category}</span>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <Link
            href={`/mental-wellbeing/${article.slug}`}
            className="topic-read-link"
          >
            Read resource <Arrow />
          </Link>
        </article>
      ))}
    </div>
  );
}

export default function MentalWellbeingPage() {
  return (
    <main className="wellbeing-page">
      <section className="wellbeing-hero">
        <div className="wellbeing-container wellbeing-hero-grid">
          <div className="wellbeing-hero-copy">
            <span className="wellbeing-eyebrow">MENTAL WELLBEING</span>
            <h1>
              You don&apos;t have to figure it all out <em>alone.</em>
            </h1>
            <p className="wellbeing-intro">
              Life can become overwhelming. Sometimes we need to understand
              what we&apos;re experiencing, find ways to cope, or simply take a
              moment to pause. This is a place to begin.
            </p>
            <div className="wellbeing-hero-actions">
              <Link
                href="/mental-wellbeing/check-in"
                className="wellbeing-primary-button"
              >
                Check in with yourself <span aria-hidden="true">→</span>
              </Link>
              <a href="#explore" className="wellbeing-secondary-link">
                Explore this space <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="wellbeing-hero-note">
              <span className="wellbeing-note-dot" />
              A space for understanding, reflection and support.
            </div>
          </div>
          <div className="wellbeing-hero-image">
            <Image
              src="/images/mental-wellbeing-hero.png"
              alt="A woman enjoying a peaceful moment outdoors at sunset"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
              className="wellbeing-hero-photo"
            />
            <div className="hero-image-caption">
              <span className="hero-caption-symbol" aria-hidden="true">
                ♡
              </span>
              <span>
                <strong>Take a moment.</strong>
                <small>You deserve one.</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="wellbeing-pathways" id="explore">
        <div className="wellbeing-container">
          <div className="wellbeing-section-heading">
            <div>
              <span className="wellbeing-eyebrow">A PLACE TO BEGIN</span>
              <h2>What would be helpful right now?</h2>
            </div>
            <p>
              There&apos;s no prescribed order. Choose the path that feels most
              relevant to you today.
            </p>
          </div>
          <div className="wellbeing-pathway-grid">
            {pathways.map((pathway) => (
              <article className="wellbeing-pathway-card" key={pathway.number}>
                <div className="pathway-card-top">
                  <span className="pathway-icon" aria-hidden="true">
                    {pathway.icon}
                  </span>
                  <span className="pathway-number">{pathway.number}</span>
                </div>
                <h3>{pathway.title}</h3>
                <p>{pathway.description}</p>
                <Link href={pathway.href} className="pathway-link">
                  {pathway.action} <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wellbeing-topics" id="understanding">
        <div className="wellbeing-container">
          <div className="wellbeing-section-heading topics-heading">
            <div>
              <span className="wellbeing-eyebrow">LEARN AT YOUR OWN PACE</span>
              <h2>Understanding can be a first step.</h2>
            </div>
            <p>
              Explore experiences that can affect mental wellbeing. You do not
              need to have a diagnosis to learn about what you are feeling.
            </p>
          </div>

          <Suspense fallback={<PageLoader message="Loading resources…" />}>
            <ArticleGrid />
          </Suspense>

          <p className="topics-footnote">
            These resources are for general information and do not replace
            assessment, diagnosis or care from a qualified health professional.
          </p>
        </div>
      </section>

      <section className="wellbeing-recovery" id="recovery">
        <div className="wellbeing-container recovery-inner">
          <div className="recovery-symbol" aria-hidden="true">
            ✳
          </div>
          <div className="recovery-copy">
            <span className="wellbeing-eyebrow">SMALL STEPS MATTER</span>
            <h2>Progress doesn&apos;t always look like progress.</h2>
            <p>
              Some days you move forward. Other days, simply getting through the
              day takes effort. Your experience doesn&apos;t have to follow
              anyone else&apos;s timeline.
            </p>
            <Link href="/mental-wellbeing/check-in" className="recovery-link">
              Take a moment for yourself <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="wellbeing-support" id="support">
        <div className="wellbeing-container support-inner">
          <div className="support-copy">
            <span className="wellbeing-eyebrow">HUMAN CONNECTION MATTERS</span>
            <h2>Sometimes, talking to someone can make a difference.</h2>
            <p>
              Resources can help us understand what we&apos;re experiencing, but
              they are not a replacement for professional care. If you are
              struggling, consider reaching out to a qualified health
              professional or someone you trust.
            </p>
          </div>
          <aside className="support-notice">
            <span className="support-notice-icon" aria-hidden="true">
              ♡
            </span>
            <h3>You deserve to be heard.</h3>
            <p>
              PAFUPI is developing its human-support and referral pathways.
              Verified services will be listed here as appropriate partnerships
              become available.
            </p>
            <span className="support-status">DIRECTORY IN DEVELOPMENT</span>
          </aside>
        </div>
      </section>

      <section
        className="wellbeing-emergency"
        aria-label="Urgent help information"
      >
        <div className="wellbeing-container emergency-inner">
          <span className="emergency-mark" aria-hidden="true">
            !
          </span>
          <p>
            <strong>Need urgent help?</strong> If you or someone else is in
            immediate danger, seek urgent in-person help from the nearest health
            facility or local emergency service. Do not wait for a response from
            this website.
          </p>
        </div>
      </section>
    </main>
  );
}