export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['opacity-0', 'opacity-100', 'translate-y-0', 'translate-y-6'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        primary: {
          50: '#eff6fc',
          100: '#deebf9',
          200: '#c7e0f4',
          300: '#71afe5',
          400: '#2b88d8',
          500: '#0078d4',
          600: '#106ebe',
          700: '#005a9e',
          800: '#004578',
          900: '#004578',
        },
        azure: {
          blue: '#0078D4',
          bg: '#F3F2F1',
          surface: '#ffffff',
          sidebar: '#1b1b1b',
          border: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['"Bruno Ace SC"', 'sans-serif'],
        display: ['"Bruno Ace SC"', 'sans-serif'],
        mono: ['Consolas', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
        card: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)',
        elevated: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.3)',
        glow: '0 0 30px rgba(255, 68, 51, 0.3)',
        'glow-accent': '0 0 30px rgba(0, 255, 135, 0.25)',
        'glow-blue': '0 0 30px rgba(0, 212, 255, 0.25)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.25)',
        'neon-border': '0 0 15px rgba(255, 68, 51, 0.15), inset 0 0 15px rgba(255, 68, 51, 0.05)',
        inner: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'aurora-2': 'aurora2 10s ease-in-out infinite',
        'aurora-3': 'aurora3 12s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) rotate(120deg) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg) scale(0.9)' },
        },
        aurora2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-40px, 30px) rotate(180deg)' },
        },
        aurora3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, 10px) scale(0.85)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora-mesh': 'linear-gradient(135deg, rgba(255,68,51,0.08) 0%, rgba(0,212,255,0.08) 25%, rgba(168,85,247,0.08) 50%, rgba(0,255,135,0.06) 75%, rgba(255,68,51,0.08) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
        'dot-pattern': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot': '24px 24px',
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
