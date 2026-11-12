/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // YieldVision Exact Color System
        'yield-primary': '#073B2A',
        'yield-dark': '#0B4D38',
        'yield-mint': '#DDF5EA',
        'yield-soft': '#F2FAF5',
        'yield-offwhite': '#FAFCF9',
        'yield-charcoal': '#17201C',
        'yield-gray': '#6F6F6F',
        // Existing support palettes
        mint: {
          50: '#f6faf7',
          100: '#eef7f2',
          200: '#d9eee1',
          300: '#b8dec7',
          400: '#8ec5a5',
        },
        forest: {
          800: '#14382a',
          900: '#073B2A',
          950: '#05271c',
        },
        emerald: {
          DEFAULT: '#10b981',
          dark: '#0B4D38',
          light: '#34d399',
        },
        sage: {
          50: '#f4f6f4',
          100: '#e5eae5',
          200: '#cbd4cb',
          300: '#a3b1a3',
          400: '#84a98c',
        }
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '22px',
      },
      boxShadow: {
        'glass': '0 10px 40px rgba(7, 59, 42, 0.08)',
        'glass-hover': '0 14px 44px rgba(7, 59, 42, 0.14)',
        'glass-card': '0 12px 36px rgba(7, 59, 42, 0.06)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
