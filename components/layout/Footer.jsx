import Link from 'next/link'
import { Mail } from 'lucide-react'

const quickLinks = [
  { href: '/visa-info', label: 'Visa Information' },
  { href: '/form-guides', label: 'Form Guides' },
  { href: '/learn', label: 'Learn & Prepare' },
]

const resourceLinks = [
  { href: '/resources', label: 'Resource Library' },
  { href: '/local-help', label: 'Find Local Help' },
  { href: '/about', label: 'About Us' },
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1e3a5f', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Main 3-section grid: brand | links | support */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT — brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              {/* Logo — adjust width/height independently */}
              <img
                src="/logo.svg"
                alt="ImmiGreat logo"
                width={160}
                height={160}
                style={{ objectFit: 'contain' }}
              />
              {/* Brand text — adjust className for size/weight/color */}
              <span className="text-2xl font-semibold text-white tracking-tight">ImmiGreat</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Empowering immigrants to navigate the U.S. immigration process with confidence and clarity.
            </p>
          </div>

          {/* CENTRE — quick links + resources side by side */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2">
                {resourceLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Get Support</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0" />
                support@immigreat.org
              </li>
              <li>
                <Link
                  href="/signup"
                  className="inline-block px-4 py-2 text-sm bg-white text-primary font-medium rounded-lg hover:bg-white/90 transition-colors"
                >
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/50"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p>&copy; {new Date().getFullYear()} ImmiGreat. All rights reserved.</p>
          <p>Dedicated to serving immigrants with dignity and respect.</p>
        </div>
      </div>
    </footer>
  )
}
