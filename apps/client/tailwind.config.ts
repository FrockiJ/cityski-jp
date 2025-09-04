import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['class'],
	content: [
		'.src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		screens: {
			xs: '481px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1440px',
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1.25rem',
				sm: '2.5rem',
			},
			screens: {
				sm: '100%',
				md: '100%',
				lg: '100%',
				xl: '100%',
				'2xl': '1280px',
			},
		},
		extend: {
			screens: {
				xs: '481px',
				'3xl': '1920px',
			},
			colors: {
				//CitySki colors
				system: {
					navy: '#0D386C',
					white: '#ffffff',
				},
				neutral: {
					5: '#D7D7D7',
					20: '#ACACAC',
					40: '#818181',
					50: '#6A6A6A',
					60: '#565656',
					80: '#2B2B2B',
					90: '#161616',
				},
				// Shadcn-UI colors
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			fontFamily: {
				poppins: 'var(--font-poppins)',
				'noto-sans-tc': 'var(--font-noto-sans-tc)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'spin-custom': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'spin-custom': 'spin-custom var(--uib-speed) linear infinite',
			},
		},
	},
	// corePlugins: {
	// 	preflight: false, // for MUI with tailwind
	// },
	plugins: [
		require('tailwindcss-animate'),
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.text-stroke': {
					'-webkit-text-stroke': '1px white',
				},
				'.text-shadow': {
					'text-shadow': '2px 2px 0px rgba(13, 56, 108, 0.3)',
				},
			});
		}),
	],
};
export default config;
