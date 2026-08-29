import { CreateAssessmentForm } from "./create-assessment-form";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
      <div className="max-w-prose">
        <p className="animate-fade-slide-in text-sm font-semibold uppercase tracking-widest text-accent-200">
          AI readiness assessment
        </p>
        <h1 className="mt-4 animate-fade-slide-in font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
          <span className="gradient-text">Readiness isn&apos;t usage.</span>
        </h1>
        <p className="mt-5 animate-fade-slide-in text-lg leading-relaxed text-ink-700 stagger-1">
          High usage with unclear policy is shadow AI risk. High access with low
          adoption is wasted spend. A ten-question pulse survey shows your org where
          that gap actually is, team by team.
        </p>
      </div>

      <div className="mt-14 max-w-xl animate-slide-up stagger-2">
        <h2 className="font-serif text-xl text-ink-950">Create an assessment</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Name your org, add your teams with headcount, and you&apos;ll get an invite
          link to share and a private dashboard link — no account needed.
        </p>
        <div className="mt-6">
          <CreateAssessmentForm />
        </div>
      </div>
    </main>
  );
}
