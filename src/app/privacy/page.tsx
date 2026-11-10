import type { Metadata } from "next";
import Link from "next/link";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy & safeguarding",
  description:
    "How PAFUPI handles your information, respects your privacy, and keeps you safe. What we collect, what we never do, and where to raise a concern.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <p className="privacy-eyebrow">PRIVACY & SAFEGUARDING</p>
          <h1>Your privacy and safety matter.</h1>
          <p className="privacy-intro">
            PAFUPI exists to help people find support without fear. This page
            explains what we do, what we never do, and how to raise a concern.
            It&apos;s written to be read, not skimmed past.
          </p>
        </header>

        <section className="privacy-section">
          <h2>What PAFUPI is</h2>
          <p>
            PAFUPI is a digital platform for mental wellbeing, understanding,
            and connection to support. It offers education, optional
            check-ins, screening questionnaires, and information about where
            to find human support.
          </p>
          <p>
            PAFUPI is <strong>not</strong> a crisis line, emergency service,
            medical provider, or substitute for professional care. If you are
            in immediate danger, contact local emergency services.
          </p>
        </section>

        <section className="privacy-section">
          <h2>What we collect</h2>
          <p>We collect only what is needed to deliver the service:</p>
          <ul>
            <li>
              <strong>Account information</strong> — email, display name, and a
              hashed password. We never store your password in plain text.
            </li>
            <li>
              <strong>Your activity</strong> — check-ins, screening results,
              and recovery goals you choose to save. These are private to your
              account and never visible to other users.
            </li>
            <li>
              <strong>Basic technical information</strong> — errors and page
              loads for reliability. No third-party advertising trackers.
            </li>
          </ul>
          <p>
            <strong>Guest use is allowed.</strong> You can browse education,
            complete screening anonymously, and read without an account. Guest
            screening results are not stored.
          </p>
        </section>

        <section className="privacy-section">
          <h2>What we never do</h2>
          <ul>
            <li>
              <strong>Never sell your data.</strong> We don&apos;t sell,
              rent, or trade personal information.
            </li>
            <li>
              <strong>
                Never share your check-ins or screening results with third
                parties
              </strong>{" "}
              without your explicit consent, except where legally required.
            </li>
            <li>
              <strong>Never promise monitoring we don&apos;t provide.</strong>{" "}
              PAFUPI is not monitored. When you submit a questionnaire, no
              human is reviewing it in real time.
            </li>
            <li>
              <strong>Never use your mental health information</strong> to
              target advertising, predict behaviour for commercial purposes,
              or make automated decisions.
            </li>
            <li>
              <strong>Never require location tracking.</strong> We do not
              request or infer your location.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>How we protect your information</h2>
          <p>
            Your account data is stored in a secure database with row-level
            access controls, so that only you can read your private records.
            Data is encrypted in transit. Access is restricted to operations
            strictly necessary to keep the platform running.
          </p>
          <p>
            You can delete your account at any time. Deleting your account
            deletes your check-ins, screening results, and recovery goals.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Screening — important limits</h2>
          <p>
            Questionnaires like the PHQ-9 are{" "}
            <strong>screening tools</strong>, not diagnoses. A score indicates
            possible symptoms. A low score does not rule out a condition, and a
            high score does not confirm one. Only a qualified professional can
            diagnose.
          </p>
          <p>
            If you indicate thoughts of self-harm on a screening, the platform
            shows you crisis information immediately. It does not contact
            anyone on your behalf.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Safeguarding</h2>
          <p>
            PAFUPI takes safeguarding seriously, especially for young people
            and other vulnerable groups. The platform does not currently offer
            open peer-to-peer chat or unmoderated community features, because
            these require trained moderators and clear escalation procedures.
          </p>
          <p>
            When community features are introduced, they will be moderated,
            have clear rules, and offer reporting options. Safeguarding takes
            priority over growth.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Your rights</h2>
          <ul>
            <li>You can access, export, or delete your data at any time.</li>
            <li>You can use the platform anonymously without an account.</li>
            <li>
              You can contact PAFUPI to correct inaccurate information or
              raise a concern.
            </li>
          </ul>
        </section>

        <section className="privacy-section privacy-final">
          <h2>If you need urgent help</h2>
          <p>
            PAFUPI cannot respond to emergencies. If you or someone else is in
            immediate danger:
          </p>
          <ul>
            <li>Contact local emergency services.</li>
            <li>Go to the nearest health facility.</li>
            <li>Tell a trusted person nearby.</li>
          </ul>
        </section>

        <div className="privacy-actions">
          <Link href="/" className="privacy-btn">
            Back to PAFUPI
          </Link>
          <Link
            href="/mental-wellbeing"
            className="privacy-btn privacy-btn-secondary"
          >
            Mental wellbeing
          </Link>
        </div>

        <p className="privacy-footer">
          This page is a plain-language summary. It is not a substitute for
          the full privacy policy, which is being developed alongside legal
          and safeguarding review for the PAFUPI platform.
        </p>
      </div>
    </main>
  );
}