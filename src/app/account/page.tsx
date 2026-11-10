import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PageLoader from "@/components/ui/page-loader";

export const metadata = {
  title: "Your account",
};

async function AccountContent() {
  await connection();

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const [checkInsRes, goalsRes, lastAssessmentRes] = await Promise.all([
    supabase
      .from("mood_checkins")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("recovery_goals")
      .select("completed")
      .eq("user_id", user.id),
    supabase
      .from("assessments")
      .select("instrument, total_score, severity_band, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const checkInCount = checkInsRes.count ?? 0;
  const goals = (goalsRes.data ?? []) as { completed: boolean }[];
  const activeGoals = goals.filter((g) => !g.completed).length;
  const completedGoals = goals.filter((g) => g.completed).length;
  const lastAssessment = lastAssessmentRes.data;

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "friend";

  return (
    <main className="account-page">
      <div className="account-container">
        <p className="account-eyebrow">YOUR SPACE</p>
        <h1>Welcome, {displayName}.</h1>
        <p className="account-intro">
          This is your private space. Only you can see what lives here.
        </p>

        <div className="account-stats">
          <div className="account-stat">
            <p className="account-stat-label">Check-ins</p>
            <p className="account-stat-value">{checkInCount}</p>
          </div>
          <div className="account-stat">
            <p className="account-stat-label">Active goals</p>
            <p className="account-stat-value">{activeGoals}</p>
          </div>
          <div className="account-stat">
            <p className="account-stat-label">Completed goals</p>
            <p className="account-stat-value">{completedGoals}</p>
          </div>
        </div>

        {lastAssessment && (
          <Link
            href="/mental-wellbeing/screening/history"
            className="account-last-screening"
          >
            <div>
              <p className="account-last-eyebrow">LAST SCREENING</p>
              <p className="account-last-body">
                <strong>{lastAssessment.instrument.toUpperCase()}</strong> ·
                Score {lastAssessment.total_score} ·{" "}
                {lastAssessment.severity_band.replace("_", " ")}
              </p>
            </div>
            <span className="account-last-arrow">→</span>
          </Link>
        )}

        <div className="account-grid">
          <Link href="/account/check-ins" className="account-tile">
            <span className="account-tile-icon">♡</span>
            <h2>Check-ins</h2>
            <p>See your private check-in history, or add a new one.</p>
          </Link>

          <Link href="/account/recovery" className="account-tile">
            <span className="account-tile-icon">✳</span>
            <h2>Recovery</h2>
            <p>Personal goals and coping strategies.</p>
          </Link>

          <Link href="/mental-wellbeing/screening" className="account-tile">
            <span className="account-tile-icon">◈</span>
            <h2>Screening</h2>
            <p>PHQ-9, GAD-7 and GHQ-12 questionnaires.</p>
          </Link>

          <Link href="/mental-wellbeing" className="account-tile">
            <span className="account-tile-icon">◉</span>
            <h2>Mental wellbeing</h2>
            <p>Explore resources and understanding.</p>
          </Link>
        </div>

        <div className="account-meta">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {profile?.role ?? "user"}
          </p>
        </div>

        <form action="/auth/signout" method="post">
          <button type="submit" className="account-signout">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading your space…" />}>
      <AccountContent />
    </Suspense>
  );
}