import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: {
    default: 'ImmiGreat',
    template: '%s | ImmiGreat',
  },
  description: 'Comprehensive resources, personalized guidance, and expert support to help you navigate the U.S. immigration process.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
