import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createGoal, toggleGoal, deleteGoal } from "./actions";
import "./recovery.css";

export const metadata: Metadata = {
  title: "Your recovery",
};

type Goal = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  target_date: string | null;
  created_at: string;
};

function RecoverySkeleton() {
  return (
    <main className="recovery-page">
      <div className="recovery-container">
        <p style={{ opacity: 0.4 }}>Loading your recovery space…</p>
      </div>
    </main>
  );
}

function formatTargetDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function RecoveryContent() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/recovery");

  const { data } = await supabase
    .from("recovery_goals")
    .select("id, title, description, completed, target_date, created_at")
    .eq("user_id", user.id)
    .order("completed", { ascending: true })
    .order("created_at", { ascending: false });

  const goals = (data ?? []) as Goal[];
  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  return (
    <main className="recovery-page">
      <div className="recovery-container">
        <Link href="/account" className="recovery-back">
          ← Your account
        </Link>

        <header className="recovery-header">
          <div>
            <p className="recovery-eyebrow">YOUR RECOVERY</p>
            <h1>Small steps, at your own pace.</h1>
            <p className="recovery-intro">
              Recovery doesn&apos;t follow a straight line. These are personal
              goals you choose for yourself — not a checklist, and not a
              score. Some days you&apos;ll move forward. Others, simply getting
              through the day is enough.
            </p>
          </div>
          <Link href="/account/recovery/coping" className="recovery-coping-link">
            Coping strategies →
          </Link>
        </header>

        <section className="recovery-section">
          <h2>Add a goal</h2>
          <p className="recovery-section-intro">
            Something small and meaningful to you. It can be anything — a
            phone call, a walk, asking for help.
          </p>
          <form action={createGoal} className="recovery-form">
            <div className="recovery-form-row">
              <label>
                <span>Goal</span>
                <input
                  name="title"
                  required
                  maxLength={120}
                  placeholder="Call a friend I haven't spoken to in a while"
                />
              </label>
              <label>
                <span>Target date (optional)</span>
                <input type="date" name="target_date" />
              </label>
            </div>
            <label>
              <span>Notes (optional)</span>
              <textarea
                name="description"
                rows={2}
                maxLength={500}
                placeholder="Anything you want to remember about why this matters"
              />
            </label>
            <div className="recovery-form-actions">
              <button type="submit" className="recovery-btn recovery-btn-primary">
                Add goal
              </button>
            </div>
          </form>
        </section>

        {goals.length === 0 ? (
          <div className="recovery-empty">
            <span className="recovery-empty-symbol">✳</span>
            <h3>No goals yet</h3>
            <p>
              Recovery is personal. When you feel ready, add a small goal
              above. There is no pressure, and no timeline except your own.
            </p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section className="recovery-section">
                <h2>
                  In progress
                  <span className="recovery-count">{active.length}</span>
                </h2>
                <ul className="recovery-goals">
                  {active.map((g) => {
                    const target = formatTargetDate(g.target_date);
                    return (
                      <li key={g.id} className="recovery-goal">
                        <form action={toggleGoal} className="recovery-goal-toggle">
                          <input type="hidden" name="id" value={g.id} />
                          <input type="hidden" name="completed" value="true" />
                          <button
                            type="submit"
                            aria-label="Mark as completed"
                            className="recovery-goal-check"
                          >
                            ○
                          </button>
                        </form>
                        <div className="recovery-goal-body">
                          <h3>{g.title}</h3>
                          {g.description && <p>{g.description}</p>}
                          {target && (
                            <span className="recovery-goal-target">
                              Target: {target}
                            </span>
                          )}
                        </div>
                        <form action={deleteGoal} className="recovery-goal-delete">
                          <input type="hidden" name="id" value={g.id} />
                          <button
                            type="submit"
                            aria-label="Delete goal"
                            className="recovery-goal-delete-btn"
                          >
                            ×
                          </button>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {completed.length > 0 && (
              <section className="recovery-section">
                <h2>
                  Completed
                  <span className="recovery-count">{completed.length}</span>
                </h2>
                <p className="recovery-section-intro">
                  Every completed goal is a real step. You did that.
                </p>
                <ul className="recovery-goals recovery-goals-completed">
                  {completed.map((g) => (
                    <li key={g.id} className="recovery-goal recovery-goal-done">
                      <form action={toggleGoal} className="recovery-goal-toggle">
                        <input type="hidden" name="id" value={g.id} />
                        <input type="hidden" name="completed" value="false" />
                        <button
                          type="submit"
                          aria-label="Mark as not completed"
                          className="recovery-goal-check recovery-goal-check-done"
                        >
                          ✓
                        </button>
                      </form>
                      <div className="recovery-goal-body">
                        <h3>{g.title}</h3>
                        {g.description && <p>{g.description}</p>}
                      </div>
                      <form action={deleteGoal} className="recovery-goal-delete">
                        <input type="hidden" name="id" value={g.id} />
                        <button
                          type="submit"
                          aria-label="Delete goal"
                          className="recovery-goal-delete-btn"
                        >
                          ×
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <p className="recovery-footnote">
          Recovery goals are private to your account. There are no streaks, no
          scores, and no penalties. Progress is not always visible, and that
          is okay.
        </p>
      </div>
    </main>
  );
}

export default function RecoveryPage() {
  return (
    <Suspense fallback={<RecoverySkeleton />}>
      <RecoveryContent />
    </Suspense>
  );
}