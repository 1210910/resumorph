// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css,scss}'],
  theme: {
    extend: {
      colors: {
        /**
         * Near-black base. 950 is the single fixed page background;
         * 900–600 are progressively raised surfaces and borders.
         */
        ink: {
          950: '#0a0a0b',
          900: '#101012',
          800: '#161619',
          700: '#1d1d21',
          600: '#26262a',
        },
        /** The one signal color — used sparingly: dots, one word per headline, hovers. */
        lime: {
          DEFAULT: '#8b5cf6',
          bright: '#a78bfa',
          dim: '#6d28d9',
        },
        /** Linen theme: channels live in --ln-* (globalStyles.scss) so dark mode can swap them. */
        linen: {
          bg: 'rgb(var(--ln-bg) / <alpha-value>)',
          surface: 'rgb(var(--ln-surface) / <alpha-value>)',
          ink: 'rgb(var(--ln-ink) / <alpha-value>)',
          muted: 'rgb(var(--ln-muted) / <alpha-value>)',
          line: 'rgb(var(--ln-line))', // already carries its own alpha
          accent: 'rgb(var(--ln-accent) / <alpha-value>)',
          deep: 'rgb(var(--ln-deep) / <alpha-value>)',
        },
        /** Neutral grays for chrome text (labels, captions, meta). */
        smoke: {
          200: '#d4d4d4',
          300: '#b5b5b5',
          400: '#9c9c9c',
          500: '#858585',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 92, 246, 0.22)',
        'glow-sm': '0 0 14px rgba(139, 92, 246, 0.35)',
        'glow-lg': '0 0 44px rgba(139, 92, 246, 0.32)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      keyframes: {
        'orb-drift': {
          '0%': {transform: 'translate3d(0, 0, 0) scale(1)'},
          '50%': {transform: 'translate3d(3vw, -4vh, 0) scale(1.07)'},
          '100%': {transform: 'translate3d(-3vw, 3vh, 0) scale(0.96)'},
        },
        'fade-up': {
          from: {opacity: '0', transform: 'translateY(18px)'},
          to: {opacity: '1', transform: 'translateY(0)'},
        },
        'pulse-dot': {
          '0%, 100%': {opacity: '1', transform: 'scale(1)'},
          '50%': {opacity: '0.55', transform: 'scale(0.8)'},
        },
        'bounce-soft': {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(7px)'},
        },
        marquee: {
          from: {transform: 'translateX(0)'},
          to: {transform: 'translateX(-50%)'},
        },
      },
      animation: {
        'orb-drift': 'orb-drift 26s ease-in-out infinite alternate',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2.2s ease-in-out infinite',
        // sized for the 4-copy track: ≈35px/s at 1440px, ≈29px/s at 375px
        marquee: 'marquee 50s linear infinite',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
