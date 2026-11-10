import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/admin";

type UserRow = {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

function UsersSkeleton() {
  return <p style={{ opacity: 0.4 }}>Loading users…</p>;
}

async function UsersList() {
  await connection();
  const check = await requireAdmin();
  if (!check.ok) return null;

  const { data } = await check.supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const users = (data ?? []) as UserRow[];

  if (users.length === 0) {
    return <p className="admin-empty">No users yet.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Display name</th>
          <th>Role</th>
          <th>Joined</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.display_name ?? "—"}</td>
            <td>
              <span
                className={`admin-badge ${
                  u.role === "admin"
                    ? "admin-badge-live"
                    : u.role === "clinician"
                    ? "admin-badge-clinician"
                    : "admin-badge-draft"
                }`}
              >
                {u.role}
              </span>
            </td>
            <td>
              {new Date(u.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td className="admin-table-mono">
              {u.id.slice(0, 8)}…
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminUsersPage() {
  return (
    <>
      <p className="admin-intro">
        Read-only view of registered accounts. Role changes are made via
        Supabase SQL for now.
      </p>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersList />
      </Suspense>
    </>
  );
}