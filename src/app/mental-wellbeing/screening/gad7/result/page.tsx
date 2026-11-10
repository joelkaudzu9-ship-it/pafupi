import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  interpretGAD7,
  type NextStep,
} from "@/lib/screening/interpretation";
import { scoreGAD7Band, type SeverityBand } from "@/lib/screening/scoring";
import "../../phq9/result/result.css";

export const metadata = {
  title: "Your GAD-7 result",
};

type SearchParams = Promise<{
  id?: string;
  guest?: string;
  score?: string;
  band?: string;
}>;

function ResultSkeleton() {
  return (
    <main className="result-page">
      <div className="result-container">
        <p style={{ opacity: 0.4 }}>Preparing your result…</p>
      </div>
    </main>
  );
}

function StepCard({ step }: { step: NextStep }) {
  return (
    <div className={`result-step result-step-${step.tone}`}>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </div>
  );
}

function SafetyReminder() {
  return (
    <div className="result-crisis">
      <div className="result-crisis-icon" aria-hidden="true">
        !
      </div>
      <div>
        <h2>A reminder about safety</h2>
        <p>
          Anxiety can feel overwhelming. If you also experience thoughts of
          self-harm, please reach out to a trusted person, a health
          professional, or local emergency services. You do not have to carry
          this alone.
        </p>
      </div>
    </div>
  );
}

async function ResultContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let totalScore: number;
  let severity: SeverityBand;
  let isGuest = false;

  if (params.id) {
    if (!user) redirect("/login?next=/mental-wellbeing/screening");
    const { data, error } = await supabase
      .from("assessments")
      .select("total_score, severity_band, instrument")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !data || data.instrument !== "gad7") {
      return (
        <main className="result-page">
          <div className="result-container">
            <Link href="/mental-wellbeing/screening" className="result-back">
              ← Screening
            </Link>
            <h1>Result not found</h1>
            <p>
              We couldn&apos;t find that assessment. It may have been deleted,
              or belong to a different account.
            </p>
          </div>
        </main>
      );
    }

    totalScore = data.total_score;
    severity = data.severity_band as SeverityBand;
  } else if (params.guest === "1" && params.score && params.band) {
    isGuest = true;
    totalScore = Number(params.score);
    severity = params.band as SeverityBand;

    if (
      isNaN(totalScore) ||
      !["minimal", "mild", "moderate", "moderately_severe", "severe"].includes(
        severity
      )
    ) {
      return (
        <main className="result-page">
          <div className="result-container">
            <h1>Invalid result</h1>
            <Link href="/mental-wellbeing/screening">Back to screening</Link>
          </div>
        </main>
      );
    }
  } else {
    redirect("/mental-wellbeing/screening");
  }

  const result = {
    totalScore,
    severity:
      scoreGAD7Band(totalScore) === severity ? severity : scoreGAD7Band(totalScore),
    responses: [],
  };

  const interpretation = interpretGAD7(result as any);

  return (
    <main className="result-page">
      <div className="result-container">
        <Link href="/mental-wellbeing/screening" className="result-back">
          ← Screening
        </Link>

        <SafetyReminder />

        <header className="result-header">
          <p className="result-eyebrow">GAD-7 RESULT</p>
          <h1>{interpretation.headline}</h1>
          <div className="result-score">
            <span className="result-score-number">{totalScore}</span>
            <span className="result-score-max">/ 21</span>
          </div>
          <p className="result-summary">{interpretation.summary}</p>
        </header>

        {isGuest && (
          <div className="result-guest">
            <p>
              <strong>This result was not saved.</strong> Sign in to save
              future screening results to your private account.
            </p>
            <Link
              href="/register?next=/mental-wellbeing/screening"
              className="result-guest-btn"
            >
              Create an account
            </Link>
          </div>
        )}

        <section className="result-next">
          <h2>What you can do next</h2>
          <div className="result-steps">
            {interpretation.nextSteps.map((step, i) => (
              <StepCard key={i} step={step} />
            ))}
          </div>
        </section>

        <div className="result-actions">
          <Link
            href="/mental-wellbeing/screening/gad7"
            className="result-action-primary"
          >
            Retake GAD-7
          </Link>
          {!isGuest && (
            <Link
              href="/mental-wellbeing/screening/history"
              className="result-action-secondary"
            >
              View screening history →
            </Link>
          )}
          <Link href="/mental-wellbeing" className="result-action-secondary">
            Back to mental wellbeing
          </Link>
        </div>

        <p className="result-disclaimer">
          A GAD-7 result is a screening, not a diagnosis. It indicates
          possible anxiety symptoms over the last two weeks. It does not
          replace a clinical assessment, and a low score does not rule out an
          anxiety disorder.
        </p>
      </div>
    </main>
  );
}

export default function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent searchParams={searchParams} />
    </Suspense>
  );
}