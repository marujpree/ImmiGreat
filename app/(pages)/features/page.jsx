import { CheckCircle, FileText, BookOpen, Map, MessageCircle, Languages, Users, Globe, GraduationCap, ArrowRight, Star } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import Link from 'next/link'

export const metadata = { title: 'Features' }

const spotlightFeatures = [
  {
    icon: CheckCircle, number: '01', title: 'Personalized Pathway', tagline: 'Your roadmap, start to finish',
    description: 'A customized step-by-step checklist tailored to your visa type and situation — SSN, bank account, housing, healthcare, and more.',
    benefits: ['Customized task list by visa type', 'Progress tracking and reminders', 'Priority recommendations', 'Links to official resources'],
    accent: 'bg-primary', tag: 'Most Popular',
  },
  {
    icon: FileText, number: '02', title: 'Form Helper', tagline: 'Plain-language form guidance',
    description: 'Upload or scan any immigration or government form and receive field-by-field explanations. Never feel overwhelmed by paperwork again.',
    benefits: ['Upload PDF or scan paper forms', 'Field-by-field explanations', 'Common mistakes highlighted', 'Example filled forms'],
    accent: 'bg-secondary', tag: 'Save Time',
  },
  {
    icon: MessageCircle, number: '03', title: 'AI Chatbot Assistant', tagline: 'Answers anytime, in your language',
    description: 'Ask any immigration question and get instant, accurate answers in your preferred language, trained on official guidelines and sources.',
    benefits: ['24/7 availability', 'Multi-language support', 'Context-aware responses', 'Official sources cited'],
    accent: 'bg-primary', tag: 'Always Available',
  },
]

const rowFeatures = [
  {
    icon: Languages, title: 'Translation + Text-to-Speech',
    description: 'Access all content in 25+ languages with high-quality translations. Hear correct pronunciations through text-to-speech to improve your language skills — even offline.',
    stats: [{ value: '25+', label: 'Languages' }, { value: '100%', label: 'Free' }, { value: 'Offline', label: 'Mode' }],
    accentColor: 'text-primary', borderColor: 'border-primary', bgColor: 'bg-primary',
  },
  {
    icon: BookOpen, title: 'Resource Library',
    description: 'A comprehensive collection of articles, guides, and plain-language definitions covering legal terms, everyday life in the U.S., and everything in between.',
    stats: [{ value: '1,000+', label: 'Articles' }, { value: 'Searchable', label: 'Topics' }, { value: 'Saved', label: 'Favorites' }],
    accentColor: 'text-secondary', borderColor: 'border-secondary', bgColor: 'bg-secondary',
  },
]

const gridFeatures = [
  { icon: Map, title: 'Local Help Finder', description: 'Locate immigration lawyers, notaries, interpreters, and community centers near you. Filter by language, cost, and services.', color: 'text-primary', bg: 'bg-primary' },
  { icon: GraduationCap, title: 'English Learning', description: 'Interactive lessons, vocabulary builders, and practice exercises focused on practical everyday language.', color: 'text-secondary', bg: 'bg-secondary' },
  { icon: Users, title: 'Citizenship Test Prep', description: 'Practice all 100 civics questions with flashcards, quizzes, and audio aids. Track your readiness over time.', color: 'text-primary', bg: 'bg-primary' },
]

export default function FeaturesPage() {
  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1640196993913-5b0043f7d7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbW1pZ3JhdGlvbiUyMGpvdXJuZXklMjB0b29scyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzc1MjQxNDcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Comprehensive tools for your journey"
        badgeIcon={<Globe className="h-4 w-4" />}
        title="Everything you need to succeed"
        description="ImmiGreat provides a complete suite of tools and resources designed specifically for immigrants to the United States — built with accessibility, clarity, and cultural sensitivity in mind."
      />

      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Core Features */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-1 rounded-full bg-primary inline-block" />
              <h2 className="text-2xl text-foreground font-medium">Core Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {spotlightFeatures.map((feat) => {
                const Icon = feat.icon
                return (
                  <div key={feat.number} className="rounded-2xl border border-border overflow-hidden flex flex-col">
                    <div className={`${feat.accent} px-6 pt-6 pb-8 relative`}>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl text-white/20 select-none leading-none">{feat.number}</span>
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{feat.tag}</span>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3 w-fit mb-4">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl text-white mb-1 font-medium">{feat.title}</h3>
                      <p className="text-sm text-white/75">{feat.tagline}</p>
                    </div>
                    <div className="bg-white p-6 flex flex-col flex-1">
                      <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{feat.description}</p>
                      <ul className="space-y-2 mt-auto">
                        {feat.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content & Language Tools */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-1 rounded-full bg-secondary inline-block" />
              <h2 className="text-2xl text-foreground font-medium">Content &amp; Language Tools</h2>
            </div>
            <div className="space-y-5">
              {rowFeatures.map((feat) => {
                const Icon = feat.icon
                return (
                  <div key={feat.title} className={`bg-white border-l-4 ${feat.borderColor} border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center`}>
                    <div className={`${feat.bgColor} rounded-xl p-4 flex-shrink-0`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`${feat.accentColor} mb-1 font-medium`}>{feat.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{feat.description}</p>
                    </div>
                    <div className="flex flex-row md:flex-col gap-6 md:gap-3 flex-shrink-0 md:text-right">
                      {feat.stats.map((s) => (
                        <div key={s.label}>
                          <div className={`text-lg ${feat.accentColor} font-medium`}>{s.value}</div>
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Banner */}
          <div className="mb-20 bg-primary rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-white/60 flex-shrink-0" />
              <p className="text-white text-xl max-w-lg">
                Every feature is free, available in 25+ languages, and designed to remove barriers — not add them.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl hover:bg-white/90 transition-opacity flex-shrink-0"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Growth & Community */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-1 rounded-full bg-primary inline-block" />
              <h2 className="text-2xl text-foreground font-medium">Growth &amp; Community Tools</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {gridFeatures.map((feat) => {
                const Icon = feat.icon
                return (
                  <div key={feat.title} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className={`${feat.bg} rounded-lg p-3 w-fit mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={`${feat.color} mb-2 font-medium`}>{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-muted rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl mb-4 font-medium">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              All features are completely free and available in 25+ languages. Your journey to success starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-opacity">
                Start Your Journey
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-colors">
                Learn More About Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
