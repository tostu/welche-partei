import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { addIconSelectors } from '@iconify/tailwind';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'base-50': '#E6F8F7',
				'base-150': '#00ADA5',
				'base-250': '#00948D',
				'mint-light': '#D1F2F0',
				'mint-dark': '#004D49'
			},
			boxShadow: {
				premium: '0 10px 30px -10px rgba(0, 36, 34, 0.2)',
				glow: '0 0 20px rgba(0, 181, 173, 0.4)',
				'glow-secondary': '0 0 20px rgba(183, 65, 14, 0.3)'
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	},

	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#002422', // Very dark green
					'primary-content': '#D1F2F0',
					secondary: '#B7410E', // Dark Rust/Terra Cotta (better contrast on mint)
					'secondary-content': '#FFFFFF',
					accent: '#FFD700', 
					'accent-content': '#002422',
					neutral: '#00312F', 
					'neutral-content': '#FFFFFF',
					'base-100': '#00B5AD', 
					'base-200': '#00A39C', 
					'base-300': '#008A84', 
					'base-content': '#002422',
					info: '#40C4FF',
					success: '#34D399',
					warning: '#FFA500',
					error: '#EF4444',
					'--rounded-box': '1.5rem',
					'--rounded-btn': '0.75rem',
					'--rounded-badge': '1.9rem',
					'--animation-btn': '0.25s',
					'--animation-input': '0.2s',
					'--btn-focus-scale': '0.95',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem'
				}
			}
		]
	},

	plugins: [
		typography,
		forms,
		require('daisyui'),
		addIconSelectors(['icon-park-outline', 'fluent-mdl2', 'tabler'])
	]
} satisfies Config;
