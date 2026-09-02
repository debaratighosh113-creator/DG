/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f6f8f9',
          100: '#eceff1',
          200: '#d4dadd',
          300: '#aeb9c0',
          400: '#7d8d97',
          500: '#5d6f7b',
          600: '#495866',
          700: '#3a4752',
          800: '#313c45',
          900: '#2b343c',
          950: '#1a2026',
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        float: 'float 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
