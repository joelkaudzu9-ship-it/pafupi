import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "./nav";
import PageLoader from "@/components/ui/page-loader";
import "./admin.css";

export const metadata = {
  title: "Admin",
};

async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection();
  const check = await requireAdmin();

  if (!check.ok) {
    if (check.reason === "unauthenticated") {
      redirect("/login?next=/admin");
    }
    redirect("/");
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">PAFUPI ADMIN</p>
            <h1>Control centre</h1>
          </div>
          <Link href="/" className="admin-exit">
            ← Back to site
          </Link>
        </div>
        <AdminNav />
        {children}
      </div>
    </main>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoader message="Checking access…" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}