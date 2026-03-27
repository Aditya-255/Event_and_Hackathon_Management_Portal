/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft, #EEF2FF)'
        },
        secondary: 'var(--secondary)',
        bg: 'var(--bg)',
        text: {
          DEFAULT: 'var(--text)',
          soft: 'var(--text-soft)'
        },
        border: 'var(--border)'
      }
    },
  },
  plugins: [],
}
