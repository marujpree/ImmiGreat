import { Heart, Users, Globe, Target, Eye, Accessibility, Mail } from 'lucide-react'
import PageBanner from '@/components/PageBanner'

export const metadata = { title: 'About' }

const team = [
  { name: 'Community Partners', description: 'Immigration lawyers, social workers, and educators who guide our content development' },
  { name: 'Technology Team', description: 'Engineers and designers committed to building accessible, user-friendly tools' },
  { name: 'Translators', description: 'Professional translators ensuring accuracy across 5 languages' },
  { name: 'Community Advisors', description: "Immigrants who've navigated the system and provide real-world feedback" },
]

const values = [
  { icon: Heart, title: 'Empowerment', description: 'We believe everyone deserves access to clear, accurate information to make informed decisions about their journey.' },
  { icon: Globe, title: 'Inclusivity', description: 'Our platform is designed to welcome everyone, regardless of their background, language, or technical skill level.' },
  { icon: Accessibility, title: 'Accessibility', description: "We're committed to WCAG compliance and ensuring our tools work for users with diverse abilities and needs." },
  { icon: Users, title: 'Community', description: 'We partner with local organizations, legal experts, and community leaders to provide trustworthy, culturally sensitive resources.' },
]

export default function AboutPage() {
  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwbXVsdGljdWx0dXJhbCUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3NTI0MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Built with care for immigrants"
        badgeIcon={<Heart className="h-4 w-4" />}
        title="About ImmiGreat"
        description="Your journey, made clearer. We're on a mission to make immigration information accessible, understandable, and empowering for everyone."
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-primary text-white rounded-3xl p-8">
              <Target className="h-12 w-12 mb-4" />
              <h2 className="text-3xl mb-4 font-medium">Our Mission</h2>
              <p className="text-lg opacity-90">
                To empower immigrants to the United States by providing clear, accessible, and culturally sensitive information
                and tools that simplify the immigration process, support integration, and promote successful transitions to life in America.
              </p>
            </div>
            <div className="bg-secondary text-white rounded-3xl p-8">
              <Eye className="h-12 w-12 mb-4" />
              <h2 className="text-3xl mb-4 font-medium">Our Vision</h2>
              <p className="text-lg opacity-90">
                A world where every person navigating immigration can access the information and support they need in their
                own language, without barriers, confusion, or unnecessary stress—building a more welcoming and connected global community.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl text-center mb-4 font-medium">Why ImmiGreat Exists</h2>
            <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              Navigating immigration can be overwhelming. We created ImmiGreat to change that.
            </p>
            <div className="bg-white border border-border rounded-2xl p-8">
              <div className="space-y-6 max-w-4xl mx-auto">
                {[
                  { title: 'The Challenge', body: 'Every year, millions of people come to the United States seeking better opportunities, safety, or to reunite with family. They face complex forms, unfamiliar systems, and information that\'s often difficult to understand—especially in a new language.' },
                  { title: 'Our Solution', body: 'ImmiGreat breaks down these barriers by providing step-by-step guidance, plain-language explanations, multilingual support, and connections to local help—all in one free platform.' },
                  { title: 'The Impact', body: "ImmiGreat offers 20+ learning exercises to help you navigate your immigration journey with greater confidence and clarity." },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="text-xl mb-2 font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl text-center mb-12 font-medium">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="bg-primary/10 text-primary rounded-xl p-3 w-fit mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl mb-2 font-medium">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl text-center mb-12 font-medium">Our Team</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              ImmiGreat is built by a diverse team of immigrants, allies, legal experts, and technology professionals who understand the journey firsthand.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-muted rounded-2xl p-6 text-center border border-border">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg mb-2 font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 mb-16">
            <h2 className="text-3xl text-center mb-6 font-medium">Get in Touch</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              We&apos;d love to hear from you. Whether you have questions, feedback, or want to partner with us, we&apos;re here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Mail, label: 'Email Us', href: 'mailto:support@immigreat.org', text: 'support@immigreat.org' },
                { icon: Users, label: 'Partnerships', href: 'mailto:partners@immigreat.org', text: 'partners@immigreat.org' },
                { icon: Accessibility, label: 'Accessibility', href: 'mailto:accessibility@immigreat.org', text: 'accessibility@immigreat.org' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="text-center">
                    <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">{item.label}</h4>
                    <a href={item.href} className="text-sm text-primary hover:underline">{item.text}</a>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-4 pt-6 border-t border-border">
              {[
                { icon: Globe, label: 'Website', href: 'https://immigreat.org' },
                { icon: Mail, label: 'Email', href: 'mailto:support@immigreat.org' },
                { icon: Globe, label: 'GitHub', href: 'https://github.com/marujpree/ImmiGreat' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-muted hover:bg-accent rounded-full p-3 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-primary text-white rounded-3xl p-8 text-center">
            <h2 className="text-3xl mb-4 font-medium">Join Our Mission</h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              ImmiGreat is 100% free and always will be. We&apos;re supported by grants, donations, and partnerships with organizations that share our vision of a more welcoming America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-xl hover:bg-white/90 transition-colors">Support Our Work</button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">Partner With Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
