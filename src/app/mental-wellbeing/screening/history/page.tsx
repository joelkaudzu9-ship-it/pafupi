import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./history.css";

export const metadata: Metadata = {
  title: "Screening history",
  description:
    "Your private screening history. Only visible to you.",
};

type Assessment = {
  id: string;
  instrument: string;
  total_score: number;
  severity_band: string;
  crisis_flag: boolean;
  completed_at: string;
};

const INSTRUMENT_LABELS: Record<string, string> = {
  phq9: "PHQ-9",
  gad7: "GAD-7",
  ghq12: "GHQ-12",
  who5: "WHO-5",
};

const BAND_LABELS: Record<string, string> = {
  minimal: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  moderately_severe: "Moderately severe",
  severe: "Severe",
};

const BAND_TONES: Record<string, string> = {
  minimal: "history-band-minimal",
  mild: "history-band-mild",
  moderate: "history-band-moderate",
  moderately_severe: "history-band-severe",
  severe: "history-band-severe",
};

function HistorySkeleton() {
  return (
    <main className="history-page">
      <div className="history-container">
        <p style={{ opacity: 0.4 }}>Loading your screening history…</p>
      </div>
    </main>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

async function HistoryContent() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/mental-wellbeing/screening/history");

  const { data, error } = await supabase
    .from("assessments")
    .select("id, instrument, total_score, severity_band, crisis_flag, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main className="history-page">
        <div className="history-container">
          <Link href="/mental-wellbeing/screening" className="history-back">
            ← Screening
          </Link>
          <h1>Your screening history</h1>
          <p style={{ color: "#a14034" }}>
            We couldn&apos;t load your screening history right now. Please try
            again later.
          </p>
        </div>
      </main>
    );
  }

  const assessments = (data ?? []) as Assessment[];

  return (
    <main className="history-page">
      <div className="history-container">
        <Link href="/mental-wellbeing/screening" className="history-back">
          ← Screening
        </Link>

        <header className="history-header">
          <div>
            <p className="history-eyebrow">PRIVATE HISTORY</p>
            <h1>Your screening history</h1>
            <p className="history-intro">
              A record of the screening questionnaires you have completed.
              Only visible to you.
            </p>
          </div>
          <Link
            href="/mental-wellbeing/screening"
            className="history-new-btn"
          >
            New screening →
          </Link>
        </header>

        {assessments.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-symbol">◈</span>
            <h2>No screenings yet</h2>
            <p>
              When you complete a screening questionnaire, it will appear
              here. Screening is optional — there is no pressure to complete
              one.
            </p>
            <Link
              href="/mental-wellbeing/screening"
              className="history-new-btn"
            >
              View screening options →
            </Link>
          </div>
        ) : (
          <ul className="history-list">
            {assessments.map((a) => {
              const { date, time } = formatDateTime(a.completed_at);
              const instrumentLabel =
                INSTRUMENT_LABELS[a.instrument] ?? a.instrument.toUpperCase();
              const bandLabel =
                BAND_LABELS[a.severity_band] ?? a.severity_band;
              const bandTone =
                BAND_TONES[a.severity_band] ?? "history-band-minimal";

              return (
                <li key={a.id} className="history-item">
                  <div className="history-item-main">
                    <div className="history-item-meta">
                      <span className="history-instrument">
                        {instrumentLabel}
                      </span>
                      <span className={`history-band ${bandTone}`}>
                        {bandLabel}
                      </span>
                      {a.crisis_flag && (
                        <span className="history-crisis">Crisis flagged</span>
                      )}
                    </div>
                    <div className="history-item-score">
                      <span className="history-score-value">
                        {a.total_score}
                      </span>
                      <span className="history-score-date">
                        {date} · {time}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/mental-wellbeing/screening/${a.instrument}/result?id=${a.id}`}
                    className="history-view-btn"
                  >
                    View result →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <p className="history-footnote">
          Screening results are not diagnoses. They indicate possible symptoms
          at a point in time. If you are concerned about your mental health,
          please speak with a qualified professional.
        </p>
      </div>
    </main>
  );
}

export default function ScreeningHistoryPage() {
  return (
    <Suspense fallback={<HistorySkeleton />}>
      <HistoryContent />
    </Suspense>
  );
}