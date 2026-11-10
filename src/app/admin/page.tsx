import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import PageLoader from "@/components/ui/page-loader";

async function Overview() {
  await connection();
  const check = await requireAdmin();
  if (!check.ok) return null;
  const { supabase } = check;

  const [
    articles,
    published,
    users,
    assessments,
    recoveryGoals,
    supportServices,
    verifiedServices,
  ] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("assessments").select("id", { count: "exact", head: true }),
    supabase
      .from("recovery_goals")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("support_resources")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("support_resources")
      .select("id", { count: "exact", head: true })
      .eq("verified", true)
      .eq("active", true),
  ]);

  const stats = [
    {
      label: "Articles",
      value: articles.count ?? 0,
      sub: `${published.count ?? 0} published`,
      href: "/admin/articles",
    },
    {
      label: "Users",
      value: users.count ?? 0,
      sub: "registered accounts",
      href: "/admin/users",
    },
    {
      label: "Assessments",
      value: assessments.count ?? 0,
      sub: "screening sessions recorded",
      href: null,
    },
    {
      label: "Recovery goals",
      value: recoveryGoals.count ?? 0,
      sub: "personal goals created",
      href: null,
    },
    {
      label: "Support services",
      value: supportServices.count ?? 0,
      sub: `${verifiedServices.count ?? 0} live in directory`,
      href: "/admin/support",
    },
  ];

  return (
    <div className="admin-stats">
      {stats.map((s) => (
        <div key={s.label} className="admin-stat">
          <p className="admin-stat-label">{s.label}</p>
          <p className="admin-stat-value">{s.value}</p>
          <p className="admin-stat-sub">{s.sub}</p>
          {s.href && (
            <Link href={s.href} className="admin-stat-link">
              Manage →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminHome() {
  return (
    <>
      <p className="admin-intro">
        Manage content and users. Changes take effect immediately on the public
        site.
      </p>
      <Suspense fallback={<PageLoader message="Loading stats…" />}>
        <Overview />
      </Suspense>
    </>
  );
}