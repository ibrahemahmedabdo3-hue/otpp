/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        ink: {
          900: '#0b1220',
          700: '#1e2536',
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
