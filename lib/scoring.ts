import { QUESTIONS } from "./questions";
import {
  ANONYMITY_FLOOR,
  Answers,
  Dimension,
  DIMENSIONS,
  DimensionScores,
  LikertValue,
  READINESS_BANDS,
  ReadinessBand,
} from "./types";

const QUESTION_IDS_BY_DIMENSION: Record<Dimension, string[]> = DIMENSIONS.reduce(
  (acc, dim) => {
    acc[dim] = QUESTIONS.filter((q) => q.dimension === dim).map((q) => q.id);
    return acc;
  },
  {} as Record<Dimension, string[]>
);

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Maps a 1-5 Likert answer onto the 0/25/50/75/100 scale. */
export function likertToScore(value: LikertValue): number {
  return (value - 1) * 25;
}

/**
 * Scores one respondent's raw answers into a 0-100 score per dimension.
 * Each dimension's score is the mean of its two mapped question scores.
 */
export function scoreAnswers(answers: Answers): DimensionScores {
  const result = {} as DimensionScores;

  for (const dimension of DIMENSIONS) {
    const questionIds = QUESTION_IDS_BY_DIMENSION[dimension];
    const questionScores = questionIds.map((id) => {
      const value = answers[id];
      if (value === undefined) {
        throw new Error(`Missing answer for question "${id}"`);
      }
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error(
          `Answer for question "${id}" must be an integer from 1 to 5, got ${value}`
        );
      }
      return likertToScore(value as LikertValue);
    });
    result[dimension] = mean(questionScores);
  }

  return result;
}

/** A respondent's, team's, or org's overall score: the mean of its 5 dimension scores. */
export function computeOverall(scores: DimensionScores): number {
  return mean(DIMENSIONS.map((d) => scores[d]));
}

/**
 * Maps a 0-100 score onto its readiness band. Scores are continuous (means of means),
 * so bands are treated as half-open intervals on their floor — [40, 60) is Emerging,
 * etc. — rather than matched against the integer min/max in READINESS_BANDS, which
 * would silently drop fractional scores like 79.17 between the Operational and
 * Advanced ranges.
 */
export function getBand(score: number): ReadinessBand {
  // Iterate from the highest floor down so the first match wins.
  for (let i = READINESS_BANDS.length - 1; i >= 0; i--) {
    if (score >= READINESS_BANDS[i].min) return READINESS_BANDS[i].band;
  }
  return "Nascent";
}

/** The dimension a respondent (or team, or org) scored highest and lowest on. Ties favor dimension order. */
export function strongestAndWeakest(scores: DimensionScores): {
  strongest: Dimension;
  weakest: Dimension;
} {
  let strongest: Dimension = DIMENSIONS[0];
  let weakest: Dimension = DIMENSIONS[0];

  for (const dimension of DIMENSIONS) {
    if (scores[dimension] > scores[strongest]) strongest = dimension;
    if (scores[dimension] < scores[weakest]) weakest = dimension;
  }

  return { strongest, weakest };
}

/** A team's per-dimension score: the mean of its respondents' per-dimension scores. */
export function aggregateTeamScores(
  respondentScores: DimensionScores[]
): DimensionScores {
  if (respondentScores.length === 0) {
    throw new Error("Cannot aggregate team scores from zero respondents");
  }

  const result = {} as DimensionScores;
  for (const dimension of DIMENSIONS) {
    result[dimension] = mean(respondentScores.map((r) => r[dimension]));
  }
  return result;
}

/** An org's overall score: the headcount-weighted mean of its teams' overall scores. */
export function aggregateOrgScore(
  teams: { overall: number; headcount: number }[]
): number {
  const totalHeadcount = teams.reduce((sum, t) => sum + t.headcount, 0);
  if (totalHeadcount === 0) {
    throw new Error("Cannot compute an org score when total headcount is 0");
  }
  const weightedSum = teams.reduce(
    (sum, t) => sum + t.overall * t.headcount,
    0
  );
  return weightedSum / totalHeadcount;
}

/** An org's per-dimension breakdown: the headcount-weighted mean of its teams' dimension scores. */
export function aggregateOrgDimensionScores(
  teams: { scores: DimensionScores; headcount: number }[]
): DimensionScores {
  const totalHeadcount = teams.reduce((sum, t) => sum + t.headcount, 0);
  if (totalHeadcount === 0) {
    throw new Error("Cannot compute org dimension scores when total headcount is 0");
  }

  const result = {} as DimensionScores;
  for (const dimension of DIMENSIONS) {
    const weightedSum = teams.reduce(
      (sum, t) => sum + t.scores[dimension] * t.headcount,
      0
    );
    result[dimension] = weightedSum / totalHeadcount;
  }
  return result;
}

/** Whether a team has enough responses for its scores to be shown, per the anonymity floor. */
export function meetsAnonymityFloor(responseCount: number): boolean {
  return responseCount >= ANONYMITY_FLOOR;
}

/** How many more responses a team needs before it clears the anonymity floor (0 if it already has). */
export function responsesNeededForFloor(responseCount: number): number {
  return Math.max(0, ANONYMITY_FLOOR - responseCount);
}

/** Participation rate as a 0-1 fraction: responses received over total headcount. */
export function participationRate(
  totalResponses: number,
  totalHeadcount: number
): number {
  if (totalHeadcount === 0) return 0;
  return totalResponses / totalHeadcount;
}
