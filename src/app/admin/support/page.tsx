import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { NewServiceForm } from "./new-form";
import { toggleVerify, toggleActive } from "./actions";

type Service = {
  id: string;
  name: string;
  service_type: string;
  region: string | null;
  phone: string | null;
  verified: boolean;
  active: boolean;
  created_at: string;
};

function SupportSkeleton() {
  return <p style={{ opacity: 0.4 }}>Loading services…</p>;
}

async function SupportList() {
  await connection();
  const check = await requireAdmin();
  if (!check.ok) return null;

  const { data } = await check.supabase
    .from("support_resources")
    .select(
      "id, name, service_type, region, phone, verified, active, created_at"
    )
    .order("created_at", { ascending: false });

  const services = (data ?? []) as Service[];

  return (
    <>
      <NewServiceForm />

      {services.length === 0 ? (
        <p className="admin-empty">
          No support services yet. Add the first one above.
        </p>
      ) : (
        <ul className="admin-articles">
          {services.map((s) => (
            <li key={s.id} className="admin-article-row">
              <div className="admin-article-main">
                <div className="admin-article-meta">
                  <span className="admin-badge">{s.service_type}</span>
                  {s.verified ? (
                    <span className="admin-badge admin-badge-live">
                      Verified
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge-draft">
                      Unverified
                    </span>
                  )}
                  {s.active ? (
                    <span className="admin-badge admin-badge-live">
                      Active
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge-draft">
                      Inactive
                    </span>
                  )}
                </div>
                <h3>{s.name}</h3>
                <p>
                  {s.region && <>{s.region} · </>}
                  {s.phone || "No phone"}
                </p>
              </div>
              <div className="admin-article-actions">
                <Link
                  href={`/admin/support/${s.id}`}
                  className="admin-btn admin-btn-secondary"
                >
                  Edit
                </Link>
                <form action={toggleVerify}>
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={(!s.verified).toString()}
                  />
                  <button
                    type="submit"
                    className={`admin-btn ${
                      s.verified
                        ? "admin-btn-secondary"
                        : "admin-btn-primary"
                    }`}
                  >
                    {s.verified ? "Unverify" : "Verify"}
                  </button>
                </form>
                <form action={toggleActive}>
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={(!s.active).toString()}
                  />
                  <button
                    type="submit"
                    className={`admin-btn ${
                      s.active
                        ? "admin-btn-secondary"
                        : "admin-btn-primary"
                    }`}
                  >
                    {s.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p
        style={{
          marginTop: 24,
          color: "#a2ada6",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        A service appears publicly only when it is both{" "}
        <strong>verified</strong> and <strong>active</strong>. Verify only
        after confirming the service is real, reachable, and appropriate to
        list.
      </p>
    </>
  );
}

export default function AdminSupportPage() {
  return (
    <>
      <p className="admin-intro">
        Manage the support directory. Services are reviewed, verified, and
        activated individually.
      </p>
      <Suspense fallback={<SupportSkeleton />}>
        <SupportList />
      </Suspense>
    </>
  );
}