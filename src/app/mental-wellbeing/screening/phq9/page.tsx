"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";
import {
  PHQ9_ITEMS,
  PHQ9_OPTIONS,
  PHQ9_INSTRUMENT,
  type PHQ9Response,
} from "@/lib/screening/instruments";
import { evaluatePHQ9 } from "@/lib/screening/scoring";
import "./phq9.css";

export default function PHQ9Page() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState<(PHQ9Response | null)[]>(
    Array(PHQ9_ITEMS.length).fill(null)
  );
  const [saving, setSaving] = useState(false);

  const item = PHQ9_ITEMS[current];
  const total = PHQ9_ITEMS.length;
  const progress = ((current + 1) / total) * 100;

  function select(value: PHQ9Response) {
    const next = [...responses];
    next[current] = value;
    setResponses(next);

    // Auto-advance after a short delay for smoothness
    if (current < total - 1) {
      setTimeout(() => setCurrent(current + 1), 180);
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  async function finish() {
    if (responses.some((r) => r === null)) return;
    setSaving(true);

    const filled = responses as PHQ9Response[];
    const result = evaluatePHQ9(filled);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Guests can still see their result; it just won't be saved.
    if (!user) {
      router.push(
        `/mental-wellbeing/screening/phq9/result?guest=1&score=${result.totalScore}&band=${result.severity}&crisis=${result.crisisFlag ? 1 : 0}`
      );
      return;
    }

    const { data: assessment, error: insertErr } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        instrument: "phq9",
        total_score: result.totalScore,
        severity_band: result.severity,
        crisis_flag: result.crisisFlag,
      })
      .select("id")
      .single();

    if (insertErr || !assessment) {
      toast({
        variant: "error",
        title: "Couldn't save your result",
        description:
          insertErr?.message ?? "Please try again, or continue without saving.",
      });
      router.push(
        `/mental-wellbeing/screening/phq9/result?guest=1&score=${result.totalScore}&band=${result.severity}&crisis=${result.crisisFlag ? 1 : 0}`
      );
      return;
    }

    const rows = filled.map((value, index) => ({
      assessment_id: assessment.id,
      item_index: index,
      response_value: value,
    }));

    const { error: respErr } = await supabase
      .from("assessment_responses")
      .insert(rows);

    if (respErr) {
      toast({
        variant: "warning",
        title: "Result saved, responses not stored",
        description: respErr.message,
      });
    }

    router.push(`/mental-wellbeing/screening/phq9/result?id=${assessment.id}`);
  }

  return (
    <main className="phq9-page">
      <div className="phq9-container">
        <div className="phq9-top">
          <Link href="/mental-wellbeing/screening" className="phq9-back">
            ← Screening
          </Link>
          <span className="phq9-progress-label">
            Question {current + 1} of {total}
          </span>
        </div>

        <div className="phq9-progress" aria-hidden="true">
          <div className="phq9-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="phq9-instrument-label">
          <strong>{PHQ9_INSTRUMENT.name}</strong> ·{" "}
          {PHQ9_INSTRUMENT.fullName}
        </div>

        <div className="phq9-question">
          <p className="phq9-timeframe">{PHQ9_INSTRUMENT.timeframe}…</p>
          <h1>How often have you been bothered by:</h1>
          <p className="phq9-item-text">{item.text}</p>
        </div>

        <fieldset className="phq9-options">
          <legend className="phq9-legend">Choose one</legend>
          {PHQ9_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`phq9-option ${
                responses[current] === opt.value ? "selected" : ""
              }`}
              onClick={() => select(opt.value)}
              aria-pressed={responses[current] === opt.value}
            >
              <span className="phq9-option-value">{opt.shortLabel}</span>
              <span className="phq9-option-label">{opt.label}</span>
            </button>
          ))}
        </fieldset>

        <div className="phq9-nav">
          <button
            type="button"
            onClick={goBack}
            disabled={current === 0}
            className="phq9-nav-back"
          >
            ← Back
          </button>

          {current === total - 1 ? (
            <button
              type="button"
              onClick={finish}
              disabled={responses.some((r) => r === null) || saving}
              className="phq9-nav-finish"
            >
              {saving ? "Saving…" : "See my result →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrent(current + 1)}
              disabled={responses[current] === null}
              className="phq9-nav-next"
            >
              Next →
            </button>
          )}
        </div>

        <p className="phq9-disclaimer">
          This questionnaire is not a diagnosis. If you feel unsafe, contact
          local emergency services immediately.
        </p>
      </div>
    </main>
  );
}