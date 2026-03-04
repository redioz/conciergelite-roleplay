import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D1A',
        card: '#161628',
        surface: '#1E1E35',
        border: '#2A2A45',
        gold: '#C8A951',
        'gold-light': '#D4B96A',
        'gold-dark': '#A68B3C',
        'text-primary': '#E8E8F0',
        'text-muted': '#8888A0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'pulse-blue': 'pulse-blue 2s ease-in-out infinite',
        'pulse-critical': 'pulse-critical 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'score-fill': 'score-fill 1.5s ease-out forwards',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 169, 81, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(200, 169, 81, 0)' },
        },
        'pulse-blue': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74, 144, 217, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(74, 144, 217, 0)' },
        },
        'pulse-critical': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'score-fill': {
          from: { strokeDashoffset: '283' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
