import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: {
    default: 'CitizenReady',
    template: '%s | CitizenReady',
  },
  description:
    'Prepare for the US citizenship test and find resources for settling in the USA.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CitizenReady. Not affiliated with
            USCIS.
          </p>
        </footer>
      </body>
    </html>
  )
}
