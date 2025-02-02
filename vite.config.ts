import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import monicon from "@monicon/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		monicon({
			icons: [
				"tabler:home",
				"tabler:key",
				"tabler:currency-euro",
				"tabler:wallet",
				"tabler:chart-bar",
				"tabler:user",
				"tabler:home-off",
				"tabler:school",
				"tabler:briefcase",
				"tabler:building-skyscraper",
				"tabler:trees",
				"tabler:scale",
				"tabler:leaf",
				"tabler:percentage",
				"tabler:road",
				"tabler:chart-line",
			  ]
		  }),
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
