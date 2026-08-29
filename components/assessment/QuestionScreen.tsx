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

      <h1 className="mt-8 font-serif text-2xl leading-snug text-ink-950 sm:text-3xl">
        {question.prompt}
      </h1>

      <div className="mt-8 space-y-3" role="radiogroup" aria-label={question.prompt}>
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
              className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                selected
                  ? "border-accent-500/50 bg-accent-500/10 shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                  : "border-surface-border bg-surface backdrop-blur-[16px] hover:border-surface-border-hover hover:bg-surface-hover"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  selected
                    ? "bg-gradient-accent text-white shadow-lg shadow-accent-600/30"
                    : "bg-ink-100 text-ink-700"
                }`}
              >
                {value}
              </span>
              <span className={`text-base ${selected ? "text-ink-950 font-medium" : "text-ink-900"}`}>
                {scaleLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs text-ink-300 backdrop-blur-[16px]">
          Press 1–5 to answer
        </span>
      </div>
    </div>
  );
}
