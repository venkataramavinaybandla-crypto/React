/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        taupe: {
          DEFAULT: '#B3A394',
          50:  '#F5F0EB',
          100: '#E8DDD6',
          200: '#D4C9BE',
          300: '#C0AFA3',
          400: '#B3A394',
          500: '#9A8B7C',
          600: '#8A7A6E',
        },
        'matte-black': '#1A1A1A',
        signal: '#FF6B00',
        'signal-light': '#FF8C3A',
        'signal-dim': 'rgba(255,107,0,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: { card: '16px' },
      boxShadow: {
        card: '0 2px 20px rgba(26,26,26,0.06)',
        'card-hover': '0 20px 60px rgba(26,26,26,0.14)',
        signal: '0 0 0 8px rgba(255,107,0,0)',
      },
    },
  },
  plugins: [],
}
