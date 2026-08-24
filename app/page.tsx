import { CreateAssessmentForm } from "./create-assessment-form";

export default function Home() {
  return (
    <main className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
      <div className="max-w-prose">
        <p className="text-sm font-medium text-accent-600">AI readiness assessment</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink-950 sm:text-4xl">
          Readiness isn&apos;t usage.
        </h1>
        <p className="mt-4 text-lg text-ink-700">
          High usage with unclear policy is shadow AI risk. High access with low
          adoption is wasted spend. A ten-question pulse survey shows your org where
          that gap actually is, team by team.
        </p>
      </div>

      <div className="mt-12 max-w-xl">
        <h2 className="font-serif text-xl text-ink-950">Create an assessment</h2>
        <p className="mt-1 text-sm text-ink-500">
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
