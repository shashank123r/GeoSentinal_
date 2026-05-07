/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Disaster type colors
                flood: '#2196F3',
                earthquake: '#795548',
                landslide: '#FF9800',
                fire: '#F44336',
                cyclone: '#00BCD4',
                hurricane: '#9C27B0',
                // Severity colors
                severity: {
                    low: '#4CAF50',
                    medium: '#FF9800',
                    high: '#FF5722',
                    critical: '#F44336'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
            }
        },
    },
    plugins: [],
}
