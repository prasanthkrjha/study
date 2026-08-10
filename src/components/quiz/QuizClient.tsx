"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ChevronRight, Layers } from "lucide-react";
import { buildQuizIndex, type QuizQuestion } from "@/lib/quiz";
import { syllabus } from "@/lib/data";
import { Card } from "@/components/shared/Card";

type Grade = "know" | "review";

interface SessionState {
  questions: QuizQuestion[];
  current: number;
  revealed: boolean;
  grades: Grade[];
  done: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ModuleSelector({ onSelect }: { onSelect: (moduleNumber: number | null) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcard Quiz</h1>
        <p className="mt-1 text-sm text-muted">
          Self-graded Q&amp;A from lesson content. Pick a module or quiz across all lessons.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => onSelect(null)}
          className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/5 p-4 text-left transition hover:bg-accent/10"
        >
          <Layers className="h-5 w-5 text-accent" />
          <div>
            <div className="font-semibold text-accent">All Modules</div>
            <div className="text-xs text-muted">Mix of all {syllabus.modules.length} modules</div>
          </div>
        </button>

        {syllabus.modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onSelect(mod.number)}
            className="flex flex-col gap-1 rounded-xl border border-border p-4 text-left transition hover:border-accent/40 hover:bg-surface-2"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-accent">Module {mod.number}</div>
            <div className="font-semibold leading-snug">{mod.title}</div>
            <div className="text-xs text-muted">{mod.units.length} units</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizCard({ session, onReveal, onGrade, onRestart }: {
  session: SessionState;
  onReveal: () => void;
  onGrade: (g: Grade) => void;
  onRestart: () => void;
}) {
  if (session.done) {
    const total = session.grades.length;
    const known = session.grades.filter((g) => g === "know").length;
    const review = total - known;
    const pct = total === 0 ? 0 : Math.round((known / total) * 100);

    return (
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="text-4xl font-bold">{pct}%</div>
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">{known}</span> known ·{" "}
            <span className="font-medium text-foreground">{review}</span> to review
          </p>
          {pct === 100 && (
            <p className="text-sm font-medium text-accent">Perfect round — nice work.</p>
          )}
          {review > 0 && (
            <p className="text-xs text-muted">
              Review the {review} flagged card{review !== 1 ? "s" : ""} to solidify understanding.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New session
            </button>
            {review > 0 && (
              <button
                onClick={() => {
                  const flagged = session.questions.filter((_, i) => session.grades[i] === "review");
                  onRestart();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm text-accent hover:bg-accent/10"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Retry flagged
              </button>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">This session</h2>
          {session.questions.map((q, i) => (
            <div key={q.id} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              {session.grades[i] === "know" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              )}
              <div>
                <div className="font-medium leading-snug">{q.question}</div>
                <div className="mt-0.5 text-xs text-muted">{q.unitId} — {q.unitTitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const q = session.questions[session.current];
  const progress = `${session.current + 1} / ${session.questions.length}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium">{q.unitId} — {q.unitTitle}</span>
        <span>{progress}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${((session.current) / session.questions.length) * 100}%` }}
        />
      </div>

      <Card className="flex min-h-[200px] flex-col gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted">Question</div>
          <p className="mt-2 text-base font-medium leading-relaxed">{q.question}</p>
        </div>

        {!session.revealed ? (
          <button
            onClick={onReveal}
            className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
          >
            Show answer <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <>
            <div className="border-t border-border pt-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted">Answer</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{q.answer}</p>
            </div>
            <div className="mt-auto flex gap-3">
              <button
                onClick={() => onGrade("review")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/5 px-3 py-2.5 text-sm font-medium text-yellow-600 transition hover:bg-yellow-500/10 dark:text-yellow-400"
              >
                <XCircle className="h-4 w-4" /> Review
              </button>
              <button
                onClick={() => onGrade("know")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-500/40 bg-green-500/5 px-3 py-2.5 text-sm font-medium text-green-600 transition hover:bg-green-500/10 dark:text-green-400"
              >
                <CheckCircle2 className="h-4 w-4" /> Got it
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export function QuizClient() {
  const allQuestions = useMemo(() => buildQuizIndex(), []);
  const [selectedModule, setSelectedModule] = useState<number | null | undefined>(undefined);
  const [session, setSession] = useState<SessionState | null>(null);

  function startSession(moduleNumber: number | null) {
    setSelectedModule(moduleNumber);
    const filtered =
      moduleNumber === null
        ? allQuestions
        : allQuestions.filter((q) => q.moduleNumber === moduleNumber);
    setSession({
      questions: shuffle(filtered),
      current: 0,
      revealed: false,
      grades: [],
      done: false,
    });
  }

  function reveal() {
    setSession((s) => s && { ...s, revealed: true });
  }

  function grade(g: Grade) {
    setSession((s) => {
      if (!s) return s;
      const grades = [...s.grades, g];
      const next = s.current + 1;
      if (next >= s.questions.length) {
        return { ...s, grades, done: true };
      }
      return { ...s, grades, current: next, revealed: false };
    });
  }

  function restart() {
    setSelectedModule(undefined);
    setSession(null);
  }

  if (selectedModule === undefined || session === null) {
    return <ModuleSelector onSelect={startSession} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={restart} className="text-sm text-muted hover:text-foreground">
          ← Choose module
        </button>
        <span className="text-muted">/</span>
        <span className="text-sm font-medium">
          {selectedModule === null
            ? "All modules"
            : `Module ${selectedModule} — ${syllabus.modules.find((m) => m.number === selectedModule)?.title}`}
        </span>
        <span className="ml-auto text-xs text-muted">{session.questions.length} cards</span>
      </div>

      {session.questions.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-sm text-muted">No quiz questions found for this module yet.</p>
        </Card>
      ) : (
        <QuizCard session={session} onReveal={reveal} onGrade={grade} onRestart={restart} />
      )}
    </div>
  );
}
