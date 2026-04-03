import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.svg" alt="ImmiGreat logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl">ImmiGreat</span>
            </div>
            <p className="text-sm opacity-90">
              Empowering immigrants to navigate the U.S. immigration process with confidence and clarity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="opacity-90 hover:opacity-100 hover:underline">Features</Link></li>
              <li><Link href="/visa-info" className="opacity-90 hover:opacity-100 hover:underline">Visa Information</Link></li>
              <li><Link href="/form-guides" className="opacity-90 hover:opacity-100 hover:underline">Form Guides</Link></li>
              <li><Link href="/learn" className="opacity-90 hover:opacity-100 hover:underline">Learn &amp; Prepare</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="opacity-90 hover:opacity-100 hover:underline">Resource Library</Link></li>
              <li><Link href="/local-help" className="opacity-90 hover:opacity-100 hover:underline">Find Local Help</Link></li>
              <li><Link href="/about" className="opacity-90 hover:opacity-100 hover:underline">About Us</Link></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="opacity-90 hover:opacity-100 hover:underline">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Get Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-90">
                <Mail className="h-4 w-4" />
                support@immigreat.org
              </li>
              <li>
                <Link href="/signup" className="inline-block bg-white text-primary px-4 py-2 rounded-lg hover:bg-white/90 transition-colors mt-2">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90">
            <p>&copy; {new Date().getFullYear()} ImmiGreat. All rights reserved.</p>
            <p>Dedicated to serving immigrants with dignity and respect.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
