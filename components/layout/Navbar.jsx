'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, User, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const NAV_BG = '#1e3a5f'

const links = [
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learn' },
  { href: '/visa-info', label: 'Visa Information' },
  { href: '/form-guides', label: 'Form Guides' },
  { href: '/resources', label: 'Resources' },
  { href: '/local-help', label: 'Local Help' },
  { href: '/about', label: 'About' },
]

const languages = [
  { code: 'en', native: 'English', googleCode: 'en' },
  { code: 'es', native: 'Español', googleCode: 'es' },
  { code: 'zh', native: '中文', googleCode: 'zh-CN' },
  { code: 'ar', native: 'العربية', googleCode: 'ar' },
  { code: 'fr', native: 'Français', googleCode: 'fr' },
]

const googleToNavCode = { en: 'en', es: 'es', 'zh-CN': 'zh', ar: 'ar', fr: 'fr' }

export default function AppNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedLang, setSelectedLang] = useState('en')

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
    if (match) setSelectedLang(googleToNavCode[match[1]] ?? 'en')
  }, [])

  function handleLanguageChange(lang) {
    setSelectedLang(lang.code)
    setLangOpen(false)
    if (lang.code === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/`
    } else {
      document.cookie = `googtrans=/en/${lang.googleCode}; path=/`
      document.cookie = `googtrans=/en/${lang.googleCode}; domain=.${window.location.hostname}; path=/`
    }
    window.location.reload()
  }

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
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: NAV_BG, borderBottom: '1px solid rgba(255,255,255,0.2)' }}
    >
      {/* ── Desktop: 3-section bar ── */}
      <div className="hidden lg:flex items-center w-full px-6" style={{ height: 120 }}>

        {/* LEFT — logo + brand text */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="shrink-0">
            <img
              src="/logo.svg"
              alt="ImmiGreat logo"
              width={80}
              height={80}
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </Link>
          <Link href="/" className="text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
            ImmiGreat
          </Link>
        </div>

        {/* CENTRE — nav tabs */}
        <nav className="flex-1 flex justify-center items-center gap-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  active
                    ? 'text-white bg-white/15'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT — language + account */}
        <div className="flex items-center gap-3 shrink-0 justify-end">

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4" />
              <span>{selectedLang.toUpperCase()}</span>
            </button>
            {langOpen && (
              <>
                <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-40">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
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
                <span>Account</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-48">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-xs text-muted-foreground">Signed in as</div>
                      <div className="text-sm truncate text-foreground">{user.email}</div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                    >
                      Profile Settings
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
            <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* ── Mobile: logo + hamburger ── */}
      <div className="flex lg:hidden items-center justify-between px-4" style={{ height: 64 }}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="ImmiGreat logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          <span className="text-xl text-white">ImmiGreat</span>
        </Link>
        <button
          className="p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile: slide-down menu ── */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
          {user ? (
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
        </div>
      )}
    </header>
  )
}
