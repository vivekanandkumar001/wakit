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
        brand: {
          50: '#eefdf5',
          100: '#d5fbe3',
          200: '#aef6cb',
          300: '#75eca9',
          400: '#38d97e',
          500: '#10b95c',
          600: '#069647',
          700: '#08773b',
          800: '#0c5e32',
          900: '#0d4d2b',
          950: '#042b17',
        },
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          bg: '#E5DDD5',
          blue: '#34B7F1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
