'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, Menu, X, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const links = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/visa-info', label: 'Visa Information' },
  { href: '/form-guides', label: 'Form Guides' },
  { href: '/resources', label: 'Resources' },
  { href: '/local-help', label: 'Local Help' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About' },
]

const languages = [
  { code: 'en', native: 'English' },
  { code: 'es', native: 'Español' },
  { code: 'zh', native: '中文' },
  { code: 'ar', native: 'العربية' },
  { code: 'fr', native: 'Français' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo row */}
        <div className="flex items-center justify-between py-3 border-b border-white/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="ImmiGreat logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl text-white">ImmiGreat</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">EN</span>
              </button>
              {langOpen && (
                <>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-40">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLangOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                </>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-48">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="text-xs text-muted-foreground">Signed in as</div>
                        <div className="text-sm truncate text-foreground">{user.email}</div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm bg-white text-primary rounded-lg hover:bg-white/90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Nav links row */}
        <nav className="hidden lg:flex items-center gap-1 py-2">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm transition-colors rounded-md ${
                  active ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/20 bg-primary">
          <nav className="px-4 py-4 space-y-1">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                    active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {!user && (
              <div className="pt-4 border-t border-white/20 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-center border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-center bg-white text-primary rounded-lg hover:bg-white/90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
