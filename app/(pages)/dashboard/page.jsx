import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import SignOutButton from '@/components/sign-out-button'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Signed in as <span className="font-medium text-gray-900">{user.email || user.id}</span>
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900">You are logged in</h2>
        <p className="mt-2 text-gray-600">
          This page is protected by middleware and Supabase session checks.
        </p>
      </div>
    </section>
  )
}
