/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#0b1f3a',
        },
        ink: {
          900: '#0b1f3a',
          800: '#0f2a4a',
          700: '#1e3a5f',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        mint: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        whatsapp: '#25d366',
      },
    },
  },
  plugins: [],
};
