import {
  PHQ9_ITEMS,
  GAD7_ITEMS,
  GHQ12_ITEMS,
  GHQ12_POSITIVELY_WORDED_INDEXES,
  type PHQ9Response,
  type GAD7Response,
  type GHQ12Response,
} from "./instruments";

export type SeverityBand =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately_severe"
  | "severe";

// ============================================================
// PHQ-9
// ============================================================

export type PHQ9Result = {
  totalScore: number;
  severity: SeverityBand;
  crisisFlag: boolean;
  responses: PHQ9Response[];
};

// Standard PHQ-9 severity bands.
// Source: Kroenke et al., 2001; PHQ Screeners (phqscreeners.com)
export function scoreBand(total: number): SeverityBand {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  if (total <= 19) return "moderately_severe";
  return "severe";
}

// Q9 is item index 8. Any answer of 1, 2, or 3 triggers the crisis pathway,
// regardless of total score.
export function evaluatePHQ9(responses: PHQ9Response[]): PHQ9Result {
  if (responses.length !== PHQ9_ITEMS.length) {
    throw new Error(
      `PHQ-9 requires ${PHQ9_ITEMS.length} responses, got ${responses.length}`
    );
  }

  const totalScore = responses.reduce<number>((sum, v) => sum + v, 0);
  const crisisFlag = responses[8] > 0;

  return {
    totalScore,
    severity: scoreBand(totalScore),
    crisisFlag,
    responses,
  };
}

// ============================================================
// GAD-7
// Source: Spitzer et al., 2006
// ============================================================

export type GAD7Result = {
  totalScore: number;
  severity: SeverityBand;
  responses: GAD7Response[];
};

// Standard GAD-7 severity bands.
export function scoreGAD7Band(total: number): SeverityBand {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  return "severe";
}

export function evaluateGAD7(responses: GAD7Response[]): GAD7Result {
  if (responses.length !== GAD7_ITEMS.length) {
    throw new Error(
      `GAD-7 requires ${GAD7_ITEMS.length} responses, got ${responses.length}`
    );
  }

  const totalScore = responses.reduce<number>((sum, v) => sum + v, 0);

  return {
    totalScore,
    severity: scoreGAD7Band(totalScore),
    responses,
  };
}

// ============================================================
// GHQ-12
// Source: Goldberg & Williams (1988)
// Bimodal 0-0-1-1 scoring; threshold >= 3 indicates probable distress.
// ============================================================

export type GHQ12Result = {
  ghqScore: number;
  rawScore: number;
  severity: SeverityBand;
  probableDistress: boolean;
  responses: GHQ12Response[];
};

function bimodalScoreItem(
  likertValue: GHQ12Response,
  reversed: boolean
): 0 | 1 {
  const adjusted = reversed ? (3 - likertValue) : likertValue;
  return adjusted >= 2 ? 1 : 0;
}

export function evaluateGHQ12(responses: GHQ12Response[]): GHQ12Result {
  if (responses.length !== GHQ12_ITEMS.length) {
    throw new Error(
      `GHQ-12 requires ${GHQ12_ITEMS.length} responses, got ${responses.length}`
    );
  }

  let ghqScore = 0;
  let rawScore = 0;

  responses.forEach((value, index) => {
    const isPositive = GHQ12_POSITIVELY_WORDED_INDEXES.has(index);
    ghqScore += bimodalScoreItem(value, isPositive);
    rawScore += isPositive ? 3 - value : value;
  });

  const probableDistress = ghqScore >= 3;

  return {
    ghqScore,
    rawScore,
    severity: probableDistress ? "moderate" : "minimal",
    probableDistress,
    responses,
  };
}