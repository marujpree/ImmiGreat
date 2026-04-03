import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        ImmiGreat
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Prepare for the U.S. naturalization test and organize your next steps—all in one
        place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface)]"
        >
          Go to dashboard
        </Link>
      </div>
      <p className="mt-10 text-xs text-[var(--muted)]">
        Not legal advice. Verify requirements with USCIS or a qualified professional.
      </p>
    </div>
  );
}
