import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        card: '#111111',
        surface: '#161616',
        border: '#222222',
        gold: '#F4C842',
        'gold-light': '#F7D56B',
        'gold-dark': '#D4A82E',
        'text-primary': '#F0F0F0',
        'text-muted': '#888888',
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'pulse-blue': 'pulse-blue 2s ease-in-out infinite',
        'pulse-critical': 'pulse-critical 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1)',
        'score-fill': 'score-fill 1.5s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 200, 66, 0.35)' },
          '50%': { boxShadow: '0 0 0 24px rgba(244, 200, 66, 0)' },
        },
        'pulse-blue': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74, 144, 217, 0.35)' },
          '50%': { boxShadow: '0 0 0 24px rgba(74, 144, 217, 0)' },
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
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'score-fill': {
          from: { strokeDashoffset: '283' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
