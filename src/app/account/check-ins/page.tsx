import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteCheckInButton } from "./delete-button";
import "./check-ins.css";

export const metadata = {
  title: "Your check-ins",
};

type CheckIn = {
  id: string;
  mood: number;
  note: string | null;
  checked_in_at: string;
};

const MOOD_META: Record<number, { label: string; emoji: string }> = {
  1: { label: "Very low", emoji: "😔" },
  2: { label: "Low", emoji: "😕" },
  3: { label: "Okay", emoji: "😐" },
  4: { label: "Good", emoji: "🙂" },
  5: { label: "Very good", emoji: "😊" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CheckInsSkeleton() {
  return (
    <main className="checkins-page">
      <div className="checkins-container" aria-hidden="true">
        <p style={{ opacity: 0.4 }}>Loading your check-ins…</p>
      </div>
    </main>
  );
}

async function CheckInsContent() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/check-ins");

  const { data, error } = await supabase
    .from("mood_checkins")
    .select("id, mood, note, checked_in_at")
    .eq("user_id", user.id)
    .order("checked_in_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main className="checkins-page">
        <div className="checkins-container">
          <Link href="/account" className="checkins-back">
            ← Your account
          </Link>
          <h1>Your check-ins</h1>
          <p style={{ color: "#a14034" }}>
            We couldn&apos;t load your check-ins right now. Please try again
            later.
          </p>
        </div>
      </main>
    );
  }

  const checkIns = (data ?? []) as CheckIn[];

  return (
    <main className="checkins-page">
      <div className="checkins-container">
        <Link href="/account" className="checkins-back">
          ← Your account
        </Link>

        <div className="checkins-header">
          <div>
            <p className="checkins-eyebrow">PRIVATE HISTORY</p>
            <h1>Your check-ins</h1>
            <p className="checkins-intro">
              A quiet record of the moments you took to notice how you were
              feeling. Only visible to you.
            </p>
          </div>
          <Link
            href="/mental-wellbeing/check-in"
            className="checkins-new-btn"
          >
            New check-in →
          </Link>
        </div>

        {checkIns.length === 0 ? (
          <div className="checkins-empty">
            <span className="checkins-empty-symbol">♡</span>
            <h2>No check-ins yet</h2>
            <p>
              When you complete a check-in, it will appear here. There&apos;s
              no pressure to check in regularly.
            </p>
            <Link
              href="/mental-wellbeing/check-in"
              className="checkins-new-btn"
            >
              Start your first check-in →
            </Link>
          </div>
        ) : (
          <ul className="checkins-list">
            {checkIns.map((entry) => {
              const meta = MOOD_META[entry.mood] ?? {
                label: "Unknown",
                emoji: "·",
              };
              return (
                <li key={entry.id} className="checkins-item">
                  <div className="checkins-item-emoji" aria-hidden="true">
                    {meta.emoji}
                  </div>
                  <div className="checkins-item-body">
                    <div className="checkins-item-head">
                      <strong>{meta.label}</strong>
                      <span className="checkins-item-date">
                        {formatDate(entry.checked_in_at)} ·{" "}
                        {formatTime(entry.checked_in_at)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="checkins-item-note">{entry.note}</p>
                    )}
                  </div>
                  <DeleteCheckInButton id={entry.id} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function CheckInsPage() {
  return (
    <Suspense fallback={<CheckInsSkeleton />}>
      <CheckInsContent />
    </Suspense>
  );
}