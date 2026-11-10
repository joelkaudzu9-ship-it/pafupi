import type {
  PHQ9Result,
  GAD7Result,
  GHQ12Result,
  SeverityBand,
} from "./scoring";

export type NextStep = {
  title: string;
  description: string;
  tone: "info" | "support" | "clinical" | "urgent";
};

export type Interpretation = {
  headline: string;
  summary: string;
  nextSteps: NextStep[];
  showCrisisPathway: boolean;
};

// ============================================================
// PHQ-9 interpretation
// ============================================================

const BAND_HEADLINES: Record<SeverityBand, string> = {
  minimal: "Minimal or no depressive symptoms indicated",
  mild: "Mild depressive symptoms indicated",
  moderate: "Moderate depressive symptoms indicated",
  moderately_severe: "Moderately severe depressive symptoms indicated",
  severe: "Severe depressive symptoms indicated",
};

const BAND_SUMMARIES: Record<SeverityBand, string> = {
  minimal:
    "Your responses do not suggest significant symptoms of depression at this time. This does not rule out difficult feelings — you know your own experience best.",
  mild:
    "Your responses suggest some mild symptoms. Many people experience low moods from time to time, and support is available if things become harder.",
  moderate:
    "Your responses suggest moderate symptoms of depression. This is a sign that it may be helpful to talk to someone — a trusted person, a counsellor, or a health professional.",
  moderately_severe:
    "Your responses suggest moderately severe symptoms. Speaking with a qualified health professional is strongly recommended. You deserve support, and help is available.",
  severe:
    "Your responses suggest severe symptoms. Please consider speaking with a qualified health professional soon. If you also answered positively to thoughts of self-harm, please read the crisis information below carefully.",
};

export function interpretPHQ9(result: PHQ9Result): Interpretation {
  const nextSteps: NextStep[] = [];
  const showCrisisPathway = result.crisisFlag;

  if (result.crisisFlag) {
    nextSteps.push({
      title: "Speak to someone now",
      description:
        "You indicated thoughts of self-harm. This is not something to carry alone. Please reach out to a trusted person, a health professional, or an emergency service. If you are in immediate danger, contact local emergency services.",
      tone: "urgent",
    });
  }

  if (result.severity === "moderate" || result.severity === "mild") {
    nextSteps.push({
      title: "Talk to someone you trust",
      description:
        "Speaking with a friend, family member, counsellor, or health worker can help. You do not need to have everything figured out first.",
      tone: "support",
    });
    nextSteps.push({
      title: "Consider professional support",
      description:
        "If symptoms continue for more than two weeks, or affect your daily life, consider speaking with a qualified mental health professional.",
      tone: "clinical",
    });
  }

  if (
    result.severity === "moderately_severe" ||
    result.severity === "severe"
  ) {
    nextSteps.push({
      title: "Speak with a health professional",
      description:
        "The symptoms you have described are significant. Please speak with a qualified health professional, doctor, or mental health service as soon as you are able.",
      tone: "clinical",
    });
  }

  if (result.severity === "minimal" && !result.crisisFlag) {
    nextSteps.push({
      title: "Keep noticing how you feel",
      description:
        "Small daily check-ins can help you recognise changes early. Support is available if things become more difficult.",
      tone: "info",
    });
  }

  nextSteps.push({
    title: "This is a screening, not a diagnosis",
    description:
      "A PHQ-9 result indicates possible depressive symptoms. It is not a diagnosis of depression and does not replace a clinical assessment.",
    tone: "info",
  });

  return {
    headline: BAND_HEADLINES[result.severity],
    summary: BAND_SUMMARIES[result.severity],
    nextSteps,
    showCrisisPathway,
  };
}

// ============================================================
// GAD-7 interpretation
// ============================================================

const GAD7_BAND_HEADLINES: Record<SeverityBand, string> = {
  minimal: "Minimal or no anxiety symptoms indicated",
  mild: "Mild anxiety symptoms indicated",
  moderate: "Moderate anxiety symptoms indicated",
  moderately_severe: "Moderate anxiety symptoms indicated",
  severe: "Severe anxiety symptoms indicated",
};

