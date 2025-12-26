/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        muted: '#6b7280',
        card: '#ffffff',
        bg: '#f5f7fb',
      },
      boxShadow: {
        'card': '0 6px 18px rgba(2, 6, 23, 0.06)',
        'card-hover': '0 12px 30px rgba(2, 6, 23, 0.12)',
        'header': '0 6px 18px rgba(16, 24, 40, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}