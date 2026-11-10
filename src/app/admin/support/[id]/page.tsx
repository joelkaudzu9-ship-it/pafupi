import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import {
  updateSupportService,
  toggleVerify,
  toggleActive,
  deleteSupportService,
} from "../actions";
import { ServiceEditor } from "./editor";

type Params = Promise<{ id: string }>;

function EditorSkeleton() {
  return <p style={{ opacity: 0.4 }}>Loading editor…</p>;
}

async function EditorContent({ params }: { params: Params }) {
  await connection();
  const { id } = await params;

  const check = await requireAdmin();
  if (!check.ok) return null;

  const { data, error } = await check.supabase
    .from("support_resources")
    .select(
      "id, name, service_type, description, phone, email, website, address, region, hours, languages, verified, active"
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <>
      <div className="admin-editor-top">
        <Link href="/admin/support" className="admin-back">
          ← All services
        </Link>
        <div className="admin-editor-status">
          {data.verified ? (
            <span className="admin-badge admin-badge-live">Verified</span>
          ) : (
            <span className="admin-badge admin-badge-draft">Unverified</span>
          )}
          {data.active ? (
            <span className="admin-badge admin-badge-live">Active</span>
          ) : (
            <span className="admin-badge admin-badge-draft">Inactive</span>
          )}
          <form action={toggleVerify}>
            <input type="hidden" name="id" value={data.id} />
            <input
              type="hidden"
              name="next"
              value={(!data.verified).toString()}
            />
            <button
              type="submit"
              className={`admin-btn ${
                data.verified ? "admin-btn-secondary" : "admin-btn-primary"
              }`}
            >
              {data.verified ? "Unverify" : "Verify"}
            </button>
          </form>
          <form action={toggleActive}>
            <input type="hidden" name="id" value={data.id} />
            <input
              type="hidden"
              name="next"
              value={(!data.active).toString()}
            />
            <button
              type="submit"
              className={`admin-btn ${
                data.active ? "admin-btn-secondary" : "admin-btn-primary"
              }`}
            >
              {data.active ? "Deactivate" : "Activate"}
            </button>
          </form>
        </div>
      </div>

      <ServiceEditor service={data} />

      <div
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid #e6ebe5",
        }}
      >
        <form action={deleteSupportService}>
          <input type="hidden" name="id" value={data.id} />
          <button
            type="submit"
            className="admin-btn admin-btn-secondary"
            style={{ color: "#a14034" }}
          >
            Delete this service permanently
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminSupportEditPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorContent params={params} />
    </Suspense>
  );
}