const GAD7_BAND_SUMMARIES: Record<SeverityBand, string> = {
  minimal:
    "Your responses do not suggest significant symptoms of anxiety at this time. This does not rule out difficult feelings — you know your own experience best.",
  mild:
    "Your responses suggest some mild anxiety symptoms. Worry and tension are common, and support is available if things become harder.",
  moderate:
    "Your responses suggest moderate symptoms of anxiety. Speaking with someone you trust, or a qualified professional, may be helpful.",
  moderately_severe:
    "Your responses suggest moderate symptoms of anxiety. Speaking with someone you trust, or a qualified professional, may be helpful.",
  severe:
    "Your responses suggest severe symptoms of anxiety. Please consider speaking with a qualified health professional soon. Anxiety is treatable, and support is available.",
};

export function interpretGAD7(result: GAD7Result): Interpretation {
  const nextSteps: NextStep[] = [];

  if (result.severity === "mild" || result.severity === "moderate") {
    nextSteps.push({
      title: "Talk to someone you trust",
      description:
        "Speaking with a friend, family member, counsellor, or health worker can help. You do not need to have everything figured out first.",
      tone: "support",
    });
    nextSteps.push({
      title: "Consider professional support",
      description:
        "If symptoms continue for more than two weeks, or affect your daily life, consider speaking with a qualified mental health professional.",
      tone: "clinical",
    });
  }

  if (result.severity === "severe") {
    nextSteps.push({
      title: "Speak with a health professional",
      description:
        "The symptoms you have described are significant. Please speak with a qualified health professional, doctor, or mental health service as soon as you are able. Anxiety is treatable.",
      tone: "clinical",
    });
  }

  if (result.severity === "minimal") {
    nextSteps.push({
      title: "Keep noticing how you feel",
      description:
        "Small daily check-ins can help you recognise changes early. Support is available if things become more difficult.",
      tone: "info",
    });
  }

  nextSteps.push({
    title: "This is a screening, not a diagnosis",
    description:
      "A GAD-7 result indicates possible anxiety symptoms. It is not a diagnosis of an anxiety disorder and does not replace a clinical assessment.",
    tone: "info",
  });

  return {
    headline: GAD7_BAND_HEADLINES[result.severity],
    summary: GAD7_BAND_SUMMARIES[result.severity],
    nextSteps,
    showCrisisPathway: false,
  };
}

// ============================================================
// GHQ-12 interpretation
// ============================================================

export function interpretGHQ12(result: GHQ12Result): Interpretation {
  const nextSteps: NextStep[] = [];

  if (result.probableDistress) {
    nextSteps.push({
      title: "Consider speaking with someone",
      description:
        "Your responses indicate probable psychological distress. Speaking with a trusted person, counsellor, or health worker can help you understand what you are experiencing.",
      tone: "support",
    });
    nextSteps.push({
      title: "Professional support is available",
      description:
        "If the distress continues, or affects your daily life, speaking with a qualified mental health professional is recommended. Support is available, and it is okay to ask for it.",
      tone: "clinical",
    });
  } else {
    nextSteps.push({
      title: "Keep noticing how you feel",
      description:
        "Your responses do not indicate significant current distress. Small daily check-ins can help you recognise changes early. Support is available if things become more difficult.",
      tone: "info",
    });
  }

  nextSteps.push({
    title: "This is a screening, not a diagnosis",
    description:
      "The GHQ-12 is a screening tool for general psychological distress. It is not a diagnosis, and it does not identify specific conditions. It does not replace a clinical assessment.",
    tone: "info",
  });

  return {
    headline: result.probableDistress
      ? "Probable psychological distress indicated"
      : "No significant psychological distress indicated",
    summary: result.probableDistress
      ? "Your responses suggest that you may be experiencing psychological distress. This is a screening outcome — it does not mean you have a specific condition — but it is a signal that support may be helpful right now."
      : "Your responses do not suggest significant psychological distress at this time. This does not rule out difficult feelings — you know your own experience best.",
    nextSteps,
    showCrisisPathway: false,
  };
}