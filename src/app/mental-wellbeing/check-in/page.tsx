"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";
import "./check-in.css";

const feelings = [
  { label: "Very low", mood: 1, emoji: "😔", description: "Things feel difficult." },
  { label: "Low", mood: 2, emoji: "😕", description: "I'm not feeling my best." },
  { label: "Okay", mood: 3, emoji: "😐", description: "I'm somewhere in between." },
  { label: "Good", mood: 4, emoji: "🙂", description: "I'm doing fairly well." },
  { label: "Very good", mood: 5, emoji: "😊", description: "I'm feeling positive." },
];

export default function CheckInPage() {
  const router = useRouter();
  const [feeling, setFeeling] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/mental-wellbeing/check-in");
        return;
      }
      setCheckingAuth(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feeling === null || saving) return;

    setSaving(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "error",
        title: "Session expired",
        description: "Please sign in again to save your check-in.",
      });
      router.push("/login?next=/mental-wellbeing/check-in");
      return;
    }

    const { error } = await supabase.from("mood_checkins").insert({
      user_id: user.id,
      mood: feeling,
      note: reflection.trim() || null,
    });

    if (error) {
      toast({
        variant: "error",
        title: "Couldn't save your check-in",
        description: error.message,
      });
      setSaving(false);
      return;
    }

    toast({
      variant: "success",
      title: "Check-in saved",
      description: "Your reflection is private and only visible to you.",
    });

    setSubmitted(true);
    setSaving(false);
  }

  function startAgain() {
    setFeeling(null);
    setReflection("");
    setSubmitted(false);
  }

  if (checkingAuth) {
    return (
      <main className="checkin-page">
        <div className="checkin-container" aria-hidden="true">
          <p style={{ opacity: 0.4 }}>Preparing your check-in…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkin-page">
      <div className="checkin-container">
        <Link href="/mental-wellbeing" className="checkin-back">
          ← Mental wellbeing
        </Link>

        {!submitted ? (
          <>
            <div className="checkin-heading">
              <span className="checkin-eyebrow">YOUR WELLBEING</span>
              <h1>How are you feeling today?</h1>
              <p>
                Take a moment for yourself. There is no right or wrong answer.
                You don&apos;t have to pretend everything is okay here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="checkin-form">
              <fieldset className="feeling-fieldset">
                <legend>Choose what feels closest to how you feel.</legend>
                <div className="feeling-options">
                  {feelings.map((item) => (
                    <button
                      type="button"
                      key={item.mood}
                      className={`feeling-option ${
                        feeling === item.mood ? "selected" : ""
                      }`}
                      onClick={() => setFeeling(item.mood)}
                      aria-pressed={feeling === item.mood}
                    >
                      <span className="feeling-emoji" aria-hidden="true">
                        {item.emoji}
                      </span>
                      <span className="feeling-label">{item.label}</span>
                      <span className="feeling-description">
                        {item.description}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="reflection-field">
                <label htmlFor="reflection">
                  Would you like to say a little more?{" "}
                  <span>Optional</span>
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="What's been on your mind?"
                  rows={4}
                  maxLength={1000}
                />
                <small>
                  You can leave this blank. Only share what you&apos;re
                  comfortable expressing.
                </small>
              </div>

              <button
                type="submit"
                className="checkin-submit"
                disabled={feeling === null || saving}
              >
                {saving ? "Saving…" : "Complete check-in"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="checkin-privacy">
              <span aria-hidden="true">🔒</span>
              Your check-in is saved to your private account and only visible
              to you. You can delete it at any time.
            </p>
          </>
        ) : (
          <section className="checkin-complete" aria-live="polite">
            <div className="complete-symbol" aria-hidden="true">
              ✓
            </div>
            <span className="checkin-eyebrow">THANK YOU FOR CHECKING IN</span>
            <h1>You made space for yourself.</h1>
            <p>
              You don&apos;t have to solve everything today. Recognising how
              you feel is a meaningful place to begin.
            </p>

            <div className="complete-feeling">
              <span>
                {feelings.find((f) => f.mood === feeling)?.emoji}
              </span>
              <div>
                <small>Your selected feeling</small>
                <strong>{feelings.find((f) => f.mood === feeling)?.label}</strong>
              </div>
            </div>

            {reflection.trim() && (
              <div className="complete-reflection">
                <small>Your reflection</small>
                <p>{reflection}</p>
              </div>
            )}

            <p className="complete-note">
              Remember, one check-in does not define you or determine your
              mental health.
            </p>

            <div className="complete-actions">
              <Link
                href="/account/check-ins"
                className="checkin-submit"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                View my check-in history →
              </Link>
              <button
                type="button"
                className="checkin-home-link"
                onClick={startAgain}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                }}
              >
                Check in again
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}