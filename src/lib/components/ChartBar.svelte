<script>
	import 'chartist/dist/index.css';
	import { BarChart } from 'chartist';
	import { onMount } from 'svelte';

	let { labels, series, high = 10, low = -10 } = $props();

	onMount(() => {
		new BarChart(
			'#chart',
			{
				labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
				series: [[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]]
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

<div id="chart"></div>
