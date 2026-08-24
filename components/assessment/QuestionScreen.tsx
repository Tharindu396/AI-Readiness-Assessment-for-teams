import { Question, SCALE_LABELS } from "@/lib/questions";
import { LikertValue } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedValue,
  onAnswer,
  onBack,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedValue?: LikertValue;
  onAnswer: (value: LikertValue) => void;
  onBack?: () => void;
}) {
  return (
    <div key={question.id} className="animate-fade-slide-in">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <h1 className="mt-6 font-serif text-2xl leading-snug text-ink-950 sm:text-3xl">
        {question.prompt}
      </h1>

      <div className="mt-8 space-y-2.5" role="radiogroup" aria-label={question.prompt}>
        {SCALE_LABELS.map((scaleLabel, index) => {
          const value = (index + 1) as LikertValue;
          const selected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onAnswer(value)}
              className={`flex w-full items-center gap-4 rounded-lg border px-5 py-4 text-left transition-colors ${
                selected
                  ? "border-accent-500 bg-accent-50"
                  : "border-ink-200 hover:border-accent-300 hover:bg-accent-50/40"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  selected ? "bg-accent-600 text-white" : "bg-ink-100 text-ink-700"
                }`}
              >
                {value}
              </span>
              <span className="text-base text-ink-900">{scaleLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <p className="text-xs text-ink-300">Press 1–5 to answer</p>
      </div>
    </div>
  );
}
