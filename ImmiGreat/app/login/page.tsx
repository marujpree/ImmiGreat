import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authFailed = error === "auth";
  const configMissing = error === "config";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]">ImmiGreat</p>
        <p className="text-sm text-[var(--muted)]">Citizenship prep & settlement</p>
      </div>

      {configMissing && (
        <p
          className="mb-6 max-w-md rounded-lg border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-center text-sm text-amber-100"
          role="alert"
        >
          Supabase environment variables are missing. Copy{" "}
          <code className="rounded bg-black/30 px-1">.env.example</code> to{" "}
          <code className="rounded bg-black/30 px-1">.env.local</code> and add your project
          URL and anon key.
        </p>
      )}
      {authFailed && (
        <p
          className="mb-6 max-w-md rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-center text-sm text-red-200"
          role="alert"
        >
          Sign-in failed or the link expired. Try again or request a new link.
        </p>
      )}

      <Suspense
        fallback={
          <p className="text-sm text-[var(--muted)]" aria-live="polite">
            Loading sign-in…
          </p>
        }
      >
        <AuthForm />
      </Suspense>

      <p className="mt-10 max-w-md text-center text-xs text-[var(--muted)]">
        ImmiGreat provides study tools and general information only. It is not legal
        advice. Always verify requirements with USCIS or a qualified professional.
      </p>
    </div>
  );
}
