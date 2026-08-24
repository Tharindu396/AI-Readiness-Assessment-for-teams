"use client";

import { useCallback, useEffect, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { computeOverall, getBand, scoreAnswers, strongestAndWeakest } from "@/lib/scoring";
import { Answers, LikertValue, TeamRow } from "@/lib/types";
import { TeamPicker } from "@/components/assessment/TeamPicker";
import { QuestionScreen } from "@/components/assessment/QuestionScreen";
import { ResultScreen } from "@/components/assessment/ResultScreen";
import { Button } from "@/components/ui/Button";
import { submitAssessmentResponse } from "./actions";

const TOTAL_QUESTIONS = QUESTIONS.length;
const TEAM_STEP = 0;
const REVIEW_STEP = TOTAL_QUESTIONS + 1;

type SubmitState = "idle" | "submitting" | "error" | "done";

export function AssessmentFlow({
  orgId,
  orgName,
  teams,
}: {
  orgId: string;
  orgName: string;
  teams: TeamRow[];
}) {
  const [step, setStep] = useState(TEAM_STEP);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof scoreAnswers> | null>(null);

  const submit = useCallback(
    async (finalAnswers: Answers, selectedTeamId: string) => {
      setSubmitState("submitting");
      setErrorMessage(null);
      const outcome = await submitAssessmentResponse(orgId, selectedTeamId, finalAnswers);
      if (outcome.ok) {
        setResult(outcome.scores);
        setSubmitState("done");
      } else {
        setSubmitState("error");
        setErrorMessage(outcome.error);
      }
    },
    [orgId]
  );

  const answerQuestion = useCallback(
    (value: LikertValue) => {
      const question = QUESTIONS[step - 1];
      const nextAnswers = { ...answers, [question.id]: value };
      setAnswers(nextAnswers);

      if (step < TOTAL_QUESTIONS) {
        setStep(step + 1);
        return;
      }

      // Last question answered — every question is now present.
      setStep(REVIEW_STEP);
      submit(nextAnswers as Answers, teamId as string);
    },
    [answers, step, submit, teamId]
  );

  // Keyboard shortcut: number keys 1-5 answer the current question.
  useEffect(() => {
    if (step < 1 || step > TOTAL_QUESTIONS) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "5") {
        answerQuestion(Number(e.key) as LikertValue);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, answerQuestion]);

  if (step === TEAM_STEP) {
    return (
      <TeamPicker
        orgName={orgName}
        teams={teams}
        onSelect={(id) => {
          setTeamId(id);
          setStep(1);
        }}
      />
    );
  }

  if (step >= 1 && step <= TOTAL_QUESTIONS) {
    const question = QUESTIONS[step - 1];
    return (
      <QuestionScreen
        question={question}
        questionNumber={step}
        totalQuestions={TOTAL_QUESTIONS}
        selectedValue={answers[question.id]}
        onAnswer={answerQuestion}
        onBack={() => setStep(step === 1 ? TEAM_STEP : step - 1)}
      />
    );
  }

  // step === REVIEW_STEP
  if (submitState === "submitting" || submitState === "idle") {
    return (
      <div className="animate-fade-slide-in py-16 text-center">
        <p className="text-sm text-ink-500">Submitting your response…</p>
      </div>
    );
  }

  if (submitState === "error") {
    return (
      <div className="animate-fade-slide-in">
        <h1 className="font-serif text-2xl text-ink-950">Something went wrong</h1>
        <p className="mt-2 text-sm text-warning-700">{errorMessage}</p>
        <p className="mt-1 text-sm text-ink-500">
          Your answers are still here — you can try submitting again.
        </p>
        <Button
          className="mt-6"
          onClick={() => submit(answers as Answers, teamId as string)}
        >
          Try again
        </Button>
      </div>
    );
  }

  // submitState === "done"
  const scores = result!;
  const overall = computeOverall(scores);
  const { strongest, weakest } = strongestAndWeakest(scores);

  return (
    <ResultScreen
      scores={scores}
      overall={overall}
      band={getBand(overall)}
      strongest={strongest}
      weakest={weakest}
    />
  );
}
