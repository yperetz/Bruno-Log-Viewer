/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        method: {
          get: '#3b82f6',
          post: '#10b981',
          put: '#f59e0b',
          delete: '#ef4444',
          patch: '#8b5cf6',
          options: '#6b7280',
        },
        status: {
          '2xx': '#10b981',
          '3xx': '#eab308',
          '4xx': '#f97316',
          '5xx': '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
