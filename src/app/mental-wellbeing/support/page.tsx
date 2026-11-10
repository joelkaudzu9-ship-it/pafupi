import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./support.css";

export const metadata = {
  title: "Finding support",
  description:
    "Verified support services and clear guidance on when to seek help. Not an emergency service.",
};

type Resource = {
  id: string;
  name: string;
  description: string | null;
  service_type: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  region: string | null;
  languages: string[] | null;
  hours: string | null;
};

function SupportSkeleton() {
  return (
    <main className="support-page">
      <div className="support-container">
        <p style={{ opacity: 0.4 }}>Loading services…</p>
      </div>
    </main>
  );
}

async function SupportInner() {
  await connection();
  const supabase = await createClient();

  const { data } = await supabase
    .from("support_resources")
    .select(
      "id, name, description, service_type, phone, email, website, address, region, languages, hours"
    )
    .eq("verified", true)
    .eq("active", true)
    .order("name");

  const resources = (data ?? []) as Resource[];

  return (
    <main className="support-page">
      <div className="support-container">
        <Link href="/mental-wellbeing" className="support-back">
          ← Mental wellbeing
        </Link>

        <header className="support-hero">
          <p className="support-eyebrow">FINDING SUPPORT</p>
          <h1>Sometimes, talking to someone can make a difference.</h1>
          <p className="support-intro">
            Support comes in many forms — a trusted friend, a counsellor, a
            health worker, or a specialist service. You don&apos;t have to have
            a diagnosis to reach out. You deserve support.
          </p>
        </header>

        <div className="support-emergency">
          <span className="support-emergency-icon" aria-hidden="true">
            !
          </span>
          <div>
            <strong>If you are in immediate danger</strong>, contact local
            emergency services or go to the nearest health facility. PAFUPI is
            not an emergency response service, and cannot contact anyone on
            your behalf.
          </div>
        </div>

        <section className="support-tier">
          <h2>Start here</h2>
          <p className="support-tier-intro">
            Support doesn&apos;t have to start with a professional. It can
            start with a person you trust.
          </p>

          <div className="support-tiers">
            <article className="support-tier-card">
              <h3>Someone you trust</h3>
              <p>
                A friend, family member, teacher, faith leader, or colleague.
                Sometimes the most important first step is telling one person
                how you are feeling.
              </p>
            </article>

            <article className="support-tier-card">
              <h3>A health worker</h3>
              <p>
                A nurse, clinical officer, or doctor. Community health workers
                and clinic staff can listen, help you understand what you are
                experiencing, and refer you to appropriate services.
              </p>
            </article>

            <article className="support-tier-card">
              <h3>A specialist service</h3>
              <p>
                A counsellor, psychologist, psychiatrist, or community mental
                health team. For ongoing mental health support or when symptoms
                are affecting daily life.
              </p>
            </article>
          </div>
        </section>

        <section className="support-tier">
          <h2>Verified services</h2>
          <p className="support-tier-intro">
            These services have been checked for accuracy. Availability and
            hours may change — please confirm directly before travelling.
          </p>

          {resources.length === 0 ? (
            <div className="support-empty">
              <h3>Directory in development</h3>
              <p>
                PAFUPI is building a verified directory of mental health
                services in Malawi. Every service will be checked before it
                appears here. In the meantime, contact your nearest health
                facility for guidance.
              </p>
            </div>
          ) : (
            <ul className="support-services">
              {resources.map((r) => (
                <li key={r.id} className="support-service">
                  <div className="support-service-header">
                    <h3>{r.name}</h3>
                    <span className="support-service-type">
                      {r.service_type.replace("_", " ")}
                    </span>
                  </div>
                  {r.description && (
                    <p className="support-service-desc">{r.description}</p>
                  )}
                  <div className="support-service-meta">
                    {r.phone && (
                      <span>
                        <strong>Phone:</strong> {r.phone}
                      </span>
                    )}
                    {r.email && (
                      <span>
                        <strong>Email:</strong> {r.email}
                      </span>
                    )}
                    {r.website && (
                      <span>
                        <strong>Web:</strong>{" "}
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.website}
                        </a>
                      </span>
                    )}
                    {r.address && (
                      <span>
                        <strong>Address:</strong> {r.address}
                      </span>
                    )}
                    {r.region && (
                      <span>
                        <strong>Region:</strong> {r.region}
                      </span>
                    )}
                    {r.hours && (
                      <span>
                        <strong>Hours:</strong> {r.hours}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="support-tier">
          <h2>What to expect when you reach out</h2>
          <p className="support-tier-intro">
            It is normal to feel uncertain about contacting a service. Here is
            what usually happens.
          </p>
          <ul className="support-what-to-expect">
            <li>
              <strong>You will be asked some questions</strong> about how you
              are feeling and what is happening. You do not have to answer
              everything.
            </li>
            <li>
              <strong>You will not be judged.</strong> Professional services
              are confidential and designed to help.
            </li>
            <li>
              <strong>You can ask what happens next</strong> and what your
              options are. You can also say no.
            </li>
            <li>
              <strong>You can take someone with you</strong> if you would feel
              more comfortable.
            </li>
          </ul>
        </section>

        <p className="support-footnote">
          This directory lists services that have been reviewed for accuracy at
          the time of listing. If you notice a problem with a listing, please
          contact PAFUPI. PAFUPI does not provide clinical care and is not
          responsible for services listed.
        </p>
      </div>
    </main>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<SupportSkeleton />}>
      <SupportInner />
    </Suspense>
  );
}