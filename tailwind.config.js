/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0b0b10',
          900: '#121218',
          800: '#1b1b24',
          700: '#262633',
        },
        neon: {
          pink: '#ff2fa0',
          purple: '#8b5cf6',
          teal: '#22d3ee',
          amber: '#fbbf24',
          lime: '#a3e635',
        },
      },
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px -6px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
};
