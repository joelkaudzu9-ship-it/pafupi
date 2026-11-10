import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./screening.css";

export const metadata: Metadata = {
  title: "Screening",
  description:
    "Optional, private screening questionnaires. Not a diagnosis. Not an emergency service.",
};

function ScreeningLandingSkeleton() {
  return (
    <main className="screening-page">
      <div className="screening-container">
        <p style={{ opacity: 0.4 }}>Loading screening…</p>
      </div>
    </main>
  );
}

type Instrument = {
  id: "phq9" | "gad7" | "ghq12";
  name: string;
  fullName: string;
  purpose: string;
  itemCount: number;
  minutes: string;
  href: string | null;
  status: "available" | "soon";
};

const INSTRUMENTS: Instrument[] = [
  {
    id: "phq9",
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    purpose: "Screening for symptoms of depression over the last two weeks.",
    itemCount: 9,
    minutes: "3–5 min",
    href: "/mental-wellbeing/screening/phq9",
    status: "available",
  },
  {
    id: "gad7",
    name: "GAD-7",
    fullName: "Generalised Anxiety Disorder-7",
    purpose: "Screening for symptoms of anxiety over the last two weeks.",
    itemCount: 7,
    minutes: "2–4 min",
    href: "/mental-wellbeing/screening/gad7",
    status: "available",
  },
  {
    id: "ghq12",
    name: "GHQ-12",
    fullName: "General Health Questionnaire-12",
    purpose: "Screening for general psychological distress over the past few weeks.",
    itemCount: 12,
    minutes: "4–6 min",
    href: "/mental-wellbeing/screening/ghq12",
    status: "available",
  },
];

async function ScreeningContent() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let lastResult: {
    instrument: string;
    total_score: number;
    severity_band: string;
    completed_at: string;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("assessments")
      .select("instrument, total_score, severity_band, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    lastResult = data ?? null;
  }

  return (
    <main className="screening-page">
      <div className="screening-container">
        <Link href="/mental-wellbeing" className="screening-back">
          ← Mental wellbeing
        </Link>

        <header className="screening-hero">
          <p className="screening-eyebrow">OPTIONAL SCREENING</p>
          <h1>Understand your symptoms — privately.</h1>
          <p className="screening-intro">
            These are validated screening questionnaires. They help you
            reflect on how you have been feeling. They are not a diagnosis, and
            they do not replace an assessment by a qualified professional.
          </p>
        </header>

        <div className="screening-disclaimer">
          <span className="screening-disclaimer-icon" aria-hidden="true">
            !
          </span>
          <div>
            <strong>Not an emergency service.</strong> If you or someone else
            is in immediate danger, contact local emergency services. Results
            from these questionnaires do not reach any person until you choose
            to share them.
          </div>
        </div>

        {lastResult && (
          <div className="screening-last">
            <div>
              <p className="screening-last-eyebrow">YOUR LAST SCREENING</p>
              <p className="screening-last-body">
                <strong>{lastResult.instrument.toUpperCase()}</strong> ·{" "}
                Score {lastResult.total_score} · {lastResult.severity_band.replace("_", " ")}
              </p>
              <p className="screening-last-date">
                {new Date(lastResult.completed_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link
              href="/mental-wellbeing/screening/history"
              className="screening-last-link"
            >
              View history →
            </Link>
          </div>
        )}

        <ul className="screening-list">
          {INSTRUMENTS.map((inst) => (
            <li
              key={inst.id}
              className={`screening-card ${
                inst.status === "soon" ? "screening-card-soon" : ""
              }`}
            >
              <div className="screening-card-top">
                <span className="screening-card-name">{inst.name}</span>
                {inst.status === "soon" && (
                  <span className="screening-card-badge">COMING SOON</span>
                )}
              </div>
              <h2>{inst.fullName}</h2>
              <p>{inst.purpose}</p>
              <div className="screening-card-meta">
                <span>{inst.itemCount} questions</span>
                <span>·</span>
                <span>{inst.minutes}</span>
              </div>
              {inst.status === "available" && inst.href ? (
                <Link href={inst.href} className="screening-card-btn">
                  Start {inst.name} →
                </Link>
              ) : (
                <span className="screening-card-btn screening-card-btn-soon">
                  Available in an upcoming update
                </span>
              )}
            </li>
          ))}
        </ul>

        {!user && (
          <div className="screening-signin">
            <p>
              <strong>Sign in to save your screening history.</strong> Your
              results are private to your account. You can also complete
              screening anonymously — results just won&apos;t be saved.
            </p>
            <Link href="/login?next=/mental-wellbeing/screening" className="screening-card-btn">
              Sign in
            </Link>
          </div>
        )}

        <p className="screening-footnote">
          These questionnaires are used for screening only. They have been
          validated in clinical research, but a positive result does not
          confirm a diagnosis, and a negative result does not rule out one.
        </p>
      </div>
    </main>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense fallback={<ScreeningLandingSkeleton />}>
      <ScreeningContent />
    </Suspense>
  );
}