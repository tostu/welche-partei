<script>
	import 'chartist/dist/index.css';
	import { BarChart } from 'chartist';
	import { onMount } from 'svelte';
	import { daten } from '$lib/programs/taxes';

	let { high = 20000, low = -5000 } = $props();

	onMount(() => {
		// Extract income levels for labels
		const incomeLabels = daten.einkommensklassen.map(
			(klasse) => `${klasse.bruttoeinkommen.toLocaleString()} €`
		);

		// Extract party names
		const partyNames = daten.einkommensklassen[0].parteien.map((partei) => partei.name);

		// Create series data - one series per party
		const seriesData = partyNames.map((partyName) => {
			return daten.einkommensklassen.map((klasse) => {
				const partyData = klasse.parteien.find((p) => p.name === partyName);
				return partyData ? partyData.veraenderung : 0;
			});
		});

		new BarChart(
			'#chart',
			{
				labels: incomeLabels,
				series: seriesData
			},
			{
				high: high,
				low: low,
				seriesBarDistance: 10,
				axisY: {
					offset: 80,
					labelInterpolationFnc: (value) => `${value.toLocaleString()} €`
				},
				axisX: {
					labelInterpolationFnc: (value) => value
				}
			}
		);
	});
</script>

<div class="h-full w-full" id="chart"></div>
