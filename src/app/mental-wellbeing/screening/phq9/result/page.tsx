import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { interpretPHQ9, type NextStep } from "@/lib/screening/interpretation";
import { scoreBand, type SeverityBand } from "@/lib/screening/scoring";
import "./result.css";

export const metadata = {
  title: "Your PHQ-9 result",
};

type SearchParams = Promise<{
  id?: string;
  guest?: string;
  score?: string;
  band?: string;
  crisis?: string;
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

function CrisisBlock() {
  return (
    <div className="result-crisis">
      <div className="result-crisis-icon" aria-hidden="true">
        !
      </div>
      <div>
        <h2>Please read this carefully</h2>
        <p>
          You indicated thoughts that you would be better off dead, or of
          hurting yourself. This is important, and you deserve support right
          now.
        </p>
        <ul>
          <li>
            <strong>If you are in immediate danger</strong>, contact local
            emergency services or go to the nearest health facility.
          </li>
          <li>
            <strong>Speak to someone you trust</strong> — a friend, family
            member, health worker, or counsellor.
          </li>
          <li>
            <strong>You are not alone.</strong> Many people experience thoughts
            like these and go on to find support and relief. Reaching out is a
            sign of strength, not weakness.
          </li>
        </ul>
        <p className="result-crisis-note">
          This app cannot contact anyone on your behalf. It cannot monitor you.
          Please reach out to a real person now.
        </p>
      </div>
    </div>
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
  let crisisFlag: boolean;
  let isGuest = false;

  if (params.id) {
    if (!user) redirect("/login?next=/mental-wellbeing/screening");
    const { data, error } = await supabase
      .from("assessments")
      .select("total_score, severity_band, crisis_flag, instrument")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !data || data.instrument !== "phq9") {
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
    crisisFlag = data.crisis_flag;
  } else if (params.guest === "1" && params.score && params.band) {
    isGuest = true;
    totalScore = Number(params.score);
    severity = params.band as SeverityBand;
    crisisFlag = params.crisis === "1";

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
    severity: scoreBand(totalScore) === severity ? severity : scoreBand(totalScore),
    crisisFlag,
    responses: [],
  };

  const interpretation = interpretPHQ9(result as any);

  return (
    <main className="result-page">
      <div className="result-container">
        <Link href="/mental-wellbeing/screening" className="result-back">
          ← Screening
        </Link>

        {interpretation.showCrisisPathway && <CrisisBlock />}

        <header className="result-header">
          <p className="result-eyebrow">PHQ-9 RESULT</p>
          <h1>{interpretation.headline}</h1>
          <div className="result-score">
            <span className="result-score-number">{totalScore}</span>
            <span className="result-score-max">/ 27</span>
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
            href="/mental-wellbeing/screening/phq9"
            className="result-action-primary"
          >
            Retake PHQ-9
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
          A PHQ-9 result is a screening, not a diagnosis. It indicates
          possible depressive symptoms over the last two weeks. It does not
          replace a clinical assessment, and a low score does not rule out
          depression.
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