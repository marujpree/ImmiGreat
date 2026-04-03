const features = [
  {
    icon: '📚',
    title: '100 Official Civics Questions',
    description:
      'Study all USCIS civics questions with clear explanations and spaced-repetition flashcards.',
  },
  {
    icon: '🤖',
    title: 'AI Study Assistant',
    description:
      'Ask CitizenReady AI anything about US history, government, and the naturalization process.',
  },
  {
    icon: '📝',
    title: 'Practice Tests',
    description:
      'Simulate the real interview with timed quizzes and instant feedback on every answer.',
  },
  {
    icon: '🗺️',
    title: 'Settling-in Resources',
    description:
      'Find local offices, community organizations, ESL classes, and housing assistance near you.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description:
      'See which topics you have mastered and focus your study time where it matters most.',
  },
  {
    icon: '🌐',
    title: 'Multilingual Support',
    description:
      'Content available in Spanish, Mandarin, Portuguese, and more — coming soon.',
  },
]

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
        Everything you need to pass your interview
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card hover:shadow-md transition-shadow">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
