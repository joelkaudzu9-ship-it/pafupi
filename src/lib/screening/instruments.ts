// PHQ-9 instrument definition
// Source: Kroenke, Spitzer & Williams (2001), Journal of General Internal Medicine
// Clinical review required before production use.
// This is a screening instrument — it does NOT diagnose depression.

export type PHQ9Response = 0 | 1 | 2 | 3;

export type PHQ9Item = {
  index: number;
  text: string;
  // Q9 is the critical safety item. The engine treats it specially.
  isCrisisItem?: boolean;
};

export const PHQ9_INSTRUMENT = {
  id: "phq9" as const,
  name: "PHQ-9",
  fullName: "Patient Health Questionnaire-9",
  purpose: "Depressive symptoms over the last two weeks",
  timeframe: "Over the last 2 weeks",
  itemCount: 9,
  maxScore: 27,
};

export const PHQ9_OPTIONS: {
  value: PHQ9Response;
  label: string;
  shortLabel: string;
}[] = [
  { value: 0, label: "Not at all", shortLabel: "0" },
  { value: 1, label: "Several days", shortLabel: "1" },
  { value: 2, label: "More than half the days", shortLabel: "2" },
  { value: 3, label: "Nearly every day", shortLabel: "3" },
];

export const PHQ9_ITEMS: PHQ9Item[] = [
  {
    index: 0,
    text: "Little interest or pleasure in doing things",
  },
  {
    index: 1,
    text: "Feeling down, depressed, or hopeless",
  },
  {
    index: 2,
    text: "Trouble falling or staying asleep, or sleeping too much",
  },
  {
    index: 3,
    text: "Feeling tired or having little energy",
  },
  {
    index: 4,
    text: "Poor appetite or overeating",
  },
  {
    index: 5,
    text:
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  },
  {
    index: 6,
    text:
      "Trouble concentrating on things, such as reading the newspaper or watching television",
  },
  {
    index: 7,
    text:
      "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  },
  {
    index: 8,
    text:
      "Thoughts that you would be better off dead, or of hurting yourself in some way",
    isCrisisItem: true,
  },
];

// ============================================================
// GAD-7 — Generalised Anxiety Disorder-7
// Source: Spitzer, Kroenke, Williams & Löwe (2006), Archives of Internal Medicine
// Clinical review required before production use.
// ============================================================

export type GAD7Response = 0 | 1 | 2 | 3;

export type GAD7Item = {
  index: number;
  text: string;
};

export const GAD7_INSTRUMENT = {
  id: "gad7" as const,
  name: "GAD-7",
  fullName: "Generalised Anxiety Disorder-7",
  purpose: "Anxiety symptoms over the last two weeks",
  timeframe: "Over the last 2 weeks",
  itemCount: 7,
  maxScore: 21,
};

export const GAD7_OPTIONS: {
  value: GAD7Response;
  label: string;
  shortLabel: string;
}[] = [
  { value: 0, label: "Not at all", shortLabel: "0" },
  { value: 1, label: "Several days", shortLabel: "1" },
  { value: 2, label: "More than half the days", shortLabel: "2" },
  { value: 3, label: "Nearly every day", shortLabel: "3" },
];

export const GAD7_ITEMS: GAD7Item[] = [
  {
    index: 0,
    text: "Feeling nervous, anxious, or on edge",
  },
  {
    index: 1,
    text: "Not being able to stop or control worrying",
  },
  {
    index: 2,
    text: "Worrying too much about different things",
  },
  {
    index: 3,
    text: "Trouble relaxing",
  },
  {
    index: 4,
    text: "Being so restless that it is hard to sit still",
  },
  {
    index: 5,
    text: "Becoming easily annoyed or irritable",
  },
  {
    index: 6,
    text: "Feeling afraid, as if something awful might happen",
  },
];

// ============================================================
// GHQ-12 — General Health Questionnaire-12
// Source: Goldberg & Williams (1988), NFER-Nelson
// NOTE: GHQ-12 is under copyright in some jurisdictions.
// Confirm licensing with the client's clinical advisor before deployment.
// Clinical review required before production use.
//
// We use the standard bimodal response format.
// Scoring method used here: bimodal 0-0-1-1 (GHQ method).
// Alternative Likert scoring: 0-1-2-3 (raw).
// ============================================================

// Response values are stored as the Likert positions (0–3) so the
// persisted data is consistent with PHQ-9 and GAD-7. The bimodal
// score is derived at scoring time.
export type GHQ12Response = 0 | 1 | 2 | 3;

export type GHQ12Item = {
  index: number;
  text: string;
  // Standard GHQ bimodal mapping. Most items score 0 for "better than
  // usual"/"same as usual" and 1 for "less than usual"/"much less than usual".
  // Four positively-worded items are reverse-scored: they score 1 for
  // "better than usual".
  // See scoreGHQ12() in scoring.ts for the mapping.
};

export const GHQ12_INSTRUMENT = {
  id: "ghq12" as const,
  name: "GHQ-12",
  fullName: "General Health Questionnaire-12",
  purpose: "General psychological distress over the last few weeks",
  timeframe: "Over the past few weeks",
  itemCount: 12,
  maxScore: 12, // Bimodal max (each item scores 0 or 1)
};

// The four response options for each item differ slightly in wording
// depending on whether the item is positively or negatively framed.
// To keep the UI simple and consistent, we present the standard
// bidirectional wording used in most self-administered versions.
export const GHQ12_OPTIONS: {
  value: GHQ12Response;
  label: string;
  shortLabel: string;
}[] = [
  { value: 0, label: "Better than usual", shortLabel: "0" },
  { value: 1, label: "Same as usual", shortLabel: "1" },
  { value: 2, label: "Less than usual", shortLabel: "2" },
  { value: 3, label: "Much less than usual", shortLabel: "3" },
];

export const GHQ12_ITEMS: GHQ12Item[] = [
  {
    index: 0,
    text: "Been able to concentrate on whatever you're doing",
  },
  {
    index: 1,
    text: "Lost much sleep over worry",
  },
  {
    index: 2,
    text: "Felt that you were playing a useful part in things",
  },
  {
    index: 3,
    text: "Felt capable of making decisions about things",
  },
  {
    index: 4,
    text: "Felt constantly under strain",
  },
  {
    index: 5,
    text: "Felt you couldn't overcome your difficulties",
  },
  {
    index: 6,
    text: "Been able to enjoy your normal day-to-day activities",
  },
  {
    index: 7,
    text: "Been able to face up to your problems",
  },
  {
    index: 8,
    text: "Been feeling unhappy and depressed",
  },
  {
    index: 9,
    text: "Been losing confidence in yourself",
  },
  {
    index: 10,
    text: "Been thinking of yourself as a worthless person",
  },
  {
    index: 11,
    text: "Been feeling reasonably happy, all things considered",
  },
];

// Items 0, 2, 3, 6, 7, 11 are positively-worded (a HIGHER answer
// means LESS distress for those items). All other items are
// negatively-worded (a HIGHER answer means MORE distress).
// This is used by the scorer to apply reverse-scoring where needed.
export const GHQ12_POSITIVELY_WORDED_INDEXES = new Set([0, 2, 3, 6, 7, 11]);