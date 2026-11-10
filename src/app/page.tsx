import Link from "next/link";
import Image from "next/image";
import "./home.css";

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pafupi-arrow"
      fill="none"
    >
      <path
        d="M4.5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 27s-11-6.8-11-15a6.3 6.3 0 0 1 11-4.2A6.3 6.3 0 0 1 27 12c0 8.2-11 15-11 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <path
        d="M26.5 5.5C15 5.5 7 9.3 7 18.1c0 4.2 2.8 6.8 6.5 6.8 8.2 0 13-9.2 13-19.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 28c4.3-7.2 9.2-11.6 16.5-16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7.5 26v-2.2a8.5 8.5 0 0 1 17 0V26M5 13a3.3 3.3 0 0 0 0 6.6m22-6.6a3.3 3.3 0 0 1 0 6.6M2.8 26v-1.2a5.2 5.2 0 0 1 4-5.1m22.4 6.3v-1.2a5.2 5.2 0 0 0-4-5.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20.5 11.5-3.2 8.1-8 3.2 3.2-8.1 8-3.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4v6m0 12v6M4 16h6m12 0h6M7.5 7.5l4.2 4.2m8.6 8.6 4.2 4.2m0-17-4.2 4.2m-8.6 8.6-4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HandsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <path
        d="M8 14V9.5a2.5 2.5 0 0 1 5 0V14m0-4.5a2.5 2.5 0 0 1 5 0V14m0-3a2.5 2.5 0 0 1 5 0v8.5a7 7 0 0 1-7 7h-.5A8.5 8.5 0 0 1 8 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pafupi's responsive landing page — hero + supporting sections. */
export default function Home() {
  return (
    <main className="pafupi-home">
      {/* ============ HERO ============ */}

      <div className="pafupi-art" aria-hidden="true">
        <div className="pafupi-art__halo pafupi-art__halo--one" />
        <div className="pafupi-art__halo pafupi-art__halo--two" />
        <div className="pafupi-art__photo">
          <Image
            src="/images/pafupi-home-hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 720px) 100vw, 66vw"
          />
          <div className="pafupi-art__tint" />
        </div>
        <div className="pafupi-art__wash" />
        <svg className="pafupi-birds" viewBox="0 0 180 100" fill="none">
          <path
            d="M8 29c8-10 16-10 24 0 8-10 16-10 24 0M75 14c7-9 14-9 21 0 7-9 14-9 21 0M119 53c6-8 12-8 18 0 6-8 12-8 18 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <section className="pafupi-hero" aria-labelledby="pafupi-heading">
        <div className="pafupi-copy">
          <p className="pafupi-eyebrow pafupi-reveal pafupi-reveal-1">
            <span /> A little closer to feeling better
          </p>
          <h1 id="pafupi-heading" className="pafupi-reveal pafupi-reveal-2">
            Support is
            <br />
            closer than
            <br />
            <em>you think.</em>
          </h1>
          <p className="pafupi-description pafupi-reveal pafupi-reveal-3">
            A safe space for mental wellbeing,
            <br className="pafupi-desktop-break" /> understanding and human
            connection.
          </p>
          <div className="pafupi-actions pafupi-reveal pafupi-reveal-4">
            <Link
              className="pafupi-button pafupi-button--primary"
              href="/mental-wellbeing"
            >
              Explore mental wellbeing <ArrowRight />
            </Link>
            <Link
              className="pafupi-button pafupi-button--secondary"
              href="/mental-wellbeing/check-in"
            >
              Check in with yourself
            </Link>
          </div>
          <div
            className="pafupi-pillars pafupi-reveal pafupi-reveal-5"
            aria-label="What you can do with Pafupi"
          >
            <div className="pafupi-pillar">
              <span className="pafupi-pillar__icon">
                <HeartIcon />
              </span>
              <span>
                Understand
                <br />
                your feelings
              </span>
            </div>
            <span className="pafupi-pillar__divider" />
            <div className="pafupi-pillar">
              <span className="pafupi-pillar__icon">
                <LeafIcon />
              </span>
              <span>
                Build
                <br />
                resilience
              </span>
            </div>
            <span className="pafupi-pillar__divider" />
            <div className="pafupi-pillar">
              <span className="pafupi-pillar__icon">
                <PeopleIcon />
              </span>
              <span>
                Find
                <br />
                support
              </span>
            </div>
          </div>
        </div>
        <div className="pafupi-image-caption" aria-hidden="true">
          <span>Take a breath.</span>
          <span>You&apos;re not alone.</span>
        </div>
        <a href="#about" className="pafupi-scroll-cue" aria-label="Scroll to learn more">
          <span className="pafupi-scroll-cue__line" />
          <span className="pafupi-scroll-cue__label">Discover</span>
        </a>
      </section>

      {/* ============ ABOUT ============ */}

      <section className="pafupi-about" id="about" aria-labelledby="about-heading">
        <div className="pafupi-about__inner">
          <header className="pafupi-about__header pafupi-onview">
            <p className="pafupi-about__eyebrow">
              <span /> A little about Pafupi
            </p>
            <h2 id="about-heading" className="pafupi-about__title">
              A space for understanding,
              <br />
              <em>not just advice.</em>
            </h2>
            <p className="pafupi-about__intro">
              PAFUPI isn&apos;t a checklist. It isn&apos;t a diagnosis. It&apos;s
              a place to pause, understand how you&apos;re feeling, and find
              small, meaningful steps toward support — at your own pace, on
              your own terms.
            </p>
          </header>

          <div className="pafupi-about__cards">
            <article className="pafupi-about-card pafupi-onview">
              <span className="pafupi-about-card__icon">
                <CompassIcon />
              </span>
              <h3>Understand yourself</h3>
              <p>
                Optional, private screening and reflective check-ins help you
                notice patterns without judgment. You decide what to share and
                what stays just for you.
              </p>
            </article>

            <article className="pafupi-about-card pafupi-onview">
              <span className="pafupi-about-card__icon">
                <SparkIcon />
              </span>
              <h3>Small steps that matter</h3>
              <p>
                Recovery isn&apos;t linear. Personal goals, coping strategies
                and gentle progress — no streaks, no scores, no shame if you
                miss a day.
              </p>
            </article>

            <article className="pafupi-about-card pafupi-onview">
              <span className="pafupi-about-card__icon">
                <HandsIcon />
              </span>
              <h3>Human connection</h3>
              <p>
                Verified support services, trusted contacts and clear pathways
                to professional care. PAFUPI connects you to people — it
                doesn&apos;t replace them.
              </p>
            </article>
          </div>

          <div className="pafupi-about__note pafupi-onview">
            <strong>PAFUPI is not an emergency service.</strong> If you or
            someone else is in immediate danger, contact local emergency
            services or the nearest health facility.
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}

      <section className="pafupi-closing" aria-labelledby="closing-heading">
        <div className="pafupi-closing__inner pafupi-onview">
          <h2 id="closing-heading" className="pafupi-closing__title">
            You don&apos;t have to figure it all out <em>alone.</em>
          </h2>
          <p className="pafupi-closing__intro">
            Start wherever feels right. There&apos;s no right way to begin.
          </p>
          <div className="pafupi-closing__actions">
            <Link
              href="/mental-wellbeing"
              className="pafupi-button pafupi-button--primary"
            >
              Explore mental wellbeing <ArrowRight />
            </Link>
            <Link
              href="/mental-wellbeing/check-in"
              className="pafupi-button pafupi-button--secondary"
            >
              Check in with yourself
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}