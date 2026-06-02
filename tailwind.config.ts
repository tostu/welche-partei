import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { addIconSelectors } from '@iconify/tailwind';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#002422', // Very dark green for high-contrast primary elements
					'primary-content': '#00B5AD', // Mint green text on primary buttons
					secondary: '#FF7F50', // Peach/coral
					'secondary-content': '#FFF0EA', // Lighter variant of peach as text color on peach background
					accent: '#FFD700', // Goldgelb for highlights
					'accent-content': '#002422',
					neutral: '#00312F', // Deep green-black for neutral elements
					'neutral-content': '#FFFFFF',
					'base-100': '#00B5AD', // Mint green background for the whole page
					'base-200': '#009F98', // Slightly darker mint for cards/sections
					'base-300': '#008A84', // Darker mint for borders/dividers
					'base-content': '#002422', // Very dark green for readable body text
					info: '#40C4FF',
					success: '#34D399',
					warning: '#FFA500',
					error: '#EF4444'
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
