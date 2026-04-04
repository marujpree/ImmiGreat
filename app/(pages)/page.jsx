import Link from 'next/link'
import { ArrowRight, CheckCircle, FileText, BookOpen, Map, Globe, Scale, GraduationCap, Heart } from 'lucide-react'

export const metadata = { title: 'Home' }

const features = [
  { icon: FileText, title: 'Form Assistance', description: 'Complete immigration forms with detailed, field-by-field guidance', link: '/form-guides' },
  { icon: Globe, title: 'Visa Information', description: 'Comprehensive information on U.S. visa categories and requirements', link: '/visa-info' },
  { icon: Scale, title: 'Legal Resources', description: 'Access immigration resources and understand your rights', link: '/resources' },
  { icon: Map, title: 'Local Services', description: 'Find immigration lawyers, notaries, and community support near you', link: '/local-help' },
  { icon: GraduationCap, title: 'Education & Preparation', description: 'English learning and U.S. citizenship test preparation', link: '/learn' },
]

const impactStats = [
  { number: '20+', label: 'Learning Exercises Available' },
  { number: '5', label: 'Languages Supported' },
  { number: '100+', label: 'Form Guides Available' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1745256374911-95658a40d754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGZsYWclMjB3YXZpbmclMjBvdXRkb29yfGVufDF8fHx8MTc3NTIzOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          minHeight: '520px',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 22, 40, 0.72)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center" style={{ minHeight: '520px' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white font-medium">
            Navigate Your Immigration Journey with Confidence
          </h1>
          <p className="text-xl text-white/85 mb-10 max-w-3xl mx-auto">
            ImmiGreat provides comprehensive resources, personalized guidance, and expert support
            to help you successfully navigate the U.S. immigration process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/30">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl text-white mb-1">{stat.number}</div>
                <div className="text-sm text-white/75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Link
                  key={idx}
                  href={feature.link}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all group"
                >
                  <div className="bg-primary/10 text-primary rounded-lg p-3 w-fit mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl mb-2 text-foreground font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why ImmiGreat */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 font-medium">Why Choose ImmiGreat?</h2>
              <div className="space-y-4">
                {[
                  { title: 'Expert Guidance', desc: 'Developed in partnership with immigration lawyers and legal experts' },
                  { title: 'Multilingual Support', desc: 'Access resources in 5 languages with professional translations' },
                  { title: 'Personalized Experience', desc: 'Create an account for customized guidance tailored to your situation' },
                  { title: 'Always Free', desc: '100% free resources—no hidden fees, no subscriptions required' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl mb-1 font-medium">{item.title}</h3>
                      <p className="opacity-90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 className="text-2xl mb-6 font-medium">Create Your Free Account</h3>
              <p className="opacity-90 mb-6">
                Sign up today to access personalized immigration pathways, save your progress,
                and get customized recommendations based on your unique situation.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-lg hover:bg-white/90 transition-colors w-full"
              >
                Sign Up Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm opacity-75 mt-4 text-center">
                Already have an account?{' '}
                <Link href="/login" className="underline hover:no-underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-border rounded-lg p-8 md:p-12 text-center">
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl mb-4 text-foreground font-medium">Our Commitment</h2>
              <p className="text-xl text-muted-foreground mb-6">
                ImmiGreat is committed to providing accurate, accessible, and culturally sensitive
                immigration information to everyone, regardless of background or circumstances.
              </p>
              <p className="text-muted-foreground mb-8">
                We partner with legal experts, community organizations, and government agencies
                to ensure our content is up-to-date and trustworthy.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary hover:underline">
                Read more about our mission
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4 text-foreground font-medium">Ready to Begin?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of people who are successfully navigating their immigration journey with ImmiGreat
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
