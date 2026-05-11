import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FAFAFA',
          dark: '#0B0B0C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#161618',
        },
        border: {
          DEFAULT: '#ECECEC',
          dark: '#26262A',
        },
        text: {
          DEFAULT: '#0B0B0C',
          dark: '#F5F5F7',
        },
        muted: {
          DEFAULT: '#6B6B70',
          dark: '#9A9AA0',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          dark: '#38BDF8',
        },
      },
      borderRadius: {
        tile: '12px',
        card: '16px',
        button: '12px',
        fab: '28px',
        pill: '999px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
