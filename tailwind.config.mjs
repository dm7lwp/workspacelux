/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        main: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        primary: '#2563EB',
        accent: '#F59E0B',
        success: '#16A34A',
        warning: '#F97316',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
};
