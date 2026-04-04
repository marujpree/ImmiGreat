/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ImmiGreat design system colors
        primary: {
          DEFAULT: '#1e3a5f',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#8b1538',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#e5e7eb',
          foreground: '#1a1a1a',
        },
        background: '#ffffff',
        foreground: '#1a1a1a',
        border: '#d1d5db',
        'input-background': '#ffffff',
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1a1a1a',
        },
        ring: '#1e3a5f',
        // Legacy brand colors
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
