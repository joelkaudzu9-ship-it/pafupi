import type { Metadata } from "next";
import Link from "next/link";
import "./coping.css";

export const metadata: Metadata = {
  title: "Coping strategies",
  description:
    "Practical grounding and coping strategies. Not clinical advice — informational only.",
};

const STRATEGIES = [
  {
    title: "Grounding: 5-4-3-2-1",
    description:
      "When thoughts feel overwhelming, slowly name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This brings attention back to the present moment.",
    category: "Grounding",
  },
  {
    title: "Box breathing",
    description:
      "Breathe in for 4 seconds, hold for 4, breathe out for 4, hold for 4. Repeat 4 times. This slow, even rhythm can settle a racing heart or a spinning mind.",
    category: "Breathwork",
  },
  {
    title: "Name the feeling",
    description:
      "Sometimes simply naming what you feel — sad, angry, scared, tired — reduces its intensity. You don't have to fix the feeling. You can just notice it.",
    category: "Awareness",
  },
  {
    title: "Write one sentence",
    description:
      "You don't have to journal a page. Write one honest sentence about how you feel. That's enough. Close the notebook. Move on with your day.",
    category: "Expression",
  },
  {
    title: "Physical movement",
    description:
      "A short walk, stretching, dancing to one song, shaking out your arms. Movement changes what the body is doing, which can change what the mind is doing.",
    category: "Body",
  },
  {
    title: "Reach for one person",
    description:
      "You don't have to explain everything. A single message — \"I'm having a hard day\" — can be a first step. You don't have to carry it alone.",
    category: "Connection",
  },
  {
    title: "Reduce the load",
    description:
      "On hard days, ask yourself: what could wait? What could be smaller? What could be asked for? Doing less, deliberately, is not failure.",
    category: "Boundaries",
  },
  {
    title: "Delay the decision",
    description:
      "When you feel overwhelmed, you don't have to decide today. Say to yourself: \"I will decide this tomorrow.\" Most decisions can wait one day.",
    category: "Pacing",
  },
];

export default function CopingPage() {
  return (
    <main className="coping-page">
      <div className="coping-container">
        <Link href="/account/recovery" className="coping-back">
          ← Your recovery
        </Link>

        <header className="coping-header">
          <p className="coping-eyebrow">COPING STRATEGIES</p>
          <h1>Small things that can help.</h1>
          <p className="coping-intro">
            These are practical, evidence-informed strategies you can try
            when things feel difficult. They are not a cure, and they are not
            a replacement for professional care. They are small tools you can
            keep in your pocket.
          </p>
        </header>

        <div className="coping-grid">
          {STRATEGIES.map((s) => (
            <article key={s.title} className="coping-card">
              <span className="coping-card-category">{s.category}</span>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
            </article>
          ))}
        </div>

        <p className="coping-footnote">
          These strategies are for general wellbeing. If you feel unsafe, or
          if things feel unmanageable, please contact local emergency services
          or a qualified health professional. PAFUPI is not an emergency
          service.
        </p>
      </div>
    </main>
  );
}