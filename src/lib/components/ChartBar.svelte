<script>
	import 'chartist/dist/index.css';
	import { BarChart } from 'chartist';
	import { onMount } from 'svelte';
	import { daten } from '$lib/programs/taxes';

	let { labels, series, high = 10, low = 0 } = $props();

	onMount(() => {
		new BarChart(
			'#chart',
			{
				labels: [
					'Jan',
					'Feb',
					'Mar',
					'Apr',
					'May',
					'Jun',
					'Jul',
					'Aug',
					'Sep',
					'Oct',
					'Nov',
					'Dec'
				],
				series: [
					[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
					[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
				]
			},
			{
				high: high,
				low: low,
				axisX: {
					labelInterpolationFnc: (value, index) => (index % 2 === 0 ? value : null)
				}
			}
		);
	});
</script>

<div class="h-full w-full" id="chart"></div>
