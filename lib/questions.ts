import { Dimension } from "./types";

export interface Question {
  id: string;
  dimension: Dimension;
  /** The statement a respondent rates from 1 (Strongly disagree) to 5 (Strongly agree). */
  prompt: string;
}

/** 1 = Strongly disagree ... 5 = Strongly agree, for every question. */
export const SCALE_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
] as const;

// Exactly 2 questions per dimension, in the fixed order respondents see them.
export const QUESTIONS: Question[] = [
  {
    id: "tooling_access_1",
    dimension: "tooling_access",
    prompt: "I have access to the AI tools I need to do my job well.",
  },
  {
    id: "tooling_access_2",
    dimension: "tooling_access",
    prompt:
      "Getting approval or access to a new AI tool at my organization is quick and straightforward.",
  },
  {
    id: "usage_depth_1",
    dimension: "usage_depth",
    prompt:
      "I use AI tools as part of my regular, day-to-day work, not just occasionally.",
  },
  {
    id: "usage_depth_2",
    dimension: "usage_depth",
    prompt: "I use AI for complex, high-value tasks, not just simple ones.",
  },
  {
    id: "skill_confidence_1",
    dimension: "skill_confidence",
    prompt:
      "I know how to write effective prompts to get useful results from AI tools.",
  },
  {
    id: "skill_confidence_2",
    dimension: "skill_confidence",
    prompt:
      "I can reliably tell when an AI tool's output is wrong or needs correction.",
  },
  {
    id: "policy_clarity_1",
    dimension: "policy_clarity",
    prompt:
      "I have clear guidance on what data I can and can't share with AI tools.",
  },
  {
    id: "policy_clarity_2",
    dimension: "policy_clarity",
    prompt:
      "I understand which AI tools are approved for use at my organization.",
  },
  {
    id: "workflow_integration_1",
    dimension: "workflow_integration",
    prompt:
      "AI tools are built into the systems and workflows I already use, not a separate step.",
  },
  {
    id: "workflow_integration_2",
    dimension: "workflow_integration",
    prompt:
      "My team has agreed norms for how and when to use AI in our shared work.",
  },
];
