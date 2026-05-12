/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0c12',
          card: '#13161f',
          hover: '#1c2030',
          border: 'rgba(255,255,255,0.07)',
        },
        // Korean stock convention: RED = up, BLUE = down
        up:   '#ff3a3a',
        down: '#3a8fff',
        accent: {
          gold:  '#f5c518',
          green: '#00c076',
          dim:   'rgba(245,197,24,0.15)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out',
        'slide-up':   'slideUp 0.45s ease-out',
        'slide-down': 'slideDown 0.35s ease-out',
        'pop':        'pop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'float':      'float 3s ease-in-out infinite',
        'ticker':     'ticker 20s linear infinite',
        'emoji-rise': 'emojiRise 0.8s ease-out forwards',
        'spin-slow':  'spin 2s linear infinite',
        'blink':      'blink 1.1s step-end infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:       { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        ticker:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        emojiRise: {
          '0%':   { opacity: 1, transform: 'translateY(0) scale(1)' },
          '60%':  { opacity: 1, transform: 'translateY(-60px) scale(1.4)' },
          '100%': { opacity: 0, transform: 'translateY(-100px) scale(0.8)' },
        },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke='rgba(255,255,255,0.03)' d='M0 0h40v40H0z'/%3E%3Cpath stroke='rgba(255,255,255,0.03)' d='M40 0H0v40'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
