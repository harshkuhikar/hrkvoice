/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#07080a',
          900: '#0d0f14',
          850: '#13161d',
          800: '#1a1d26',
          700: '#272b38',
          600: '#383e50',
          500: '#525a72'
        },
        brand: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
          dim: 'rgba(99, 102, 241, 0.15)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
};
