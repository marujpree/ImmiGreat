import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-50 to-white px-4 py-24 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
          Your citizenship journey starts here
        </span>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
          Become a US Citizen —{' '}
          <span className="text-brand-600">Confidently</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          CitizenReady helps you study for the USCIS civics test, track your
          progress, and discover trusted resources for starting your new life in
          the United States.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/signup" className="btn-primary px-8 py-3 text-base">
            Start studying for free
          </Link>
          <Link href="/practice" className="btn-secondary px-8 py-3 text-base">
            Try a practice quiz
          </Link>
        </div>
      </div>
    </section>
  )
}
