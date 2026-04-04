import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: {
    default: 'ImmiGreat',
    template: '%s | ImmiGreat',
  },
  description: 'Comprehensive resources, personalized guidance, and expert support to help you navigate the U.S. immigration process.',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script id="google-translate-init" strategy="afterInteractive">{`
          window.googleTranslateElementInit = function() {
            new window.google.translate.TranslateElement(
              { pageLanguage: 'en', includedLanguages: 'en,es,zh-CN,ar,fr', autoDisplay: false },
              'google_translate_element'
            );
          };
        `}</Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
