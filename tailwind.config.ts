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
					primary: '#00B5AD', // Mintgrün
					secondary: '#FF7F50', // Pfirsich/Koralle
					accent: '#FFD700', // Goldgelb für Akzente
					neutral: '#F5F5F5', // Sehr helles Grau für Hintergründe
					'base-100': '#E5E7EB', // Weiß für Hauptinhalte
					'base-200': '#E5E7EB', // Hellgrau für Kontraste
					'base-300': '#D1D5DB', // Grau für weniger wichtige Bereiche
					info: '#40C4FF', // Helles Türkisblau für Informationen
					success: '#34D399', // Sanftes Grün für Erfolge
					warning: '#FFA500', // Orange für Warnungen
					error: '#EF4444', // Rot für Fehler
					background: '#00B5AD' // Mintgrün zu Pfirsich/Koralle
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
