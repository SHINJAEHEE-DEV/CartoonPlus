/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FED943",
          yellowHover: "#F6CF27",
          yellowLight: "#FEF7D9",
          yellowSoft: "#FFF7CF",
          charcoal: "#1E1E1E",
          dark: "#141414",
          surface: "#FAF8F2",
          card: "#FFFFFF",
          muted: "#8A8578",
          border: "#1E1E1E",
          borderLight: "#E7E2D6",
          darkBg: "#20201D",
        }
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      keyframes: {
        cpFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-14px) rotate(-3deg)' },
        },
        cpBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        cpWiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        cpMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        cpPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(30, 30, 30, 0.35)' },
          '70%': { boxShadow: '0 0 0 16px rgba(30, 30, 30, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(30, 30, 30, 0)' },
        },
      },
      animation: {
        'cp-float': 'cpFloat 5.5s ease-in-out infinite',
        'cp-bob': 'cpBob 3.4s ease-in-out infinite',
        'cp-wiggle': 'cpWiggle 3s ease-in-out infinite',
        'cp-marquee': 'cpMarquee 26s linear infinite',
        'cp-pulse': 'cpPulse 2.6s infinite',
      },
    },
  },
  plugins: [],
}
