import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Signed in as{" "}
            <span className="text-[var(--foreground)]">{user.email ?? user.id}</span>
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Welcome</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Civics practice, English practice, and your settlement checklist will live here.
        </p>
      </section>
    </div>
  );
}
