import AuthForm from '@/components/auth-form'

export const metadata = {
  title: 'Log In',
}

export default function LoginPage({ searchParams }) {
  const authFailed = searchParams?.error === 'auth'

  return (
    <section className="mx-auto flex min-h-[calc(100vh-170px)] w-full max-w-6xl items-center px-4 py-12">
      <div className="grid w-full items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Welcome back</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
            Build confidence for your citizenship interview.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            Sign in to keep practicing civics questions, track your progress, and access saved study tools.
          </p>

          {authFailed && (
            <p className="mt-6 max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              Sign-in failed or the link expired. Try again and request a new link if needed.
            </p>
          )}
        </div>

        <AuthForm />
      </div>
    </section>
  )
}
